import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const todoId = req.query.id;
  const { is_completed } = req.body;
  const newTodo = await prisma.todo.update({
    where: {
      id: Number(todoId),
    },
    data: {
      is_completed: is_completed,
    },
  });
  res.json(newTodo);
};

export default handler;
