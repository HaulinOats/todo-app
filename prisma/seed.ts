import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.createMany({
    data: [
      { name: "Brett Connolly" },
      { name: "Nathaniel Bibler" },
      { name: "Nick Walsh" },
    ],
  });
};

main();
