import { useDraggable } from "@dnd-kit/react";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";

function Draggable({ id }: { id: string }) {
  const { ref } = useDraggable({
    id,
    type: "myType",
    modifiers: [RestrictToElement.configure({ element: document.body })],
  });

  return (
    <button ref={ref} className="btn">
      drag me
    </button>
  );
}

export default Draggable;
