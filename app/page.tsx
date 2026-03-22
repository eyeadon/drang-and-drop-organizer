import prisma from "@/lib/prisma";
import "./App.css";
import ColumnGroup from "./components/ColumnGroup";
import AddTaskForm from "./components/AddTaskForm";
import { Task } from "./generated/prisma/client";

export interface ColumnType {
  [key: string]: Task[];
}

export default async function Home() {
  const users = await prisma.user.findMany();
  const tasks = await prisma.task.findMany();

  let columnGroups: ColumnType = {
    A: [],
    B: [],
    C: [],
    D: [],
  };

  Object.keys(columnGroups).forEach((key) => {
    tasks.forEach((task) => {
      if (task.group === key) {
        columnGroups[key].push(task);
      }
    });
  });

  return (
    <>
      <div className="font-sans grid grid-rows-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
          {/* <div className="flex flex-col gap-4 items-center sm:flex-col">
            <ol className="list-decimal list-inside font-sans">
              {users.map((user) => (
                <li key={user.id} className="mb-2">
                  {user.name}
                </li>
              ))}
            </ol>
          </div> */}
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <AddTaskForm authorId={1} />
          </div>
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <ColumnGroup tasks={tasks} columnGroups={columnGroups} />
          </div>
        </main>
      </div>
    </>
  );
}
