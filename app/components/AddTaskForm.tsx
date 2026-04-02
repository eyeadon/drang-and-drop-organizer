"use client";
import axios from "axios";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { saveBoard } from "../functions";
import { Board, Task } from "../generated/prisma/client";
import { ColumnType } from "./BoardView";

interface Props {
  authorId: number;
  board: Board | null;
  columns: ColumnType;
  handleUpdateColumn: (newTask: Task, columnKey: string) => void;
}

export default function AddTaskForm({
  authorId,
  board,
  columns,
  handleUpdateColumn,
}: Props) {
  const router = useRouter();

  async function createTask(formData: FormData) {
    const content = formData.get("content") as string;
    const group = formData.get("group") as string;

    async function createTask(data: { content: string; authorId: number }) {
      try {
        return await axios.post<Task>("/api/tasks", data);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }

    async function addNewTaskToBoard() {
      const response = await createTask({
        content,
        authorId,
      });

      if (response) {
        for (const [key] of Object.entries(columns)) {
          if (key === group) {
            handleUpdateColumn(response.data, key);
          }
        }
      }
    }

    async function updateBoard() {
      await addNewTaskToBoard();

      saveBoard(
        board ? board.id : null,
        {
          name: "board1",
          content: columns,
          authorId,
        },
        router,
      );
    }

    updateBoard();
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <Form action={createTask} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-black text-lg mb-2">
              Task
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Task..."
              rows={1}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            />
          </div>
          <div>
            <label htmlFor="group" className="block text-black text-lg mb-2">
              Starting Group
            </label>
            <textarea
              id="group"
              name="group"
              placeholder="Group..."
              rows={1}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Add Task
          </button>
        </Form>
      </div>
    </>
  );
}
