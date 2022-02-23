import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (_req, res) => {
  const deletedTodos = await prisma.todo.deleteMany({
    where: {
      isCompleted: true,
    },
  });
  res.json(deletedTodos);
};

export default handler;
