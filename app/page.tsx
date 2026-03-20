import prisma from "@/lib/prisma";
import "./App.css";
import ColumnGroup from "./components/ColumnGroup";
import AddTaskForm from "./components/AddTaskForm";

export default async function Home() {
  const users = await prisma.user.findMany();
  const tasks = await prisma.task.findMany();

  return (
    <>
      <div className="font-sans grid grid-rows-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
          <div className="flex flex-col gap-4 items-center sm:flex-col">
            <ol className="list-decimal list-inside font-sans">
              {users.map((user) => (
                <li key={user.id} className="mb-2">
                  {user.name}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <AddTaskForm authorId={1} />
          </div>
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <ColumnGroup tasks={tasks} />
          </div>
        </main>
      </div>
    </>
  );
}
