import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  const todoId = req.query.id;
  const deletedTodo = await prisma.todo.delete({
    where: {
      id: Number(todoId),
    },
  });
  res.json(deletedTodo.id);
};

export default handler;
