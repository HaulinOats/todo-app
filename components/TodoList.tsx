import { FC, useState, useEffect, KeyboardEventHandler } from "react";
import { getErrorMessage } from "../utils/util";
import styles from "../styles/TodoList.module.css";
import TodoItem from "./TodoItem";
import ErrorMessage from "./ErrorMessage";
import type { TodoItem as TodoItemType } from "../types/TodoItem.type";
import classnames from "classnames";
import TodoFilters from "./TodoFilters";
import { Filter } from "../types/Filter.type";

interface Props {
  activeFilter: Filter;
}

type TodoListUser = {
  id: number;
  name: string;
};

const TodoList: FC<Props> = ({ activeFilter }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [users, setUsers] = useState<TodoListUser[]>([]);
  const [currentUser, setCurrentUser] = useState<TodoListUser | undefined>(
    undefined
  );

  useEffect(() => {
    getTodoListUsers();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchTodos();
  }, [currentUser]);

  const getTodoListUsers = async () => {
    try {
      const response = await fetch(`/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const users = await response.json();
      setUsers(users);
      setCurrentUser(users[0]);
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser?.id,
        }),
      });
      const resTodos = await response.json();
      setTodos(resTodos);
      //check if all todos are completed and update allSelected
      setAllSelected(resTodos.every((todo: TodoItemType) => todo.isCompleted));
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const addTodo: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    const target = e.currentTarget;
    if (e.key !== "Enter" || !target.value.trim().length) {
      return;
    }

    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: target.value,
          userId: currentUser?.id,
        }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      target.value = "";
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      const response = await fetch(`/api/todo/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const _deletedTodo = await response.json();
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const toggleIsCompleted = async (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => {
    try {
      const response = await fetch(`/api/todo/toggle-completed/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: e.currentTarget.checked,
        }),
      });
      const updatedTodo = await response.json();
      const todoIdx = todos.findIndex((todo) => todo.id === todoId);
      const tempTodos = [...todos];
      tempTodos[todoIdx] = updatedTodo;
      setTodos(tempTodos);
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const clearCompletedTodos = async () => {
    try {
      await fetch(`/api/todos/clear-completed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTodos(todos.filter((todo) => !todo.isCompleted));
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const updateTodoLabel = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ): void => {
    const todoIdx = todos.findIndex((todo) => todo.id === todoId);
    const tempTodos = [...todos];
    tempTodos[todoIdx].label = e.currentTarget.value;
    setTodos(tempTodos);
  };

  const submitTodoLabel = async (todoId: number, label: string) => {
    try {
      const response = await fetch(`/api/todo/update-label/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: label,
        }),
      });
      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) => {
          if (todo.id === todoId) {
            return updatedTodo;
          }
          return todo;
        })
      );
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const activeFilterFilter = (todo: TodoItemType) => {
    switch (activeFilter) {
      case "all":
        return todo;
      case "active":
        if (!todo.isCompleted) return todo;
        break;
      case "completed":
        if (todo.isCompleted) return todo;
        break;
    }
  };

  const toggleSelectAll = async () => {
    try {
      await fetch("/api/todos/toggle-completed", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAllSelected: !allSelected,
        }),
      });
      const tempTodos = [...todos];
      tempTodos.forEach((todo) => {
        todo.isCompleted = !allSelected;
      });
      setAllSelected(!allSelected);
      setTodos(tempTodos);
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const closeErrorMessage = (): void => {
    setErrorMessage(undefined);
  };

  const changeUser: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const userId = Number(e.currentTarget.value);
    setCurrentUser(users.find((user) => user.id === userId));
  };

  const todoFilteredLength = todos.filter((todo) => !todo.isCompleted).length;

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className={styles.todo_list_outer}>
      <h1 className={styles.title}>todos</h1>
      <ErrorMessage {...{ error: errorMessage, closeErrorMessage }} />
      <div className={styles.select_user_container}>
        <label>Select User's Todo List:</label>
        <select data-test-id="change_user_select" onChange={changeUser}>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.todo_list_main}>
        <header className={styles.header}>
          <p
            data-test-id="new_todo_selectAll"
            onClick={toggleSelectAll}
            className={classnames({
              [styles.new_todo_selectAll]: true,
              [styles.new_todo_selectAll_active]: todos.every(
                (todo) => todo.isCompleted
              ),
            })}
          >
            &#10095;
          </p>
          <input
            type="text"
            data-test-id="new_todo_input"
            placeholder="What needs to be done?"
            className={styles.new_todo_input}
            onKeyDown={addTodo}
          />
        </header>
        <ul className={styles.todo_list}>
          {todos.filter(activeFilterFilter).map((todo, idx) => (
            <TodoItem
              {...{
                key: todo.id,
                todoItem: todo,
                todoIdx: idx,
                toggleIsCompleted,
                deleteTodo,
                updateTodoLabel,
                submitTodoLabel,
              }}
            />
          ))}
        </ul>
        <footer className={styles.footer}>
          <span className={styles.left_cont}>
            {todoFilteredLength} item
            {todoFilteredLength !== 1 ? "s" : "\u00A0"} left
          </span>
          <TodoFilters activeFilter={activeFilter} />
          <span
            className={classnames({
              [styles.right_cont]: true,
              [styles.right_cont_hidden]: !todos.filter(
                (todo) => todo.isCompleted
              ).length,
            })}
            onClick={clearCompletedTodos}
          >
            <button data-test-id="clear_completed" type="button">
              Clear Completed
            </button>
          </span>
        </footer>
      </div>
      <div className={styles.stack_container}>
        <div className={styles.stack_1}></div>
        <div className={styles.stack_2}></div>
      </div>
    </div>
  );
};

export default TodoList;
