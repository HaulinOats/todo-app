import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  //originally was going to use switch cases but it doesn't have block-scoping unless you add brackets to case blocks
  if (req.method === "POST") {
    const label = req.body.label as string;
    const newTodo = await prisma.todo.create({
      data: {
        label,
      },
    });
    res.json(newTodo);
  } else if (req.method === "GET") {
    const todos = await prisma.todo.findMany({
      orderBy: [
        {
          id: "desc",
        },
      ],
    });
    res.json(todos);
  } else if (req.method === "PUT") {
    //allows us to define what type of update we're doing
    const updateType = req.body.updateType as string;

    if (updateType === "updateLabel") {
      const label = req.body.label as string;
      const id = req.body.id as number;
      const updatedTodo = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          label,
        },
      });
      res.send(updatedTodo);
    } else if (updateType === "toggleIsCompleted") {
      const id = req.body.id as number;
      const foundTodo = await prisma.todo.findUnique({
        where: {
          id,
        },
      });

      //return if todo wasn't found and close database connection
      if (!foundTodo) {
        res.json({ queryError: "no todo exists for that id" });
        prisma.$disconnect();
        return;
      }
      const updatedTodo = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          is_completed: !foundTodo.is_completed,
        },
      });
      res.send(updatedTodo);
    }
  } else if (req.method === "DELETE") {
    const id = req.body.todoId as number;
    const deletedTodo = await prisma.todo.delete({
      where: {
        id,
      },
    });
    res.json(deletedTodo);
  }
  await prisma.$disconnect();
};

export default handler;
