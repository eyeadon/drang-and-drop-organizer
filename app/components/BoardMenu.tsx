"use client";
import { ReactNode, useState } from "react";
import { Board } from "../generated/prisma/client";
import BoardView from "./BoardView";

interface Props {
  boards: Board[];
  authorId: number;
  // onSelectBoard: (board: Board) => void;
}

const BoardMenu = ({ boards, authorId }: Props) => {
  const [selectedBoard, setSelectedBoard] = useState<Board | undefined>();

  return (
    <>
      {/* TODO: fix or remove div flex classes */}
      <div className="flex flex-col gap-4 items-center">
        {boards.map((board) => (
          <span
            key={board.id}
            className="inline-block bg-blue-200 rounded-full border-2 border-indigo-500 px-3 py-1 text-md font-semibold text-blue-950 mr-2 mb-2"
          >
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedBoard(board);
              }}
            >
              {board.name}
            </a>
          </span>
        ))}
      </div>

      {selectedBoard ? (
        <BoardView authorId={authorId} board={selectedBoard} />
      ) : (
        <BoardView authorId={authorId} board={null} />
      )}
    </>
  );
};

export default BoardMenu;
