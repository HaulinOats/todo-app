import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  //empty users table
  //doesn't always work when testing
  //need to learn transactions with prisma
  await prisma.user.deleteMany();
  //create default users
  await prisma.user.createMany({
    data: [
      { name: "Brett Connolly" },
      { name: "Nathaniel Bibler" },
      { name: "Nick Walsh" },
    ],
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
