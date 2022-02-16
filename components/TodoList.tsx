import { FC, useState, KeyboardEvent, useEffect } from "react";
import styles from '../styles/TodoList.module.css';
import TodoItem from "./TodoItem";
import type { TodoItem as TodoItemType } from "../types/TodoItem.type";

const Todo: FC = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [todoView, setTodoView] = useState('all');
  const [allSelected, setAllSelected] = useState(false);

  //get state from localStorage on mount
  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem('todos') as string) || []);
    setTodoView(localStorage.getItem('todoView') as string || 'all');
    setAllSelected(JSON.parse(localStorage.getItem('allSelected') as string) || false);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos])

  useEffect(() => {
    localStorage.setItem('todoView', todoView);
  }, [todoView])

  useEffect(() => {
    localStorage.setItem('allSelected', JSON.stringify(allSelected));
  }, [allSelected])

  const fetchTodos = () => {
    fetch('/api/getTodos')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTodos(data);
      });
  }

  const addTodo = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      let tempTodos = [...todos, {
        id: Date.now(),
        label: target.value,
        isCompleted: false
      }]
      setTodos(tempTodos);
      target.value = '';
    }
  }

  const deleteTodo = (todoId: number) => {
    let tempTodos = [...todos];
    tempTodos.some((todo, idx) => {
      if (todo.id === todoId) {
        tempTodos.splice(idx, 1);
        return;
      }
    });
    setTodos(tempTodos);
  }

  const toggleIsCompleted = (todoId: number): void => {
    let tempTodos = [...todos];
    tempTodos.some(todo => {
      if (todo.id === todoId) {
        todo.isCompleted = !todo.isCompleted;
        return;
      }
    });
    setTodos(tempTodos);
  }

  const clearCompletedTodos = () => {
    let tempTodos = todos.filter(todo => !todo.isCompleted);
    setTodos(tempTodos);
  }

  const updateTodoLabel = (e: React.ChangeEvent, todoId: number): void => {
    let tempTodos = [...todos];
    tempTodos.some(todo => {
      if (todo.id === todoId) {
        todo.label = (e.target as HTMLInputElement).value
        return;
      }
    });
    setTodos(tempTodos);
  }

  const todoViewFilter = (todo: TodoItemType) => {
    switch (todoView) {
      case 'all':
        return todo;
      case 'active':
        if (!todo.isCompleted) return todo;
        break;
      case 'completed':
        if (todo.isCompleted) return todo;
        break;
    }
  }

  const toggleSelectAll = () => {
    let tempAllSelected = !allSelected;
    let tempTodos = [...todos];
    tempTodos.forEach(todo => {
      todo.isCompleted = tempAllSelected;
    })
    setAllSelected(tempAllSelected);
    setTodos(tempTodos);
  }

  return (
    <div className={styles.todo_list_outer}>
      <h1 className={styles.title}>todos</h1>
      <button className={styles.get_todos_btn} onClick={fetchTodos}>&#8594; Import Todos</button>
      <div className={styles.todo_list_main}>
        <header className={styles.header}>
          <p onClick={toggleSelectAll} className={styles.new_todo_selectAll + " " + (todos.every(todo => todo.isCompleted) ? styles.new_todo_selectAll_active : '')}>&#10095;</p>
          <input type="text" placeholder="What needs to be done?" className={styles.new_todo_input} onKeyDown={e => addTodo(e)} />
        </header>
        <ul className={styles.todo_list}>
          {todos.filter(todoViewFilter).map(todo =>
            <TodoItem
              {...{
                key: todo.id,
                todoItem: todo,
                toggleIsCompleted,
                deleteTodo,
                updateTodoLabel
              }}
            />
          )}
        </ul>
        <footer className={styles.footer}>
          <span>{todos.filter(todo => !todo.isCompleted).length} item{todos.filter(todo => !todo.isCompleted).length !== 1 ? 's' : ''} left</span>
          <ul className={styles.filters}>
            <li className={todoView === 'all' ? styles.active_filter_view : ''} onClick={e => setTodoView('all')}><a>All</a></li>
            <li className={todoView === 'active' ? styles.active_filter_view : ''} onClick={e => setTodoView('active')}><a>Active</a></li>
            <li className={todoView === 'completed' ? styles.active_filter_view : ''} onClick={e => setTodoView('completed')}><a>Completed</a></li>
          </ul>
          {!todos.length}
          <span onClick={e => clearCompletedTodos()}><a>Clear Completed</a></span>
        </footer>
      </div>
      <div className={styles.stack_container}>
        <div className={styles.stack_1}></div>
        <div className={styles.stack_2}></div>
      </div>
    </div>
  )
}

export default Todo;