'use client'
// Modify your CompletedTasksPage component to fetch completed tasks
// and display them on the page
import React, { useState, useEffect } from "react";
import Link from "next/link";


export default function CompletedTasksPage() {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/completedTask", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch completed tasks");
        }

        const data = await res.json();
        setCompletedTasks(data.completedTasks);
      } catch (error) {
        console.log("Error loading completed tasks", error);
      }
    };

    fetchCompletedTasks();
  }, []);

  return (
    <div>
      {/* Display completed tasks here */}
      {completedTasks.map((task) => (
        <div key={task._id}>
          {/* Display task details */}
          <p>{task.title}</p>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}

