import { ChangeEvent, FC, useEffect, useRef } from "react";
import { TodoItem as TodoItemType } from "../types/TodoItem.type";
import styles from '../styles/TodoItem.module.css';

interface Props {
  todoItem:TodoItemType
  todoId:number
  toggleTodoCompleted:(todoId:number) => void
  toggleEditable:(todoId:number) => void
  deleteTodo:(todoId:number) => void
  updateTodoLabel:(e:ChangeEvent, todoId:number) => void
}

const TodoItem:FC<Props> = (props) => {
  const todoLabelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //auto-select label input when editing a field
    todoLabelInputRef.current?.focus();
  }, [props.toggleEditable]);

  const todoLabelKeyDown = (e:React.KeyboardEvent):void => {
    if(e.key === 'Enter'){
      (e.target as HTMLInputElement).blur();
    }
  }

  return(
    <li className={props.todoItem.isEditing ? styles.single_todo_editing : styles.single_todo}>
      <div className={styles.completed_toggle}>
        <input id={`completed_toggle_${props.todoId}`} type="checkbox" onChange={e => props.toggleTodoCompleted(props.todoId)} checked={props.todoItem.isCompleted} />
        <label htmlFor={`completed_toggle_${props.todoId}`}></label>
      </div>
      {!props.todoItem.isEditing ?
        <div className={styles.todo_right_container}>
          <label
            onDoubleClick={e => props.toggleEditable(props.todoId)}
            className={styles.todo_main_label + " " + (props.todoItem.isCompleted ? styles.todo_main_label_completed : '')}>{props.todoItem.label}</label>
          <button className={styles.delete_todo} onClick={e => props.deleteTodo(props.todoId)}></button>
        </div>
        : <input
          type="text"
          ref={todoLabelInputRef}
          className={styles.todo_main_label_input}
          value={props.todoItem.label}
          onBlur={() => props.toggleEditable(props.todoId)}
          onKeyDown={e => todoLabelKeyDown(e)}
          onChange={e => props.updateTodoLabel(e, props.todoId)} />}
    </li>
  )
}

export default TodoItem;