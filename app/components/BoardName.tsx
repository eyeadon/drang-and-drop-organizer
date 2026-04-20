"use client";
import { useState } from "react";
import { saveBoard } from "../functions";
import { useRouter } from "next/navigation";
import { Board } from "../generated/prisma/client";
import { ColumnType } from "./BoardView";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boardSchema } from "../api/validationSchemas";

interface Props {
  authorId: number;
  board: Board | null;
  columns: ColumnType;
  handleUpdateBoard: (board: Board | undefined) => void;
}

type TaskFormData = z.infer<typeof boardSchema>;

const BoardName = ({ authorId, board, columns, handleUpdateBoard }: Props) => {
  const router = useRouter();
  const [formDisplay, setFormDisplay] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(boardSchema),
  });

  async function editBoardName(data: { name: string }) {
    setSubmitting(true);

    const response = await saveBoard(board ? board.id : null, {
      name: data.name,
      content: columns,
      authorId,
    });

    if (response) handleUpdateBoard(response.data as Board);

    router.refresh();
    setFormDisplay(false);
    setSubmitting(false);
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
          <form onSubmit={handleSubmit(editBoardName)} className="">
            {error && <p className="text-red-800">{error}</p>}
            <input
              id="name"
              placeholder={board ? board.name : "Untitled Board"}
              className="border bg-white text-lg rounded-lg px-3 py-2 mr-2 mb-2"
              {...register("name")}
            />
            <button
              type="submit"
              className="cursor-pointer border border-blue-600 bg-blue-500 text-white text-lg rounded-lg px-3 py-2 mr-2 mb-2 hover:bg-blue-600 hover:border-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:pointer-events-none"
              disabled={isSubmitting}
            >
              Save
            </button>
            {errors && <p className="text-red-800">{errors.name?.message}</p>}
          </form>
        )}
      </div>
    </>
  );
};

export default BoardName;
