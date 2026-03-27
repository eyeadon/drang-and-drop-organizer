import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../generated/prisma/client";

const useTasks = () =>
  useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => axios.get<Task[]>("/api/tasks").then((res) => res.data),
    // staleTime: 60 * 1000,
  });

export default useTasks;
