"use client";
import { useSortable } from "@dnd-kit/react/sortable";
import axios from "axios";
import Form from "next/form";
import { ReactNode, useState } from "react";
import { Task } from "../generated/prisma/client";
import ItemDropdownMenu from "./ItemDropdownMenu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taskSchema } from "../api/validationSchemas";

interface Props {
  id: number;
  authorId: number;
  index: number;
  column: string;
  children: ReactNode;
  handleUpdateColumn: (newTask: Task, columnKey: string) => Promise<void>;
  handleDeleteColumn: (id: number, columnKey: string) => Promise<void>;
}

type TaskFormData = z.infer<typeof taskSchema>;

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
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { ref, isDragging, isDropping, isDragSource } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleEditTask = () => setIsEditing(!isEditing);

  async function editTask(data: { content: string }) {
    async function patchTask(data: { content: string; authorId: number }) {
      try {
        setSubmitting(true);
        return await axios.patch<Task>("/api/tasks/" + id, data);
      } catch (error) {
        setSubmitting(false);
        console.error("Error patching data:", error);
        setError("An unexpected error occured");
      }
    }

    async function replaceTaskInBoard() {
      const response = await patchTask({
        content: data.content,
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
        <form onSubmit={handleSubmit(editTask)} className="">
          <div>
            {error && <p className="text-red-800">{error}</p>}
            <textarea
              id="content"
              placeholder={children!.toString()}
              rows={1}
              className="w-full px-4 py-2 border rounded-lg bg-white"
              {...register("content")}
            />
            {errors && (
              <p className="text-red-800">{errors.content?.message}</p>
            )}
            <button
              disabled={isSubmitting}
              type="submit"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </form>
      )}
      <ItemDropdownMenu
        id={id}
        removeTask={removeTask}
        handleEditTask={handleEditTask}
      />
    </div>
  );
}
