import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TodoList from "../../components/TodoList";
import MainLayout from "../../layouts/MainLayout";
import { Filter } from "../../types/Filter.type";
import { TodoItem as TodoItemType } from "../../types/TodoItem.type";

interface Props {
  todos: TodoItemType[];
}

const TodoListMain: NextPage<Props> = () => {
  const router = useRouter();
  const filter = (router.query.filter as Filter) || "all";

  return (
    <MainLayout pageTitle="Todo List - Main Page">
      <TodoList activeFilter={filter} />
    </MainLayout>
  );
};

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
