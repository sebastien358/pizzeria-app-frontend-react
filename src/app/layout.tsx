import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import styles from "./layout.module.scss"
import "./globals.scss"
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="fr">
        <body className={styles.layout}>
          <Header className={styles.layout__header} />
            <main className={styles.layout__main}>
                {children}
            </main>
          <Footer className={styles.layout__footer} />
        </body>
      </html>
  );
}