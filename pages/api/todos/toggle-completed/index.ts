import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const { isAllSelected } = req.body;
  const todos = await prisma.todo.updateMany({
    data: {
      isCompleted: isAllSelected,
    },
  });
  res.json(todos);
};

export default handler;
