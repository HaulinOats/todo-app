import type { NextPage } from 'next'
import Head from 'next/head'
import TodoList from '../components/TodoList'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Todo App built using NextJS, React, and Typescript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <TodoList />
      </main>
    </div>
  )
}

export default Home
