import { PrismaClient } from '@prisma/client';
import type { NextPage } from 'next'
import MainLayout from '../layouts/MainLayout'

const Home: NextPage = (props) => {
  console.log({props});
  return (
    <MainLayout pageTitle="Todo List - Homepage">
      <h1>Todo App Homepage</h1>
    </MainLayout>
  )
}

export default Home;
