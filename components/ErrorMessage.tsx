import styles from "../styles/ErrorMessage.module.css";

interface Props {
  error: string | undefined;
  closeErrorMessage: () => void;
}

const ErrorMessage: React.FC<Props> = (props) => {
  return (
    <>
      {props.error && (
        <div className={styles.error_message_outer}>
          <p className={styles.error_message_text}>
            <b>Error:</b> {props.error}
          </p>
          <p className={styles.close_message} onClick={props.closeErrorMessage}>
            &times;
          </p>
        </div>
      )}
    </>
  );
};

export default ErrorMessage;
