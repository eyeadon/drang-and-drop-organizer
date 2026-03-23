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

  let startingColumns: ColumnType = {
    A: [],
    B: [],
    C: [],
    D: [],
  };

  Object.keys(startingColumns).forEach((key) => {
    tasks.forEach((task) => {
      if (task.group === key) {
        startingColumns[key].push(task);
      }
    });
  });

  return (
    <>
      <div className="font-sans grid grid-rows-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <AddTaskForm authorId={1} />
          </div>
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <ColumnGroup tasks={tasks} startingColumns={startingColumns} />
          </div>
        </main>
      </div>
    </>
  );
}
