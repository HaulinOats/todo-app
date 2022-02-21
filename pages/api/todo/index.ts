import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  const { label, is_completed } = req.body;
  const newTodo = await prisma.todo.create({
    data: {
      label: label,
      is_completed: is_completed,
    },
  });
  res.json(newTodo);
};

export default handler;
