import { useSortable } from "@dnd-kit/react/sortable";

export default function Item({
  id,
  index,
  column,
}: {
  id: string;
  index: number;
  column: string;
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
      {id}
    </button>
  );
}
