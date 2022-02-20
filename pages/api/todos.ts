import { PrismaClient } from '@prisma/client'
import type { TodoItem } from '../../types/TodoItem.type';
import type { NextApiHandler } from 'next';

const prisma = new PrismaClient();

//take note to use NextApiHandler
const handler: NextApiHandler = async (req, res) => {
  //originally was going to use switch cases but it doesn't have block-scoping unless you add your own brackets
  if(req.method === 'POST'){
    const label = req.body.label as string;
    const newTodo = await prisma.todo.create({
      data: {
        label
      }
    });
    res.json(newTodo);
    console.log({newTodo});
  }
  else if (req.method === 'GET'){
    const todos = await prisma.todo.findMany();
    res.json(todos);
  }
  else if (req.method === 'PUT'){
    const label = req.body.label as string;
    const id = req.body.id as number;
    const updatedTodo = await prisma.todo.update({
      where: {
        id
      },
      data: {
        label
      }
    });
    res.send(updatedTodo);
  }
  else if (req.method === 'DELETE'){
    const id = req.body.todoId as number;
    const deletedTodo = await prisma.todo.delete({
      where:{
        id
      }
    });
    res.json(deletedTodo);
  }
  await prisma.$disconnect();
}

export default handler;
