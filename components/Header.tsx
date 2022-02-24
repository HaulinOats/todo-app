import Link from "next/link";
import styles from "../styles/Header.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      <header className={styles.header}>
        <h1>
          <Link href="/">
            <a>Todo List App</a>
          </Link>
        </h1>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {/* Show sign in button if no session exists */}
          {!session && (
            <>
              <li>
                <button
                  data-test-id="sign_in"
                  className={styles.sign_in}
                  onClick={() => signIn()}
                >
                  Sign In
                </button>
              </li>
            </>
          )}
          {/* Only allow todo list to be viewed when user is logged in */}
          {session && (
            <>
              <li>
                <Link href="/todo-list">
                  <a>Todo List</a>
                </Link>
              </li>
              <li>
                <span>{session.user.name}</span>
                <button
                  data-test-id="sign_out"
                  className={styles.sign_out}
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </header>
    </>
  );
};

export default Header;
