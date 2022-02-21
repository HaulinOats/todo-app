import { FC, useState, useEffect, KeyboardEventHandler } from "react";
import styles from "../styles/TodoList.module.css";
import TodoItem from "./TodoItem";
import ErrorMessage from "./ErrorMessage";
import type { TodoItem as TodoItemType } from "../types/TodoItem.type";
import classnames from "classnames";
import Link from "next/link";

export type Filter = "all" | "active" | "completed";

interface Props {
  activeFilter: string;
}

const Todo: FC<Props> = ({ activeFilter }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  //get state from localStorage on mount
  useEffect(() => {
    fetch("/api/todos", { method: "GET" })
      .then((res) => res.json())
      .then((allTodos) => {
        setTodos(allTodos);
        setAllSelected(
          allTodos.every((todo: TodoItemType) => todo.is_completed)
        );
      })
      .catch((err) => setErrorMessage(err.toString()));
  }, []);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;

    if (e.key !== "Enter" || !target.value.trim().length) {
      return;
    }

    fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: target.value,
      }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        target.value = "";
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const deleteTodo = (todoId: number): void => {
    fetch(`/api/todo/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((todoId) => {
        setTodos(todos.filter((todo) => todo.id !== todoId));
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const toggleIsCompleted = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ): void => {
    const is_completed = e.currentTarget.checked;
    fetch(`/api/todo/toggle-completed/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_completed: is_completed,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        let tempTodos = [...todos];
        tempTodos.some((todo) => {
          if (todo.id === todoId) {
            todo.is_completed = is_completed;
            return;
          }
        });
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const clearCompletedTodos = () => {
    fetch(`/api/todos/clear-completed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setTodos(todos.filter((todo) => !todo.is_completed));
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const updateTodoLabel = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ): void => {
    let tempTodos = [...todos];
    tempTodos.some((todo) => {
      if (todo.id === todoId) {
        todo.label = e.currentTarget.value;
        return;
      }
    });
    setTodos(tempTodos);
  };

  const submitTodoLabel = (todoId: number, label: string): void => {
    fetch(`/api/todo/update-label/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: label,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        let tempTodos = [...todos];
        tempTodos.some((todo) => {
          if (todo.id === todoId) {
            todo.label = label;
            return;
          }
        });
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const activeFilterFilter = (todo: TodoItemType) => {
    switch (activeFilter) {
      case "all":
        return todo;
      case "active":
        if (!todo.is_completed) return todo;
        break;
      case "completed":
        if (todo.is_completed) return todo;
        break;
    }
  };

  const toggleSelectAll = () => {
    fetch("/api/todos/toggle-completed", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isAllSelected: !allSelected,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        let tempTodos = [...todos];
        tempTodos.forEach((todo) => {
          todo.is_completed = !allSelected;
        });
        setAllSelected(!allSelected);
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const closeErrorMessage = (): void => {
    setErrorMessage(undefined);
  };

  const todoFilteredLength = todos.filter((todo) => !todo.is_completed).length;

  return (
    <div className={styles.todo_list_outer}>
      <h1 className={styles.title}>todos</h1>
      <ErrorMessage {...{ error: errorMessage, closeErrorMessage }} />
      <div className={styles.todo_list_main}>
        <header className={styles.header}>
          <p
            data-test-id="new_todo_selectAll"
            onClick={toggleSelectAll}
            className={classnames({
              [styles.new_todo_selectAll]: true,
              [styles.new_todo_selectAll_active]: todos.every(
                (todo) => todo.is_completed
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
          {todos.filter(activeFilterFilter).map((todo) => (
            <TodoItem
              {...{
                key: todo.id,
                todoItem: todo,
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
          <ul className={styles.filters}>
            <li
              className={classnames({
                [styles.active_filter_view]: activeFilter === "all",
              })}
            >
              <Link href={{ query: { filter: "all" } }}>
                <a>All</a>
              </Link>
            </li>
            <li
              className={classnames({
                [styles.active_filter_view]: activeFilter === "active",
              })}
            >
              <Link href={{ query: { filter: "active" } }}>
                <a>Active</a>
              </Link>
            </li>
            <li
              className={classnames({
                [styles.active_filter_view]: activeFilter === "completed",
              })}
            >
              <Link href={{ query: { filter: "completed" } }}>
                <a>Completed</a>
              </Link>
            </li>
          </ul>
          <span
            className={`${styles.right_cont} ${
              !todos.filter((todo) => todo.is_completed).length
                ? styles.right_cont_hidden
                : ""
            }`}
            onClick={() => clearCompletedTodos()}
          >
            <a>Clear Completed</a>
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

export default Todo;
