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
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

  return (
    <button className="Item" ref={ref} data-dragging={isDragging}>
      {id}
    </button>
  );
}
