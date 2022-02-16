// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { TodoItem } from '../../types/TodoItem.type';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
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