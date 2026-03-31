"use client";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../App.css";
import { saveBoard } from "../functions";
import { Board, Task } from "../generated/prisma/client";
import AddTaskForm from "./AddTaskForm";
import Column from "./Column";
import Item from "./Item";

interface Props {
  authorId: number;
  board: Board;
}

export interface ColumnType {
  [key: string]: Task[];
}

export default function BoardView({ authorId, board }: Props) {
  const router = useRouter();

  let startingColumns: ColumnType = {
    A: [
      {
        id: 1,
        content: "task1",
        authorId,
        group: "A",
      },
      {
        id: 2,
        content: "task2",
        authorId,
        group: "A",
      },
    ],
    B: [],
    C: [],
    D: [],
  };

  const [columns, setColumns] = useState<ColumnType>(startingColumns);
  const previousColumns = useRef(columns);
  const [columnOrder, setColumnOrder] = useState(() => Object.keys(columns));

  // set starting columns using board content
  useEffect(() => {
    if (board) setColumns(board.content as ColumnType);
  }, []);

  const handleUpdateColumn = (newTask: Task, columnKey: string) => {
    setColumns((prevColumns) => {
      let updatedArray = [...prevColumns[columnKey], newTask];

      return { ...prevColumns, [columnKey]: updatedArray };
    });
  };

  return (
    <>
      <AddTaskForm
        authorId={authorId}
        board={board}
        columns={columns}
        handleUpdateColumn={handleUpdateColumn}
      />

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

          saveBoard(
            board ? board.id : null,
            {
              name: "board1",
              content: columns,
              authorId,
            },
            router,
          );
        }}
      >
        <div className="ColumnRoot">
          {columnOrder.map((column, columnIndex) => (
            <Column key={column} id={column} index={columnIndex}>
              {columns[column].map((task, index) => (
                <Item key={task.id} id={task.id} index={index} column={column}>
                  {task.content}
                </Item>
              ))}
            </Column>
          ))}
        </div>
      </DragDropProvider>
    </>
  );
}
