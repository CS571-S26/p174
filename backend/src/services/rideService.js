import prisma from "../prismaClient.js";

function avatarFromName(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function enrichRide(ride) {
  const takenSeats = await prisma.rideRequest.count({
    where: { rideId: ride.id, status: "confirmed" },
  });

  const requests = await prisma.rideRequest.findMany({
    where: { rideId: ride.id, status: "confirmed" },
    select: { userId: true },
  });

  return {
    id: ride.id,
    driverId: ride.driverId,
    driver: ride.driver?.name ?? null,
    avatar: ride.driver?.avatar ?? avatarFromName(ride.driver?.name || "??"),
    destination: ride.destination,
    date: ride.date.toISOString().split("T")[0],
    time: ride.time,
    pickup: ride.pickup,
    totalSeats: ride.totalSeats,
    takenSeats,
    price: ride.price,
    notes: ride.notes,
    venmo: ride.venmo,
    status: takenSeats >= ride.totalSeats ? "full" : ride.status,
    riders: requests.map((r) => r.userId),
    createdAt: ride.createdAt,
  };
}

export async function enrichMany(rides) {
  return Promise.all(rides.map(enrichRide));
}
