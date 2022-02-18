import { FC, useState, KeyboardEvent, useEffect, KeyboardEventHandler } from "react";
import styles from '../styles/TodoList.module.css';
import TodoItem from "./TodoItem";
import type { TodoItem as TodoItemType } from "../types/TodoItem.type";

const Todo: FC = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [todoView, setTodoView] = useState('all');

  //get state from localStorage on mount
  useEffect(() => {
    setTodoView(localStorage.getItem('todoView') as string || 'all');
    setTodos(JSON.parse(localStorage.getItem('todos') as string) || []);
    setAllSelected(JSON.parse(localStorage.getItem('allSelected') as string) || false);
  }, []);

  //Simpler way of doing this? Perhaps inside a single useEffect call
  useEffect(() => {
    localStorage.setItem('todoView', todoView);
  }, [todoView])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos])

  useEffect(() => {
    localStorage.setItem('allSelected', JSON.stringify(allSelected));
  }, [allSelected])

  const fetchTodos = () => {
    fetch('/api/getTodos')
      .then(response => response.json())
      .then(data => {
        setTodos(data);
      });
  }

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;

    if (e.key !== 'Enter' || !target.value.trim().length) {
      return;
    }

    setTodos([...todos, {
      id: Date.now(),
      label: target.value,
      isCompleted: false
    }])

    target.value = '';
  }

  const deleteTodo = (todoId: number):void => {
    setTodos(todos.filter((todo) => todo.id !== todoId))
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
    setTodos(todos.filter(todo => !todo.isCompleted));
  }

  const updateTodoLabel = (e: React.ChangeEvent<HTMLInputElement>, todoId: number): void => {
    let tempTodos = [...todos];
    tempTodos.some(todo => {
      if (todo.id === todoId) {
        todo.label = e.currentTarget.value;
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
      //preferred default break?
    }
  }

  const toggleSelectAll = () => {
    let tempTodos = [...todos];
    tempTodos.forEach(todo => {
      todo.isCompleted = !allSelected;
    })
    setAllSelected(!allSelected);
    setTodos(tempTodos);
  }

  return (
    <div className={styles.todo_list_outer}>
      <h1 className={styles.title}>todos</h1>
      <button
        data-test-id="get_todos_btn"
        className={styles.get_todos_btn}
        onClick={fetchTodos}>&#8594; Import Todos</button>
      <div className={styles.todo_list_main}>
        <header className={styles.header}>
          <p data-test-id="new_todo_selectAll"
            onClick={toggleSelectAll}
            className={`${styles.new_todo_selectAll} ${todos.every(todo => todo.isCompleted) ? styles.new_todo_selectAll_active : ''}`}>&#10095;</p>
          <input type="text"
            data-test-id="new_todo_input"
            placeholder="What needs to be done?"
            className={styles.new_todo_input}
            onKeyDown={addTodo} />
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
          <span className={styles.left_cont}>{todos.filter(todo => !todo.isCompleted).length} item{todos.filter(todo => !todo.isCompleted).length !== 1 ? 's' : '\u00A0'} left</span>
          <ul className={styles.filters}>
            <li className={todoView === 'all' ? styles.active_filter_view : ''}>
                <button type="button" onClick={() => setTodoView('all')}>
                  All
                </button>
            </li>
            <li className={todoView === 'active' ? styles.active_filter_view : ''}>
              <button type="button" onClick={() => setTodoView('active')}>
                Active
              </button>
            </li>
            <li className={todoView === 'completed' ? styles.active_filter_view : ''}>
              <button type="button" onClick={() => setTodoView('completed')}>
                Completed
              </button>
            </li>
          </ul>
          <span className={`${styles.right_cont} ${!todos.filter(todo => todo.isCompleted).length ? styles.right_cont_hidden : ''}`} onClick={e => clearCompletedTodos()}><a>Clear Completed</a></span>
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
