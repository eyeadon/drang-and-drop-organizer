"use client";
import Form from "next/form";
import { useState } from "react";

const BoardName = ({ boardName }: { boardName: string | undefined }) => {
  const [formDisplay, setFormDisplay] = useState(false);

  async function editBoardName(formData: FormData) {}

  return (
    <>
      <div className="flex flex-row  gap-4 items-start">
        <button
          className=" bg-gray-200 border border-gray-200 rounded-lg px-3 py-2 text-lg font-semibold mr-2 mb-2 hover:border-blue-600 hover:border"
          onClick={() => setFormDisplay(!formDisplay)}
        >
          {boardName ? boardName : "Untitled Board"}
        </button>
        {formDisplay && (
          <Form action={editBoardName} className="">
            <input
              id="boardName"
              name="boardName"
              placeholder={boardName}
              className="border bg-white text-lg rounded-lg px-3 py-2 mr-2 mb-2"
            />
            <button
              type="submit"
              className="border border-blue-600 bg-blue-500 text-white text-lg rounded-lg px-3 py-2 mr-2 mb-2 hover:bg-blue-600 hover:border-blue-600"
            >
              Save
            </button>
          </Form>
        )}
      </div>
    </>
  );
};

export default BoardName;
