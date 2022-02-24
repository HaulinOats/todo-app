import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const { userId } = req.body;
    const todos = await prisma.todo.findMany({
      where: {
        userId: userId,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });
    res.json(todos);
  }
};

export default handler;
