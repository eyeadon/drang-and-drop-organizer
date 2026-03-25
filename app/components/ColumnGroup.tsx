"use client";
import { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import "../App.css";
import Column from "./Column";
import Item from "./Item";
import { Task } from "../generated/prisma/client";
import useTasks from "../_hooks/useTasks";
import axios from "axios";

export interface ColumnType {
  [key: string]: Task[];
}

export default function ColumnGroup() {
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

  async function saveTask(
    id: number,
    data: {
      content?: string;
      group?: string;
      index?: number;
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
          const sourceIndex = source!.element!.getAttribute("data-index");

          if (source.type === "item" && sourceIndex !== null) {
            saveTask(parseInt(source.id.toString()), {
              index: parseInt(sourceIndex),
            });
          }

          if (source.type === "column") {
            setColumnOrder((columns) => move(columns, event));
          }
        }
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
