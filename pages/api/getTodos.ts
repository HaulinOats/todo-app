// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { TodoItem } from '../../types/TodoItem.type';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
  res.status(200).json([
    {
      id: createUniqueTodoId(),
      label: 'First Todo Item',
      isCompleted: false
    },
    {
      id: createUniqueTodoId(),
      label: 'Second Todo Item',
      isCompleted: false
    },
    {
      id: createUniqueTodoId(),
      label: 'Third Todo Item',
      isCompleted: false
    },
    {
      id: createUniqueTodoId(),
      label: 'Fourth Todo Item',
      isCompleted: false
    },
  ])
}

function createUniqueTodoId() {
  return Date.now() + Math.random();
}