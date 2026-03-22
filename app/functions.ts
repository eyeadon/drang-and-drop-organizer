import { Task } from "./generated/prisma/client";
import { ColumnType } from "./page";

export interface StringColumnType {
  [key: string]: string[];
}

function columnTasksToStrings(cols: ColumnType, tasks: Task[]) {
  let columnKeys = Object.keys(cols);
  let updatedColumns: StringColumnType = {};

  columnKeys.forEach((key) => {
    updatedColumns[key] = tasks.map((task) => task.content);
  });

  return updatedColumns;
}
