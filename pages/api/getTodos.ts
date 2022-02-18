// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { TodoItem } from '../../types/TodoItem.type';
import type { NextApiHandler } from 'next';

//take note to use NextApiHandler
const handler: NextApiHandler<TodoItem[]> = (_req, res) => {
  res.status(200).json([
    {
      id: 1,
      label: 'First Todo Item',
      isCompleted: false
    },
    {
      id: 2,
      label: 'Second Todo Item',
      isCompleted: false
    },
    {
      id: 3,
      label: 'Third Todo Item',
      isCompleted: false
    },
    {
      id: 4,
      label: 'Fourth Todo Item',
      isCompleted: false
    },
  ])
}

export default handler;
