import Link from 'next/link'
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <>
      <header className={styles.header}>
        <h1><Link href="/"><a>Todo List App</a></Link></h1>
        <ul>
          <li><Link href="/"><a>Home</a></Link></li>
          <li><Link href="/todo-list/#"><a>Todo List</a></Link></li>
        </ul >
      </header >
    </>
  )
}

export default Header;