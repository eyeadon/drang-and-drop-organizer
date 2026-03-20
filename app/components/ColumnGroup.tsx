"use client";
import { useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import "../App.css";
import Column from "./Column";
import Item from "./Item";
import { Task } from "../generated/prisma/client";

interface ColumnType {
  [key: string]: string[];
}

interface Props {
  tasks: Task[];
}

export default function ColumnGroup({ tasks }: Props) {
  const [columnOrder, setColumnOrder] = useState([1, 2, 3, 4]);

  const [activeTasks, setActiveTasks] = useState<Task[]>(tasks);

  const previousItems = useRef(tasks);

  return (
    <DragDropProvider
      onDragStart={() => {
        previousItems.current = tasks;
      }}
      onDragOver={(event) => {
        const { source } = event.operation;

        if (source?.type === "column") return;

        setActiveTasks((tasks) => move(tasks, event));
      }}
      onDragEnd={(event) => {
        const { source } = event.operation;

        if (event.canceled) {
          if (source?.type === "item") {
            setActiveTasks(previousItems.current);
          }

          return;
        }

        if (source?.type === "column") {
          setColumnOrder((columns) => move(columns, event));
        }
      }}
    >
      <ul className="font-sans space-y-4">
        {tasks.map((task) => (
          <li key={task.id}>
            <span className="font-semibold">{task.content}</span>
          </li>
        ))}
      </ul>
      <div className="ColumnRoot">
        {columnOrder.map((column, columnIndex) => (
          <Column key={column} id={column.toString()} index={columnIndex}>
            {activeTasks.map((task, index) => (
              <Item
                key={task.id}
                id={task.id.toString()}
                index={index}
                column={column.toString()}
              />
            ))}
          </Column>
        ))}
      </div>
    </DragDropProvider>
  );
}
