import prisma from "@/lib/prisma";
import "./App.css";
import BoardView from "./components/BoardView";
import { Board, User } from "./generated/prisma/client";
import BoardMenu from "./components/BoardMenu";

export default async function Home() {
  // const users = await prisma.user.findMany();
  const userId = 2;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { boards: true },
  });

  const startingBoards = user!.boards;
  console.log(startingBoards);

  return (
    <>
      <div className="font-sans grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-4 row-start-1 items-center sm:items-start">
          <BoardMenu boards={startingBoards} authorId={userId} />
        </main>
      </div>
    </>
  );
}
