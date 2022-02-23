import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  const deletedTodo = await prisma.todo.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(deletedTodo.id);
};

export default handler;
