import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const todoId = req.query.id;
  const { label } = req.body;
  const newTodo = await prisma.todo.update({
    where: {
      id: Number(todoId),
    },
    data: {
      label: label,
    },
  });
  res.json(newTodo);
};

export default handler;
