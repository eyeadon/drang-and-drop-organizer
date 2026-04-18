"use client";
import { useSortable } from "@dnd-kit/react/sortable";
import axios from "axios";
import Form from "next/form";
import { ReactNode, useState } from "react";
import { Task } from "../generated/prisma/client";
import ItemDropdownMenu from "./ItemDropdownMenu";

interface Props {
  id: number;
  authorId: number;
  index: number;
  column: string;
  children: ReactNode;
  handleUpdateColumn: (newTask: Task, columnKey: string) => Promise<void>;
  handleDeleteColumn: (id: number, columnKey: string) => Promise<void>;
}

export default function Item({
  id,
  authorId,
  index,
  column,
  children,
  handleUpdateColumn,
  handleDeleteColumn,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { ref, isDragging, isDropping, isDragSource } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

  const handleEditTask = () => setIsEditing(!isEditing);

  async function editTask(formData: FormData) {
    const content = formData.get("content") as string;

    async function patchTask(data: { content: string; authorId: number }) {
      try {
        return await axios.patch<Task>("/api/tasks/" + id, data);
      } catch (error) {
        console.error("Error patching data:", error);
      }
    }

    async function replaceTaskInBoard() {
      const response = await patchTask({
        content,
        authorId,
      });

      // update column
      if (response?.data) {
        handleUpdateColumn(response.data, column);
      }
    }

    await replaceTaskInBoard();
    setIsEditing(false);
  }

  async function removeTask(id: number) {
    async function deleteTask(id: number) {
      try {
        return await axios.delete<Task>("/api/tasks/" + id);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }

    async function removeTaskFromBoard() {
      const response = await deleteTask(id);

      // delete column
      if (response?.status === 200) {
        handleDeleteColumn(id, column);
      }
    }

    removeTaskFromBoard();
  }

  return (
    <div
      className={isDragSource ? "Item active" : "Item"}
      ref={ref}
      data-dragging={isDragging}
      data-dropping={isDropping}
      data-index={index}
      data-column={column}
    >
      {!isEditing ? (
        children
      ) : (
        <Form action={editTask} className="">
          <div>
            <textarea
              id="content"
              name="content"
              placeholder={children!.toString()}
              rows={1}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Done
          </button>
        </Form>
      )}
      <ItemDropdownMenu
        id={id}
        removeTask={removeTask}
        handleEditTask={handleEditTask}
      />
    </div>
  );
}
