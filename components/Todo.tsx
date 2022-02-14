import { FC, useState, KeyboardEvent, useEffect, ChangeEvent } from "react";
import styles from '../styles/todo.module.css';

interface Todo {
  label:string
  completed:boolean
  isEditing:boolean
}

const Todo:FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  //load todos at mount of app
  useEffect(() =>{
    setTodos(JSON.parse(localStorage.getItem('todos') as string) || []);
  },[])

  //store todos in localStorage whenever it's updated
  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log({todos});
  },[todos])

  const addTodo = (e:KeyboardEvent) => {
    if(e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const tempTodos = [...todos, {
        label:target.value,
        completed:false,
        isEditing:false
      }]
      setTodos(tempTodos);
      target.value = '';
    }
  }

  const deleteTodo = (idx:number) => {
    const tempTodos = [...todos];
    tempTodos.splice(idx, 1);
    setTodos(tempTodos);
  }

  const toggleTodoCompleted = (idx:number) => {
    const tempTodos = [...todos];
    tempTodos[idx].completed = !tempTodos[idx].completed;
    setTodos(tempTodos);
  }

  const clearCompletedTodos = () => {
    const tempTodos = todos.filter(todo => !todo.completed);
    setTodos(tempTodos);
  }

  const makeEditable = (idx:number) => {
    const tempTodos = [...todos];
    tempTodos[idx].isEditing = true;
    setTodos(tempTodos);
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
                <input id={`completed_toggle_${idx}`} type="checkbox" onChange={e => toggleTodoCompleted(idx)} checked={todo.completed} />
                <label htmlFor={`completed_toggle_${idx}`}></label>
              </div>
              <label onDoubleClick={e => makeEditable(idx)} className={styles.todo_main_label}>{todo.label}</label>
              <button className={styles.delete_todo} onClick={e => deleteTodo(idx)}></button>
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