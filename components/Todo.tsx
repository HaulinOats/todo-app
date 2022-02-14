import { FC, useState, KeyboardEvent } from "react";
import styles from '../styles/todo.module.css';

interface Todo {
  label:string,
  completed:boolean
}

const Todo:FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (e:KeyboardEvent) => {
    if(e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      setTodos([...todos, {
        label:target.value,
        completed:false
      }]);
      target.value = "";
    }
  }

  return (
    <div className={styles.todo}>
      <h1 className={styles.title}>Todos</h1>
      <div className={styles.main}>
        <header className={styles.header}>
          <input type="text" placeholder="What needs to be done?" className={styles.new_todo} onKeyDown={e => addTodo(e)}/>
        </header>
        <ul className={styles.todo_list}>
          {todos.map(todo => {return(
              <li className={styles.single_todo}>
                <input type="checkbox" checked={todo.completed}/>
                <label>{todo.label}</label>
                <button></button>
              </li>
          )})}
        </ul>
        <footer className={styles.footer}>
          <span>{todos.filter(todo => !todo.completed).length} items left</span>
          <ul className={styles.filters}>
            <li>All</li>  
            <li>Active</li>
            <li>Completed</li>  
          </ul>
          <span>Clear Completed</span>
        </footer>
      </div>
    </div>
  )
}

export default Todo;