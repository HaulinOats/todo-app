import { FC, useState, useEffect, KeyboardEventHandler } from "react";
import styles from "../styles/TodoList.module.css";
import TodoItem from "./TodoItem";
import ErrorMessage from "./ErrorMessage";
import type { TodoItem as TodoItemType } from "../types/TodoItem.type";
import classnames from "classnames";

interface Props {}

const Todo: FC<Props> = ({}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [todoView, setTodoView] = useState("all");

  //get state from localStorage on mount
  useEffect(() => {
    setTodoView((localStorage.getItem("todoView") as string) || "all");
    setAllSelected(
      JSON.parse(localStorage.getItem("allSelected") as string) || false
    );
    fetch("/api/todos", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => setErrorMessage(err.toString()));
  }, []);

  useEffect(() => {
    localStorage.setItem("todoView", todoView);
  }, [todoView]);

  useEffect(() => {
    localStorage.setItem("allSelected", JSON.stringify(allSelected));
  }, [allSelected]);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;

    if (e.key !== "Enter" || !target.value.trim().length) {
      return;
    }

    fetch("/api/todos", {
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
      })
      .catch((err) => setErrorMessage(err.toString()));

    target.value = "";
  };

  const deleteTodo = (todoId: number): void => {
    fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todoId,
      }),
    })
      .then((res) => res.json())
      .then((deletedTodo) => {
        setTodos(todos.filter((todo) => todo.id !== deletedTodo.id));
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const toggleIsCompleted = (todoId: number): void => {
    fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateType: "toggleIsCompleted",
        id: todoId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //if response is empty object, inform user todo wasn't found
        if (data.queryError) {
          setErrorMessage(data.queryError);
          return;
        }

        //replace todo with updated todo from server
        const todo = console.log(data);
        console.log("todos (before):", JSON.parse(JSON.stringify(todos)));
        let tempTodos = [...todos];
        tempTodos.forEach((todo) => {
          if (todo.id === data.id) {
            //doesn't work
            // todo = data;
            todo.is_completed = data.is_completed;
          }
        });
        console.log("todos (after):", JSON.parse(JSON.stringify(tempTodos)));
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.is_completed));
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
    fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateType: "updateLabel",
        id: todoId,
        label,
      }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        let tempTodos = [...todos];
        tempTodos.some((todo) => {
          if (todo.id === updatedTodo.id) {
            todo = updatedTodo;
            return;
          }
        });
        setTodos(tempTodos);
      })
      .catch((err) => setErrorMessage(err.toString()));
  };

  const todoViewFilter = (todo: TodoItemType) => {
    switch (todoView) {
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
    let tempTodos = [...todos];
    tempTodos.forEach((todo) => {
      todo.is_completed = !allSelected;
    });
    setAllSelected(!allSelected);
    setTodos(tempTodos);
  };

  const closeErrorMessage = (): void => {
    setErrorMessage(undefined);
  };

  return (
    <div className={styles.todo_list_outer}>
      <h1 className={styles.title}>todos</h1>
      <ErrorMessage {...{ error: errorMessage, closeErrorMessage }} />
      <div className={styles.todo_list_main}>
        <header className={styles.header}>
          <p
            data-test-id="new_todo_selectAll"
            onClick={toggleSelectAll}
            className={`${styles.new_todo_selectAll} ${
              todos.every((todo) => todo.is_completed)
                ? styles.new_todo_selectAll_active
                : ""
            }`}
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
          {todos.filter(todoViewFilter).map((todo) => (
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
            {todos.filter((todo) => !todo.is_completed).length} item
            {todos.filter((todo) => !todo.is_completed).length !== 1
              ? "s"
              : "\u00A0"}{" "}
            left
          </span>
          <ul className={styles.filters}>
            <li
              className={classnames({
                [styles.active_filter_view]: todoView === "all",
              })}
            >
              <button type="button" onClick={() => setTodoView("all")}>
                All
              </button>
            </li>
            <li
              className={classnames({
                [styles.active_filter_view]: todoView === "active",
              })}
            >
              <button type="button" onClick={() => setTodoView("active")}>
                Active
              </button>
            </li>
            <li
              className={classnames({
                [styles.active_filter_view]: todoView === "completed",
              })}
            >
              <button type="button" onClick={() => setTodoView("completed")}>
                Completed
              </button>
            </li>
          </ul>
          <span
            className={`${styles.right_cont} ${
              !todos.filter((todo) => todo.is_completed).length
                ? styles.right_cont_hidden
                : ""
            }`}
            onClick={(e) => clearCompletedTodos()}
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
