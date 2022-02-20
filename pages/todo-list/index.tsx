import { PrismaClient } from '@prisma/client';
import type { NextPage } from 'next';
import TodoList from '../../components/TodoList';
import MainLayout from '../../layouts/MainLayout';
import { TodoItem as TodoItemType } from '../../types/TodoItem.type';

interface Props {
  todos:TodoItemType[]
}

const TodoListMain: NextPage<Props> = () => {
  return (
    <MainLayout pageTitle="Todo List - Main Page">
      <TodoList />
    </MainLayout>
  )
}

//Leaving these commented for code review discussion

// export const getStaticProps = async () => {
//   const prisma = new PrismaClient();
//   const todos = await prisma.todo.findMany();
//   return {
//     props : { todos }
//   }
// }

// export const getServerSideProps = async () => {
//   const prisma = new PrismaClient();
//   const todos = await prisma.todo.findMany();
//   return {
//     props: { todos }
//   }
// }

export default TodoListMain;
