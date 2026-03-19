import { useDroppable } from "@dnd-kit/react";
import type { ReactNode } from "react";

interface Props {
  id: string;
  children?: ReactNode;
}

function Droppable({ id, children }: Props) {
  const { ref, isDropTarget } = useDroppable({
    id,
    accept: "myType",
  });

  return (
    <div ref={ref} className={isDropTarget ? "droppable active" : "droppable"}>
      {children}
    </div>
  );
}

export default Droppable;
