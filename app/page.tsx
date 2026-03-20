import prisma from "@/lib/prisma";
import "./App.css";
import ColumnGroup from "./components/ColumnGroup";

interface ColumnType {
  [key: string]: string[];
}

export default async function Home() {
  const users = await prisma.user.findMany();
  const tasks = await prisma.task.findMany();

  return (
    <>
      <ol className="list-decimal list-inside font-sans">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
      <div className="font-sans grid grid-rows-[1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <ColumnGroup tasks={tasks} />
          </div>
        </main>
      </div>
    </>
  );
}
