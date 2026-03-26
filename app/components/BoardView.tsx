"use client";
import { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import "../App.css";
import Column from "./Column";
import Item from "./Item";
import { Board, Task } from "../generated/prisma/client";
import axios from "axios";

export interface ColumnType {
  [key: string]: Task[];
}

export default function BoardView({
  id: boardId,
  content: boardContent,
  authorId: boardAuthorId,
}: Board) {
  let startingColumns: ColumnType = {
    A: [],
    B: [],
    C: [],
    D: [],
  };

  const [columns, setColumns] = useState<ColumnType>(startingColumns);
  const previousColumns = useRef(columns);
  const [columnOrder, setColumnOrder] = useState(() => Object.keys(columns));

  function populateStartingColumns(tasks: Task[], startingColumns: ColumnType) {
    Object.keys(startingColumns).forEach((key) => {
      tasks.forEach((task) => {
        if (task.group === key) {
          startingColumns[key].push(task);
        }
      });
    });

    return startingColumns;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Task[]>("/api/tasks");
        setColumns(populateStartingColumns(response.data, startingColumns));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); //

  async function saveBoard(data: { content: ColumnType; authorId: number }) {
    if (boardContent) await axios.patch("/api/boards/" + boardId, data);
    else await axios.post("/api/boards", data);
  }

  async function saveTask(
    id: number,
    data: {
      content?: string;
      group?: string;
      authorId?: number;
    },
  ) {
    await axios.patch("/api/tasks/" + id, data);
  }

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
        if (source) {
          if (source.type === "column") {
            setColumnOrder((columns) => move(columns, event));
          }
          const taskId = parseInt(source.id.toString());
          const sourceColumn = source.element!.getAttribute("data-column");

          if (sourceColumn !== null) saveTask(taskId, { group: sourceColumn });
        }
        saveBoard({ content: columns, authorId: boardAuthorId });
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
