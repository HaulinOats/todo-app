import { ChangeEventHandler, FC, useState } from "react";
import { TodoItem as TodoItemType } from "../types/TodoItem.type";
import styles from "../styles/TodoItem.module.css";
import classnames from "classnames";

interface Props {
  todoItem: TodoItemType;
  toggleIsCompleted: (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => void;
  deleteTodo: (todoId: number) => void;
  updateTodoLabel: (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => void;
  submitTodoLabel: (todoId: number, label: string) => void;
}

const TodoItem: FC<Props> = ({
  todoItem,
  toggleIsCompleted,
  deleteTodo,
  updateTodoLabel,
  submitTodoLabel,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const todoLabelKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoId: number
  ) => {
    if (e.key !== "Enter") {
      return;
    }
    e.currentTarget.blur();
    submitTodoLabel(todoId, e.currentTarget.value);
  };

  return (
    <li
      data-test-id="todo_item"
      className={classnames({
        [styles.single_todo]: true,
        [styles.single_todo_editing]: isEditing,
      })}
    >
      <div className={styles.completed_toggle}>
        <input
          data-test-id="todo_item_toggle"
          id={`completed_toggle_${todoItem.id}`}
          type="checkbox"
          onChange={(e) => toggleIsCompleted(e, todoItem.id)}
          checked={todoItem.isCompleted}
        />
        <label
          htmlFor={`completed_toggle_${todoItem.id}`}
          data-test-id="completed_toggle"
        ></label>
      </div>
      {!isEditing ? (
        <div className={styles.todo_right_container}>
          <label
            onDoubleClick={() => setIsEditing(!isEditing)}
            data-test-id="todo_main_label"
            className={classnames({
              [styles.todo_main_label]: true,
              [styles.todo_main_label_completed]: todoItem.isCompleted,
            })}
          >
            {todoItem.label}
          </label>
          <button
            data-test-id="delete_todo"
            className={styles.delete_todo}
            onClick={() => deleteTodo(todoItem.id)}
          ></button>
        </div>
      ) : (
        <input
          autoFocus
          type="text"
          data-test-id="todo_main_label_input"
          className={styles.todo_main_label_input}
          value={todoItem.label}
          onBlur={() => setIsEditing(!isEditing)}
          onKeyDown={(e) => todoLabelKeyDown(e, todoItem.id)}
          onChange={(e) => updateTodoLabel(e, todoItem.id)}
        />
      )}
    </li>
  );
};

export default TodoItem;
