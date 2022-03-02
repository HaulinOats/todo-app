import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
    },
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  });
  res.json(todos);
};

export default handler;
