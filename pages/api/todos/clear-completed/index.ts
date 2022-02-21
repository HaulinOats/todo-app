import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const deletedTodos = await prisma.todo.deleteMany({
    where: {
      is_completed: true,
    },
  });
  res.json(deletedTodos);
};

export default handler;
