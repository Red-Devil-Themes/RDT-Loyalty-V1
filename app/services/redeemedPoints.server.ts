import prisma from "../db.server";

export async function getRedeemedPoints(customerId: string): Promise<number> {
  const record = await prisma.redeemedPoints.findUnique({
    where: { customerId },
  });
  return record ? record.pointsRedeemed : 0;
}

export async function addRedeemedPoints(
  customerId: string,
  points: number,
): Promise<void> {
  await prisma.redeemedPoints.upsert({
    where: { customerId },
    update: { pointsRedeemed: { increment: points } },
    create: { customerId, pointsRedeemed: points },
  });
}
