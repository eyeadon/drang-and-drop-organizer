"use client";
import { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import "../App.css";
import Column from "./Column";
import Item from "./Item";
import { Board, Prisma, Task } from "../generated/prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  board: Board;
}

export interface ColumnType {
  [key: string]: Task[];
}

export default function BoardView({ board }: Props) {
  const router = useRouter();

  let startingColumns: ColumnType = {
    A: [
      {
        id: 1,
        content: "task1",
        authorId: 1,
        group: "A",
      },
      {
        id: 2,
        content: "task2",
        authorId: 1,
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

  // set columns using board content
  useEffect(() => {
    if (board) setColumns(board.content as ColumnType);
  }, []);

  async function saveBoard(
    id: number | null,
    data: {
      name: string;
      content: ColumnType;
      authorId: number;
    },
  ) {
    if (board && id !== null) {
      await axios.patch("/api/boards/" + id, data);
    }
    // create new board
    else {
      await axios.post("/api/boards", data);
      router.refresh();
    }
  }

  console.log(board);

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

        saveBoard(board ? board.id : null, {
          name: "board1",
          content: columns,
          authorId: 1,
        });
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
  );
}
