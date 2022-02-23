import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  const { label, isCompleted, userId } = req.body;
  const newTodo = await prisma.todo.create({
    data: {
      label: label,
      isCompleted: isCompleted,
      userId: userId,
    },
  });
  res.json(newTodo);
};

export default handler;
