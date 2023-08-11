'use client';

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveBtn({ id, onRemove}) {
  const router = useRouter();

  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
    const res = await fetch(`http://localhost:3000/api/topic?id=${id}`, {
        method: "DELETE",
      });
      if(res.ok) {
        // router.refresh();
        onRemove(id); // Notify the parent component to remove the task
      }
    }
  };
  return (
    <button onClick={removeTopic} className="text-red-400">
      <HiOutlineTrash size={24} />
    </button>
  );
}
