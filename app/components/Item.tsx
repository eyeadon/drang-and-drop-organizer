import { useSortable } from "@dnd-kit/react/sortable";
import { ReactNode } from "react";

interface Props {
  id: number;
  index: number;
  column: string;
  children: ReactNode;
}

export default function Item({ id, index, column, children }: Props) {
  const { ref, isDragging, isDropping, isDragSource } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

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
    </button>
  );
}
