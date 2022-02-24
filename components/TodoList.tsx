import { FC, useState, useEffect, KeyboardEventHandler } from "react";
import styles from "../styles/TodoList.module.css";
import TodoItem from "./TodoItem";
import ErrorMessage from "./ErrorMessage";
import type { TodoItem as TodoItemType } from "../types/TodoItem.type";
import classnames from "classnames";
import Link from "next/link";
import { useSession } from "next-auth/react";

export type Filter = "all" | "active" | "completed";

interface Props {
  activeFilter: string;
}

const TodoList: FC<Props> = ({ activeFilter }) => {
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    //get todos if session exists
    if (session) {
      fetch(`/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      })
        .then((res) => res.json())
        .then((allTodos) => {
          setTodos(allTodos);
          //check if all todos are completed and update allSelected
          setAllSelected(
            allTodos.every((todo: TodoItemType) => todo.isCompleted)
          );
        })
        .catch((err) => setErrorMessage(err.toString()));
    }
  }, []);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;

    if (e.key !== "Enter" || !target.value.trim().length || !session) {
      return;
    }

    fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: target.value,
        userId: session.user.id,
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
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== todoId));
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const toggleIsCompleted = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ): void => {
    const isCompleted = e.currentTarget.checked;
    fetch(`/api/todo/toggle-completed/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isCompleted: isCompleted,
      }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        const todoIdx = todos.findIndex((todo) => todo.id === todoId);
        const tempTodos = [...todos];
        tempTodos[todoIdx].isCompleted = isCompleted;
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
        setTodos(todos.filter((todo) => !todo.isCompleted));
      })
      .catch((err) => setErrorMessage(err.toString()));
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
      .then((updatedTodo) => {
        const todoIdx = todos.findIndex((todo) => todo.id === todoId);
        const tempTodos = [...todos];
        tempTodos[todoIdx].label = label;
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
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
        const tempTodos = [...todos];
        tempTodos.forEach((todo) => {
          todo.isCompleted = !allSelected;
        });
        setAllSelected(!allSelected);
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const closeErrorMessage = (): void => {
    setErrorMessage(undefined);
  };

  const todoFilteredLength = todos.filter((todo) => !todo.isCompleted).length;

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
          <ul className={styles.filters}>
            <li
              data-test-id="filter_link_all"
              className={classnames({
                [styles.active_filter_view]: activeFilter === "all",
              })}
            >
              <Link href={{ query: { filter: "all" } }} scroll={false}>
                <a>All</a>
              </Link>
            </li>
            <li
              data-test-id="filter_link_active"
              className={classnames({
                [styles.active_filter_view]: activeFilter === "active",
              })}
            >
              <Link href={{ query: { filter: "active" } }} scroll={false}>
                <a>Active</a>
              </Link>
            </li>
            <li
              data-test-id="filter_link_completed"
              className={classnames({
                [styles.active_filter_view]: activeFilter === "completed",
              })}
            >
              <Link href={{ query: { filter: "completed" } }} scroll={false}>
                <a>Completed</a>
              </Link>
            </li>
          </ul>
          <span
            className={`${styles.right_cont} ${
              !todos.filter((todo) => todo.isCompleted).length
                ? styles.right_cont_hidden
                : ""
            }`}
            onClick={() => clearCompletedTodos()}
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
