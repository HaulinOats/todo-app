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

const TodoItem: FC<Props> = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const todoLabelKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoId: number
  ) => {
    if (e.key !== "Enter") {
      return;
    }
    e.currentTarget.blur();
    props.submitTodoLabel(todoId, e.currentTarget.value);
  };

  return (
    <li
      className={classnames({
        [styles.single_todo]: true,
        [styles.single_todo_editing]: isEditing,
      })}
    >
      <div className={styles.completed_toggle}>
        <input
          id={`completed_toggle_${props.todoItem.id}`}
          type="checkbox"
          onChange={(e) => props.toggleIsCompleted(e, props.todoItem.id)}
          checked={props.todoItem.is_completed}
        />
        <label
          htmlFor={`completed_toggle_${props.todoItem.id}`}
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
              [styles.todo_main_label_completed]: props.todoItem.is_completed,
            })}
          >
            {props.todoItem.label}
          </label>
          <button
            data-test-id="delete_todo"
            className={styles.delete_todo}
            onClick={(e) => props.deleteTodo(props.todoItem.id)}
          ></button>
        </div>
      ) : (
        <input
          autoFocus
          type="text"
          data-test-id="todo_main_label_input"
          className={styles.todo_main_label_input}
          value={props.todoItem.label}
          onBlur={() => setIsEditing(!isEditing)}
          onKeyDown={(e) => todoLabelKeyDown(e, props.todoItem.id)}
          onChange={(e) => props.updateTodoLabel(e, props.todoItem.id)}
        />
      )}
    </li>
  );
};

export default TodoItem;
