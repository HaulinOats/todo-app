import Head from "next/head";
import Header from "../components/Header";
import styles from "../styles/MainLayout.module.css";

interface LayoutProps {
  pageTitle: string;
}

const MainLayout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default MainLayout;
