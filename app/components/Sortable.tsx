import { useSortable } from "@dnd-kit/react/sortable";
import { useRef, useState } from "react";

function Sortable({ id, index }: { id: number; index: number }) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({ id, index, element, handle: handleRef });

  return (
    <li ref={setElement} className="item" data-shadow={isDragging || undefined}>
      {id}
      <button ref={handleRef} className="handle" />
    </li>
  );
}

export default Sortable;
