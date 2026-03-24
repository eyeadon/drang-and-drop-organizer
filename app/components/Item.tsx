import { useSortable } from "@dnd-kit/react/sortable";
import { ReactNode } from "react";

export default function Item({
  id,
  index,
  column,
  children,
}: {
  id: number;
  index: number;
  column: string;
  children: ReactNode;
}) {
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
    >
      {children}
    </button>
  );
}
