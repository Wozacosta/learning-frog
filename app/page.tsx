import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";
import Image from "next/image";

import styles from "./page.module.css";

let vercelUrl = "https://learning-frog-nine.vercel.app/"
const isDevelopment = process.env.VERCEL_ENV === "development";
console.log({vercelenv : process.env.VERCEL_ENV})

if (isDevelopment) {
  vercelUrl = "http://localhost:3000";
  console.log("Running in development environment");
} else {
  console.log("Running in production environment");
}


export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${vercelUrl}/api`
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
