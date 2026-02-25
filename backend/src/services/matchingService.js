import prisma from "../prismaClient.js";

export async function findMatches(userId, destination, targetDate) {
  const rides = await prisma.ride.findMany({
    where: {
      status: "open",
      driverId: { not: userId },
      date: { gte: new Date() },
    },
    include: { driver: { select: { name: true, avatar: true } } },
  });

  const scored = [];

  for (const ride of rides) {
    const takenSeats = await prisma.rideRequest.count({
      where: { rideId: ride.id, status: "confirmed" },
    });
    const seatsLeft = ride.totalSeats - takenSeats;
    if (seatsLeft <= 0) continue;

    let score = 0;

    if (ride.destination === destination) {
      score += 50;
    } else {
      const firstWord = destination.split(" ")[0].toLowerCase();
      if (ride.destination.toLowerCase().includes(firstWord)) score += 25;
    }

    const target = new Date(targetDate);
    const dayDiff = Math.abs(
      (ride.date.getTime() - target.getTime()) / 86_400_000
    );
    if (dayDiff < 1) score += 40;
    else if (dayDiff <= 1) score += 25;
    else if (dayDiff <= 3) score += 10;

    score += Math.min(seatsLeft * 3, 10);

    if (score > 0) {
      scored.push({
        id: ride.id,
        driverId: ride.driverId,
        driver: ride.driver.name,
        avatar: ride.driver.avatar,
        destination: ride.destination,
        date: ride.date.toISOString().split("T")[0],
        time: ride.time,
        pickup: ride.pickup,
        totalSeats: ride.totalSeats,
        takenSeats,
        price: ride.price,
        notes: ride.notes,
        venmo: ride.venmo,
        status: ride.status,
        seatsLeft,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}
