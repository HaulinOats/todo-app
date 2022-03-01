import classnames from "classnames";
import Link from "next/link";
import styles from "../styles/TodoFilters.module.css";

interface Props {
  activeFilter: "all" | "active" | "completed";
}

const TodoFilters: React.FC<Props> = ({ activeFilter }) => {
  return (
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
  );
};

export default TodoFilters;
