"use client";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import "../App.css";
import { saveBoard } from "../functions";
import { Board, Task } from "../generated/prisma/client";
import AddTaskForm from "./AddTaskForm";
import Column from "./Column";
import Item from "./Item";
import { createContext } from "react";

interface Props {
  authorId: number;
  board: Board;
}

export interface ColumnType {
  [key: string]: Task[];
}

interface ColumnContextType {
  columns: ColumnType;
  handleUpdateColumn: (newTask: Task, columnKey: string) => void;
}

export const ColumnContext = createContext<ColumnContextType | null>(null);

export const useColumnContext = () => {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error("ColumnContext is null");
  }
  return context;
};

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
      prevColumns[columnKey].push(newTask);
      return prevColumns;
    });
  };

  return (
    <>
      <ColumnContext value={{ columns, handleUpdateColumn }}>
        <AddTaskForm
          authorId={authorId}
          board={board}
          // columns={columns}
          // handleUpdateColumn={handleUpdateColumn}
        />
      </ColumnContext>

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
