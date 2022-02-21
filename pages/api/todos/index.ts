import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (_req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: [
      {
        id: "asc",
      },
    ],
  });
  res.json(todos);
};

export default handler;
