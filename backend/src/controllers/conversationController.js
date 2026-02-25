import prisma from "../prismaClient.js";

export async function listConversations(req, res, next) {
  try {
    const convos = await prisma.conversation.findMany({
      where: { participants: { some: { userId: req.userId } } },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        ride: { select: { destination: true, date: true } },
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
          include: { fromUser: { select: { name: true } } },
        },
      },
    });

    const result = convos
      .map((c) => {
        const other = c.participants.find((p) => p.userId !== req.userId);
        const lastMsg = c.messages[0] || null;
        const dateStr = c.ride.date.toISOString().split("T")[0];
        const month = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

        return {
          id: c.id,
          rideId: c.ride ? c.rideId : null,
          rideLabel: `${c.ride.destination.split(" ")[0]} — ${month}`,
          with: other ? { id: other.user.id, name: other.user.name, avatar: other.user.avatar } : null,
          lastMessage: lastMsg ? { text: lastMsg.text, ts: lastMsg.timestamp, from: lastMsg.fromUser.name } : null,
          updatedAt: lastMsg?.timestamp || c.createdAt,
        };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({ conversations: result });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const convo = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: { participants: true },
    });

    if (!convo) return res.status(404).json({ error: "Conversation not found" });

    const isParticipant = convo.participants.some((p) => p.userId === req.userId);
    if (!isParticipant) {
      return res.status(403).json({ error: "Not a participant" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { timestamp: "asc" },
      include: { fromUser: { select: { id: true, name: true, avatar: true } } },
    });

    res.json({
      messages: messages.map((m) => ({
        id: m.id,
        from: m.fromUserId,
        fromUser: m.fromUser,
        text: m.text,
        ts: m.timestamp,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const convo = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: { participants: true },
    });

    if (!convo) return res.status(404).json({ error: "Conversation not found" });

    const isParticipant = convo.participants.some((p) => p.userId === req.userId);
    if (!isParticipant) {
      return res.status(403).json({ error: "Not a participant" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        fromUserId: req.userId,
        text: text.trim(),
      },
      include: { fromUser: { select: { id: true, name: true, avatar: true } } },
    });

    const payload = {
      id: message.id,
      conversationId: message.conversationId,
      from: message.fromUserId,
      fromUser: message.fromUser,
      text: message.text,
      ts: message.timestamp,
    };

    // Emit via Socket.IO if available
    const io = req.app.get("io");
    if (io) {
      io.to(req.params.id).emit("new-message", payload);
    }

    res.status(201).json({ message: payload });
  } catch (err) {
    next(err);
  }
}

export async function createConversation(req, res, next) {
  try {
    const { rideId, participantIds } = req.body;

    if (!rideId || !participantIds || participantIds.length !== 2) {
      return res.status(400).json({ error: "rideId and exactly 2 participantIds required" });
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        rideId,
        AND: participantIds.map((uid) => ({
          participants: { some: { userId: uid } },
        })),
      },
    });

    if (existing) {
      return res.json({ conversation: { id: existing.id }, existing: true });
    }

    const convo = await prisma.conversation.create({
      data: {
        rideId,
        participants: {
          create: participantIds.map((uid) => ({ userId: uid })),
        },
      },
    });

    res.status(201).json({ conversation: { id: convo.id }, existing: false });
  } catch (err) {
    next(err);
  }
}
