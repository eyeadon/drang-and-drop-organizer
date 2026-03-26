import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id: string;
  index: number;
}

export default function Column({ children, id, index }: Props) {
  const { ref, isDropTarget } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });

  return (
    <div className={isDropTarget ? "Column active" : "Column"} ref={ref}>
      <h1>{id}</h1>
      {children}
    </div>
  );
}
