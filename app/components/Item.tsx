import { useSortable } from "@dnd-kit/react/sortable";
import { ReactNode } from "react";
import ItemDropdownMenu from "./ItemDropdownMenu";
import { Task } from "../generated/prisma/client";
import axios from "axios";
import { ColumnType } from "./BoardView";

interface Props {
  id: number;
  index: number;
  column: string;
  columns: ColumnType;
  children: ReactNode;
  handleDeleteColumn: (id: number, columnKey: string) => Promise<void>;
}

export default function Item({
  id,
  index,
  column,
  columns,
  children,
  handleDeleteColumn,
}: Props) {
  const { ref, isDragging, isDropping, isDragSource } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

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

      if (response?.status === 200) {
        for (const [key] of Object.entries(columns)) {
          if (key === column) {
            handleDeleteColumn(id, key);
          }
        }
      }
    }

    removeTaskFromBoard();
  }

  return (
    <button
      className={isDragSource ? "Item active" : "Item"}
      ref={ref}
      data-dragging={isDragging}
      data-dropping={isDropping}
      data-index={index}
      data-column={column}
    >
      {children}
      <ItemDropdownMenu id={id} removeTask={removeTask} />
    </button>
  );
}
