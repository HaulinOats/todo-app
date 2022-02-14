import { FC, useState, KeyboardEvent, useEffect, ChangeEvent } from "react";
import styles from '../styles/todo.module.css';

interface Todo {
  label:string
  completed:boolean
}

const Todo:FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoView, setTodoView] = useState('all');

  useEffect(() =>{
    if(localStorage.getItem('todos')){
      setTodos(JSON.parse(localStorage.getItem('todos') as string));
    }
  },[])

  const addTodo = (e:KeyboardEvent) => {
    if(e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const tempTodos = [...todos, {
        label:target.value,
        completed:false
      }]
      setTodos(tempTodos);
      saveTodos(tempTodos);
      target.value = '';
    }
  }

  const deleteTodo = (e:React.MouseEvent, idx:number) => {
    const tempTodos = [...todos];
    tempTodos.splice(idx, 1);
    setTodos(tempTodos);
    saveTodos(tempTodos);
  }

  const toggleTodoCompleted = (e:ChangeEvent, idx:number) => {
    const tempTodos = [...todos];
    tempTodos[idx].completed = !tempTodos[idx].completed;
    setTodos(tempTodos);
    saveTodos(tempTodos);
  }

  const saveTodos = (todos:Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log({todos});
  }

  const clearCompletedTodos = () => {
    const tempTodos = todos.filter(todo => !todo.completed);
    setTodos(tempTodos);
    saveTodos(tempTodos); 
  }

  return (
    <div className={styles.todo}>
      <h1 className={styles.title}>todos</h1>
      <div className={styles.main}>
        <header className={styles.header}>
          <input type="text" placeholder="What needs to be done?" className={styles.new_todo} onKeyDown={e => addTodo(e)}/>
        </header>
        <ul className={styles.todo_list}>
          {todos.map((todo, idx) => {return(
            <li key={idx} className={todo.completed ? 'completed' : ''}>
              <div className={styles.completed_toggle}>
                <input id={`completed_toggle_${idx}`} type="checkbox" onChange={e => toggleTodoCompleted(e, idx)} checked={todo.completed} />
                <label htmlFor={`completed_toggle_${idx}`}></label>
              </div>
              <label className={styles.todo_main_label}>{todo.label}</label>
              <button className={styles.delete_todo} onClick={e => deleteTodo(e, idx)}></button>
            </li>
          )})}
        </ul>
        <footer className={styles.footer}>
          <span>{todos.filter(todo => !todo.completed).length} items left</span>
          <ul className={styles.filters}>
            <li><a>All</a></li>  
            <li><a>Active</a></li>
            <li><a>Completed</a></li>  
          </ul>
          <span onClick={e => clearCompletedTodos()}><a>Clear Completed</a></span>
        </footer>
      </div>
    </div>
  )
}

export default Todo;