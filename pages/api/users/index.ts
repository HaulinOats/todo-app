import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  res.json(users);
};

export default handler;
