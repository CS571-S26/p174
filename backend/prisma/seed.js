import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function avatar(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return new Date(d.toISOString().split("T")[0] + "T00:00:00.000Z");
}

async function main() {
  console.log("🌱 Seeding BadgerRides database...\n");

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.rideRequest.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("password123", 12);

  // ── Users ──────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Alex Johnson", email: "alex@wisc.edu", password: pw, year: "Junior", avatar: "AJ", venmo: "@alex-j" } }),
    prisma.user.create({ data: { name: "Maya Chen", email: "maya.chen@wisc.edu", password: pw, year: "Senior", avatar: "MC", venmo: "@maya-chen" } }),
    prisma.user.create({ data: { name: "Jake Williams", email: "jake.w@wisc.edu", password: pw, year: "Sophomore", avatar: "JW", venmo: "@jake-w" } }),
    prisma.user.create({ data: { name: "Priya Patel", email: "priya.patel@wisc.edu", password: pw, year: "Junior", avatar: "PP", venmo: "@priya-p" } }),
    prisma.user.create({ data: { name: "Sam Rodriguez", email: "sam.rod@wisc.edu", password: pw, year: "Senior", avatar: "SR", venmo: "@sam-rod" } }),
    prisma.user.create({ data: { name: "Emma Thompson", email: "emma.t@wisc.edu", password: pw, year: "Freshman", avatar: "ET", venmo: "@emma-t" } }),
    prisma.user.create({ data: { name: "Daniel Kim", email: "daniel.kim@wisc.edu", password: pw, year: "Junior", avatar: "DK", venmo: "" } }),
    prisma.user.create({ data: { name: "Lily Zhang", email: "lily.z@wisc.edu", password: pw, year: "Sophomore", avatar: "LZ", venmo: "@lily-z" } }),
    prisma.user.create({ data: { name: "Marcus Brown", email: "marcus.b@wisc.edu", password: pw, year: "Senior", avatar: "MB", venmo: "@marcus-b" } }),
    prisma.user.create({ data: { name: "Sofia Garcia", email: "sofia.g@wisc.edu", password: pw, year: "Freshman", avatar: "SG", venmo: "@sofia-g" } }),
  ]);

  const [alex, maya, jake, priya, sam, emma, daniel, lily, marcus, sofia] = users;
  console.log(`  ✓ Created ${users.length} users (login: alex@wisc.edu / password123)`);

  // ── Rides ──────────────────────────────────────────────────────
  const rides = await Promise.all([
    prisma.ride.create({ data: {
      driverId: maya.id, destination: "O'Hare Airport (ORD)", date: futureDate(10),
      time: "06:00", pickup: "Union South", totalSeats: 4, price: 25,
      notes: "Leaving early for spring break! Trunk space for 2 large bags.", venmo: "@maya-chen",
    }}),
    prisma.ride.create({ data: {
      driverId: jake.id, destination: "Chicago Downtown", date: futureDate(10),
      time: "14:00", pickup: "Sellery Residence Hall", totalSeats: 3, price: 20,
      notes: "Playing music the whole ride, good vibes only", venmo: "@jake-w",
    }}),
    prisma.ride.create({ data: {
      driverId: priya.id, destination: "Milwaukee", date: futureDate(9),
      time: "17:30", pickup: "Dejope Residence Hall", totalSeats: 3, price: 15,
      notes: "Quick trip for the weekend. No stops.", venmo: "@priya-p",
    }}),
    prisma.ride.create({ data: {
      driverId: sam.id, destination: "Minneapolis", date: futureDate(11),
      time: "08:00", pickup: "Memorial Union", totalSeats: 4, price: 35,
      notes: "Road trip to MSP! Splitting gas evenly.", venmo: "@sam-rod",
    }}),
    prisma.ride.create({ data: {
      driverId: alex.id, destination: "Midway Airport (MDW)", date: futureDate(12),
      time: "10:00", pickup: "Engineering Hall", totalSeats: 3, price: 22,
      notes: "Heading to Midway for a flight. Can fit 2 suitcases.", venmo: "@alex-j",
    }}),
    prisma.ride.create({ data: {
      driverId: emma.id, destination: "O'Hare Airport (ORD)", date: futureDate(10),
      time: "11:00", pickup: "Witte Residence Hall", totalSeats: 4, price: 25,
      notes: "Spring break flight at 3pm. Leaving with buffer time.", venmo: "@emma-t",
    }}),
    prisma.ride.create({ data: {
      driverId: daniel.id, destination: "Madison Airport (MSN)", date: futureDate(9),
      time: "15:00", pickup: "Camp Randall", totalSeats: 2, price: 8,
      notes: "Short ride to MSN. First come first served.",
    }}),
    prisma.ride.create({ data: {
      driverId: lily.id, destination: "Chicago Downtown", date: futureDate(11),
      time: "09:00", pickup: "Lakeshore Path & Observatory Dr", totalSeats: 3, price: 20,
      notes: "Going to visit friends in Lincoln Park area.", venmo: "@lily-z",
    }}),
    prisma.ride.create({ data: {
      driverId: marcus.id, destination: "Green Bay", date: futureDate(13),
      time: "12:00", pickup: "Union South", totalSeats: 4, price: 18,
      notes: "Heading up for family visit. Happy to stop in Appleton.", venmo: "@marcus-b",
    }}),
    prisma.ride.create({ data: {
      driverId: alex.id, destination: "Milwaukee", date: futureDate(15),
      time: "16:00", pickup: "Memorial Union", totalSeats: 3, price: 15,
      notes: "Weekend trip! Concert at the Riverside Theater.", venmo: "@alex-j",
    }}),
    prisma.ride.create({ data: {
      driverId: sofia.id, destination: "Rockford", date: futureDate(8),
      time: "13:00", pickup: "Sellery Residence Hall", totalSeats: 3, price: 12,
      notes: "Going home for the weekend, can drop off along I-90.", venmo: "@sofia-g",
    }}),
    prisma.ride.create({ data: {
      driverId: maya.id, destination: "Milwaukee", date: futureDate(7),
      time: "18:00", pickup: "Memorial Union", totalSeats: 2, price: 15,
      notes: "Bucks game! Need to be there by 7pm.", venmo: "@maya-chen",
    }}),
  ]);

  const [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12] = rides;
  console.log(`  ✓ Created ${rides.length} rides`);

  // ── Ride Requests (riders joining) ─────────────────────────────
  // r1 (Maya → O'Hare): emma joined
  await prisma.rideRequest.create({ data: { rideId: r1.id, userId: emma.id, status: "confirmed" } });

  // r2 (Jake → Chicago): sam and sofia joined
  await prisma.rideRequest.create({ data: { rideId: r2.id, userId: sam.id, status: "confirmed" } });
  await prisma.rideRequest.create({ data: { rideId: r2.id, userId: sofia.id, status: "confirmed" } });

  // r3 (Priya → Milwaukee): alex, sam, and lily joined → FULL
  await prisma.rideRequest.create({ data: { rideId: r3.id, userId: alex.id, status: "confirmed" } });
  await prisma.rideRequest.create({ data: { rideId: r3.id, userId: sam.id, status: "confirmed" } });
  await prisma.rideRequest.create({ data: { rideId: r3.id, userId: lily.id, status: "confirmed" } });
  await prisma.ride.update({ where: { id: r3.id }, data: { status: "full" } });

  // r4 (Sam → Minneapolis): daniel joined
  await prisma.rideRequest.create({ data: { rideId: r4.id, userId: daniel.id, status: "confirmed" } });

  // r6 (Emma → O'Hare): daniel joined
  await prisma.rideRequest.create({ data: { rideId: r6.id, userId: daniel.id, status: "confirmed" } });

  // r10 (Alex → Milwaukee): jake joined
  await prisma.rideRequest.create({ data: { rideId: r10.id, userId: jake.id, status: "confirmed" } });

  // r12 (Maya → Milwaukee Bucks): alex and jake → FULL
  await prisma.rideRequest.create({ data: { rideId: r12.id, userId: alex.id, status: "confirmed" } });
  await prisma.rideRequest.create({ data: { rideId: r12.id, userId: jake.id, status: "confirmed" } });
  await prisma.ride.update({ where: { id: r12.id }, data: { status: "full" } });

  console.log("  ✓ Created ride requests");

  // ── Conversations ──────────────────────────────────────────────
  const c1 = await prisma.conversation.create({
    data: {
      rideId: r1.id,
      participants: { create: [{ userId: alex.id }, { userId: maya.id }] },
    },
  });

  const c2 = await prisma.conversation.create({
    data: {
      rideId: r3.id,
      participants: { create: [{ userId: alex.id }, { userId: priya.id }] },
    },
  });

  const c3 = await prisma.conversation.create({
    data: {
      rideId: r4.id,
      participants: { create: [{ userId: alex.id }, { userId: sam.id }] },
    },
  });

  const c4 = await prisma.conversation.create({
    data: {
      rideId: r10.id,
      participants: { create: [{ userId: alex.id }, { userId: jake.id }] },
    },
  });

  console.log("  ✓ Created 4 conversations");

  // ── Messages ───────────────────────────────────────────────────
  const now = Date.now();
  const hr = 3_600_000;

  // Conversation 1: Alex ↔ Maya (O'Hare ride)
  await prisma.message.createMany({
    data: [
      { conversationId: c1.id, fromUserId: alex.id, text: "Hey Maya! Any room for one more to O'Hare?", timestamp: new Date(now - 8 * hr) },
      { conversationId: c1.id, fromUserId: maya.id, text: "Hi Alex! Yes, I still have seats open. You're welcome to join!", timestamp: new Date(now - 7.9 * hr) },
      { conversationId: c1.id, fromUserId: alex.id, text: "Awesome! I have one large suitcase, is that ok?", timestamp: new Date(now - 7.8 * hr) },
      { conversationId: c1.id, fromUserId: maya.id, text: "Totally fine, plenty of trunk space. See you at Union South at 6am!", timestamp: new Date(now - 7.5 * hr) },
      { conversationId: c1.id, fromUserId: alex.id, text: "Perfect, I'll Venmo you the night before. Thanks!", timestamp: new Date(now - 7 * hr) },
      { conversationId: c1.id, fromUserId: maya.id, text: "Sounds good! Safe travels 🚗", timestamp: new Date(now - 6.5 * hr) },
    ],
  });

  // Conversation 2: Alex ↔ Priya (Milwaukee ride)
  await prisma.message.createMany({
    data: [
      { conversationId: c2.id, fromUserId: alex.id, text: "Hi Priya, is there still room for the Milwaukee ride?", timestamp: new Date(now - 24 * hr) },
      { conversationId: c2.id, fromUserId: priya.id, text: "Hey! Yes, one spot left. Leaving from Dejope at 5:30pm sharp.", timestamp: new Date(now - 23.5 * hr) },
      { conversationId: c2.id, fromUserId: alex.id, text: "Perfect, I'll be there. Venmo you after?", timestamp: new Date(now - 23 * hr) },
      { conversationId: c2.id, fromUserId: priya.id, text: "Yep! $15 per person. See you Thursday!", timestamp: new Date(now - 22.5 * hr) },
      { conversationId: c2.id, fromUserId: alex.id, text: "Awesome, thanks for the ride! 🙌", timestamp: new Date(now - 22 * hr) },
    ],
  });

  // Conversation 3: Alex ↔ Sam (Minneapolis ride)
  await prisma.message.createMany({
    data: [
      { conversationId: c3.id, fromUserId: sam.id, text: "Hey Alex, saw you might be interested in the Minneapolis ride?", timestamp: new Date(now - 5 * hr) },
      { conversationId: c3.id, fromUserId: alex.id, text: "Yeah! What time are you thinking of leaving?", timestamp: new Date(now - 4.8 * hr) },
      { conversationId: c3.id, fromUserId: sam.id, text: "8am from Memorial Union. Should get there by noon with one stop.", timestamp: new Date(now - 4.5 * hr) },
      { conversationId: c3.id, fromUserId: alex.id, text: "That works for me. Do you have room for a carry-on bag?", timestamp: new Date(now - 4 * hr) },
      { conversationId: c3.id, fromUserId: sam.id, text: "For sure! Plenty of space. Just be on time 😄", timestamp: new Date(now - 3.5 * hr) },
      { conversationId: c3.id, fromUserId: alex.id, text: "Will do! See you Saturday morning.", timestamp: new Date(now - 3 * hr) },
      { conversationId: c3.id, fromUserId: sam.id, text: "Looking forward to it! Road trip vibes 🎶", timestamp: new Date(now - 2.5 * hr) },
    ],
  });

  // Conversation 4: Alex ↔ Jake (Milwaukee concert ride)
  await prisma.message.createMany({
    data: [
      { conversationId: c4.id, fromUserId: jake.id, text: "Yo Alex! Stoked for the Milwaukee concert ride", timestamp: new Date(now - 2 * hr) },
      { conversationId: c4.id, fromUserId: alex.id, text: "Same! It's gonna be great. Leaving at 4pm from Memorial Union.", timestamp: new Date(now - 1.8 * hr) },
      { conversationId: c4.id, fromUserId: jake.id, text: "Sweet. Want me to grab snacks for the road?", timestamp: new Date(now - 1.5 * hr) },
      { conversationId: c4.id, fromUserId: alex.id, text: "Yes please! I'll get the aux cord ready 🎵", timestamp: new Date(now - 1 * hr) },
      { conversationId: c4.id, fromUserId: jake.id, text: "Deal. This is gonna be legendary.", timestamp: new Date(now - 0.5 * hr) },
    ],
  });

  console.log("  ✓ Created messages\n");
  console.log("🎉 Seed complete!\n");
  console.log("  Test login: alex@wisc.edu / password123\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
