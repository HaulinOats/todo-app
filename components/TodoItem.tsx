import { ChangeEvent, FC, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { TodoItem as TodoItemType } from "../types/TodoItem.type";
import styles from '../styles/TodoItem.module.css';

interface Props {
  todoItem: TodoItemType
  toggleIsCompleted: (todoId: number) => void
  deleteTodo: (todoId: number) => void
  updateTodoLabel: (e: React.ChangeEvent<HTMLInputElement>, todoId: number) => void
}

const TodoItem: FC<Props> = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const todoLabelKeyDown:KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }

  return (
    <li className={isEditing ? styles.single_todo_editing : styles.single_todo}>
      <div className={styles.completed_toggle}>
        <input
          id={`completed_toggle_${props.todoItem.id}`}
          type="checkbox"
          onChange={e => props.toggleIsCompleted(props.todoItem.id)}
          checked={props.todoItem.isCompleted} />
        <label htmlFor={`completed_toggle_${props.todoItem.id}`} data-test-id="completed_toggle"></label>
      </div>
      {!isEditing ?
        <div className={styles.todo_right_container}>
          <label
            onDoubleClick={() => setIsEditing(!isEditing)}
            data-test-id="todo_main_label"
            className={styles.todo_main_label + " " + (props.todoItem.isCompleted ? styles.todo_main_label_completed : '')}>{props.todoItem.label}</label>
          <button
            data-test-id="delete_todo"
            className={styles.delete_todo}
            onClick={e => props.deleteTodo(props.todoItem.id)}></button>
        </div>
        : <input
          autoFocus
          type="text"
          data-test-id="todo_main_label_input"
          className={styles.todo_main_label_input}
          value={props.todoItem.label}
          onBlur={() => setIsEditing(!isEditing)}
          onKeyDown={todoLabelKeyDown}
          onChange={e => props.updateTodoLabel(e, props.todoItem.id)} />}
    </li>
  )
}

export default TodoItem;
