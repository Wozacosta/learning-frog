import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";
import Image from "next/image";

import styles from "./page.module.css";

const vercelUrl = "https://learning-frog-nine.vercel.app/"

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${vercelUrl || "http://localhost:3000"}/api`
  );
  return {
    other: frameTags,
  };
}

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem dolor
        aperiam, voluptas magni aspernatur praesentium accusantium, nihil nam
        amet, eveniet ullam. Quaerat voluptatibus sequi deserunt, recusandae a
        reprehenderit itaque nihil?
      </div>
    </main>
  );
}
