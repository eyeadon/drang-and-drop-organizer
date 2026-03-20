import Form from "next/form";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface Props {
  authorId: number;
}

export default function AddTaskForm({ authorId }: Props) {
  async function createPost(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;

    await prisma.task.create({
      data: {
        content,
        authorId,
      },
    });

    revalidatePath("/");
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Form action={createPost} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-lg mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Task..."
            rows={1}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Add Task
        </button>
      </Form>
    </div>
  );
}
