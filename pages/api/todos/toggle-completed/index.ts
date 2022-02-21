import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  const { isAllSelected } = req.body;
  const todos = await prisma.todo.updateMany({
    data: {
      is_completed: isAllSelected,
    },
  });
  res.json(todos);
};

export default handler;
