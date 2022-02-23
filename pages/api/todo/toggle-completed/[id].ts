import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const todoId = req.query.id;
  const { isCompleted } = req.body;
  const updatedTodo = await prisma.todo.update({
    where: {
      id: Number(todoId),
    },
    data: {
      isCompleted: isCompleted,
    },
  });
  res.json(updatedTodo);
};

export default handler;
