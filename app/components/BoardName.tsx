"use client";
import Form from "next/form";
import { useState } from "react";
import { saveBoard } from "../functions";
import { useRouter } from "next/navigation";
import { Board } from "../generated/prisma/client";
import { ColumnType } from "./BoardView";

interface Props {
  authorId: number;
  board: Board | null;
  columns: ColumnType;
  handleUpdateBoard: (board: Board | undefined) => void;
}

const BoardName = ({ authorId, board, columns, handleUpdateBoard }: Props) => {
  const router = useRouter();
  const [formDisplay, setFormDisplay] = useState(false);

  async function editBoardName(formData: FormData) {
    const newName = formData.get("boardName") as string;

    const response = await saveBoard(
      board ? board.id : null,
      {
        name: newName,
        content: columns,
        authorId,
      },
      router,
    );

    if (response) handleUpdateBoard(response.data as Board);
  }

  return (
    <>
      <div className="flex flex-row  gap-4 items-start">
        <button
          className="cursor-pointer bg-gray-200 border border-gray-200 rounded-lg px-3 py-2 text-lg font-semibold mr-2 mb-2 hover:border-blue-600 hover:border"
          onClick={() => setFormDisplay(!formDisplay)}
        >
          {board ? board.name : "Untitled Board"}
        </button>
        {formDisplay && (
          <Form action={editBoardName} className="">
            <input
              id="boardName"
              name="boardName"
              placeholder={board ? board.name : "Untitled Board"}
              className="border bg-white text-lg rounded-lg px-3 py-2 mr-2 mb-2"
            />
            <button
              type="submit"
              className="cursor-pointer border border-blue-600 bg-blue-500 text-white text-lg rounded-lg px-3 py-2 mr-2 mb-2 hover:bg-blue-600 hover:border-blue-600"
            >
              Save
            </button>
          </Form>
        )}
      </div>
    </>
  );
};

export default BoardName;
