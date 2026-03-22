import { ColumnType } from "./page";

export interface StringColumnType {
  [key: string]: string[];
}

export function columnTasksToStrings(cols: ColumnType) {
  let columnKeys = Object.keys(cols);
  let updatedColumns: StringColumnType = {};

  columnKeys.forEach((key) => {
    updatedColumns[key] = cols[key].map((task) => task.content);
  });

  return updatedColumns;
}
