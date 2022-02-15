import { FC, useState, KeyboardEvent, useEffect, ChangeEvent } from "react";
import styles from '../styles/todo.module.css';

interface Todo {
  label:string
  completed:boolean
  isEditing:boolean
}

const Todo:FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoView, setTodoView] = useState('all');

  //load todos at mount of app
  useEffect(() =>{
    setTodos(JSON.parse(localStorage.getItem('todos') as string) || []);
    setTodoView(localStorage.getItem('todoView') as string || 'all');
  },[])

  //store todos in localStorage on update
  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log({todos});
  },[todos])

  //store todoView in localStorage on update
  useEffect(()=>{
    localStorage.setItem('todoView', todoView);
    console.log({todoView});
  },[todoView])

  const addTodo = (e:KeyboardEvent) => {
    if(e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      let tempTodos = [...todos, {
        label:target.value,
        completed:false,
        isEditing:false
      }]
      setTodos(tempTodos);
      target.value = '';
    }
  }

  const deleteTodo = (idx:number) => {
    let tempTodos = [...todos];
    tempTodos.splice(idx, 1);
    setTodos(tempTodos);
  }

  const updateTodo = (e:KeyboardEvent, idx:number) => {
    
  }

  const toggleTodoCompleted = (idx:number) => {
    let tempTodos = [...todos];
    tempTodos[idx].completed = !tempTodos[idx].completed;
    setTodos(tempTodos);
  }

  const clearCompletedTodos = () => {
    let tempTodos = todos.filter(todo => !todo.completed);
    setTodos(tempTodos);
  }

  const makeEditable = (idx:number) => {
    let tempTodos = [...todos];
    tempTodos[idx].isEditing = true;
    setTodos(tempTodos);
  }

  const todoViewFilter = (todo:Todo) => {
    switch(todoView){
      case 'all':
        return todo;
      case 'active':
        if(!todo.completed) return todo;
        break;
      case 'completed':
        if(todo.completed) return todo;
        break;
    }
  }

  return (
    <div className={styles.todo}>
      <h1 className={styles.title}>todos</h1>
      <div className={styles.main}>
        <header className={styles.header}>
          <input type="text" placeholder="What needs to be done?" className={styles.new_todo} onKeyDown={e => addTodo(e)}/>
        </header>
        <ul className={styles.todo_list}>
          {todos.filter(todoViewFilter).map((todo, idx) => {return(
            <li key={idx}>
              <div className={styles.completed_toggle}>
                <input id={`completed_toggle_${idx}`} type="checkbox" onChange={e => toggleTodoCompleted(idx)} checked={todo.completed} />
                <label htmlFor={`completed_toggle_${idx}`}></label>
              </div>
              <label onDoubleClick={e => makeEditable(idx)} className={styles.todo_main_label + " " + (todo.completed ? styles.todo_main_label_completed : '')} onKeyDown={e => updateTodo(e, idx)} contentEditable={todo.isEditing ? true : false}>{todo.label}</label>
              <button className={styles.delete_todo} onClick={e => deleteTodo(idx)}></button>
            </li>
          )})}
        </ul>
        <footer className={styles.footer}>
          <span>{todos.filter(todo => !todo.completed).length} items left</span>
          <ul className={styles.filters}>
            <li className={todoView === 'all' ? styles.active_filter_view : ''} onClick={e => setTodoView('all')}><a>All</a></li>
            <li className={todoView === 'active' ? styles.active_filter_view : ''} onClick={e => setTodoView('active')}><a>Active</a></li>
            <li className={todoView === 'completed' ? styles.active_filter_view : ''} onClick={e => setTodoView('completed')}><a>Completed</a></li>  
          </ul>
          <span onClick={e => clearCompletedTodos()}><a>Clear Completed</a></span>
        </footer>
      </div>
    </div>
  )
}

export default Todo;