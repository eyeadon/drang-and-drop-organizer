import prisma from "@/lib/prisma";
import "./App.css";
import BoardView from "./components/BoardView";
import AddTaskForm from "./components/AddTaskForm";
import { Board, Task } from "./generated/prisma/client";

export default async function Home() {
  const users = await prisma.user.findMany();

  const board = {
    id: 1,
    content: {},
    authorId: 1,
  };

  return (
    <>
      <div className="font-sans grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <AddTaskForm authorId={1} />
          </div>
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <BoardView id={1} content={null} authorId={1} />
          </div>
        </main>
      </div>
    </>
  );
}
