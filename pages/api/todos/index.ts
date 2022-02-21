import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (_req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  res.json(todos);
};

export default handler;
