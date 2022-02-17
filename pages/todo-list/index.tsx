import type { NextPage } from 'next'
import TodoList from '../../components/TodoList';
import MainLayout from '../../layouts/MainLayout'

const TodoListMain: NextPage = () => {
  return (
    <MainLayout pageTitle="Todo List - Main Page">
      <TodoList />
    </MainLayout>
  )
}

export default TodoListMain;