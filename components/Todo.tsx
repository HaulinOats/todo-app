import { FC, useState, KeyboardEvent, useEffect, ChangeEvent } from "react";
import styles from '../styles/todo.module.css';

interface Todo {
  label:string
  completed:boolean
}

const Todo:FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() =>{
    if(localStorage.getItem('todos')){
      setTodos(JSON.parse(localStorage.getItem('todos') as string));
      console.log(JSON.parse(localStorage.getItem('todos') as string));
    }
  },[])

  const addTodo = (e:KeyboardEvent) => {
    if(e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      setTodos([...todos, {
        label:target.value,
        completed:false
      }]);
      localStorage.setItem('todos', JSON.stringify(todos));
      console.log({todos});
      target.value = '';
    }
  }

  const deleteTodo = (e:React.MouseEvent, idx:number) => {
    const tempTodos = [...todos];
    tempTodos.splice(idx, 1);
    setTodos(tempTodos);
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log({todos});
  }

  const toggleTodoCompleted = (e:ChangeEvent, idx:number) => {
    const tempTodos = [...todos];
    tempTodos[idx].completed = !tempTodos[idx].completed;
    setTodos(tempTodos);
    localStorage.setItem('todos', JSON.stringify(tempTodos));
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
          <span><a>Clear Completed</a></span>
        </footer>
      </div>
    </div>
  )
}

export default Todo;