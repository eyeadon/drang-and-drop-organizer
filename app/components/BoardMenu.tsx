"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Board } from "../generated/prisma/client";
import BoardView from "./BoardView";

interface Props {
  boards: Board[];
  authorId: number;
}

const BoardMenu = ({ boards, authorId }: Props) => {
  const router = useRouter();
  const [selectedBoard, setSelectedBoard] = useState<Board | undefined>();
  const [isEditingBoardName, setEditingBoardName] = useState(false);

  const handleUpdateBoard = (board: Board | undefined) => {
    setSelectedBoard(board);
    router.refresh();
  };

  const handleEditingBoardName = (flag: boolean) => {
    setEditingBoardName(flag);
  };

  // console.log("BoardMenu selectedBoard ", selectedBoard);

  return (
    <>
      <div className="">
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
                setEditingBoardName(false);
                router.refresh();
              }}
            >
              {board.name}
            </a>
          </span>
        ))}
      </div>

      {selectedBoard ? (
        <BoardView
          authorId={authorId}
          board={selectedBoard}
          handleUpdateBoard={handleUpdateBoard}
          isEditingBoardName={isEditingBoardName}
          handleEditingBoardName={handleEditingBoardName}
        />
      ) : (
        <BoardView
          authorId={authorId}
          board={null}
          handleUpdateBoard={handleUpdateBoard}
          isEditingBoardName={isEditingBoardName}
          handleEditingBoardName={handleEditingBoardName}
        />
      )}
    </>
  );
};

export default BoardMenu;
