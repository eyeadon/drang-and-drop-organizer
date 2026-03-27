"use client";
import { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import "../App.css";
import Column from "./Column";
import Item from "./Item";
import { Board, Prisma, Task } from "../generated/prisma/client";
import axios from "axios";
import useBoards from "../_hooks/useBoards";

export interface ColumnType {
  [key: string]: Task[];
}

export default function BoardView() {
  let userAuthorId = 1;
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
  const [boards, setBoards] = useState<Board[]>();
  const previousColumns = useRef(columns);
  const [columnOrder, setColumnOrder] = useState(() => Object.keys(columns));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Board[]>("/api/boards");
        if (response.data.length !== 0)
          setColumns(response.data[0].content as ColumnType);
        setBoards(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); //

  async function saveBoard(data: {
    id: number;
    content: ColumnType;
    authorId: number;
  }) {
    if (boards && boards.length !== 0)
      await axios.patch("/api/boards/" + data.id, data);
    else if (boards) await axios.post("/api/boards", data);
  }

  console.log("boards: ", boards);
  console.log("columns: ", columns);

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

        saveBoard({
          id: 1,
          content: columns,
          authorId: userAuthorId,
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
