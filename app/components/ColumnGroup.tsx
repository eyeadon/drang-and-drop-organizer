"use client";
import { useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import "../App.css";
import Column from "./Column";
import Item from "./Item";
import { Task } from "../generated/prisma/client";
import { ColumnType } from "../page";
import { columnTasksToStrings, StringColumnType } from "../functions";

interface Props {
  tasks: Task[];
  startingColumns: ColumnType;
}

export default function ColumnGroup({ tasks, startingColumns }: Props) {
  const [columns, setColumns] = useState<StringColumnType>(
    columnTasksToStrings(startingColumns),
  );

  const previousColumns = useRef<StringColumnType>(columns);

  const [columnOrder, setColumnOrder] = useState(() => Object.keys(columns));

  return (
    <DragDropProvider
      onDragStart={() => {
        previousColumns.current = columns;
      }}
      onDragOver={(event) => {
        const { source } = event.operation;

        if (source?.type === "column") return;

        setColumns((columns) => move(columns, event));
      }}
      onDragEnd={(event) => {
        const { source } = event.operation;

        if (event.canceled) {
          if (source?.type === "item") {
            setColumns(previousColumns.current);
          }

          return;
        }

        if (source?.type === "column") {
          setColumnOrder((columns) => move(columns, event));
        }
      }}
    >
      <div className="ColumnRoot">
        {columnOrder.map((column, columnIndex) => (
          <Column key={column} id={column} index={columnIndex}>
            {columns[column].map((task, index) => (
              <Item key={task} id={task} index={index} column={column}>
                {task}
              </Item>
            ))}
          </Column>
        ))}
      </div>
    </DragDropProvider>
  );
}
