import prisma from "@/lib/prisma";
import "./App.css";
import BoardView from "./components/BoardView";

export default async function Home() {
  // const users = await prisma.user.findMany();
  const boards = await prisma.board.findMany();

  return (
    <>
      <div className="font-sans grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
          <div className="flex flex-col gap-4 items-center  sm:flex-col">
            <BoardView authorId={1} board={boards[0]} />
          </div>
        </main>
      </div>
    </>
  );
}
