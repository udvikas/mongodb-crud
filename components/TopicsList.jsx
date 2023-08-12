"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

const getTopics = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/topic", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch the topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics", error);
  }
};

export default function TopicsList({ completedTasks, setCompletedTasks }) {
  const [topics, setTopics] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const getCompletedTask = () => {
    return topics.filter((topic) => topic.completed);
  };

  const handleTaskRemoval = async (idToRemove) => {
    try {
      await fetch(`http://localhost:3000/api/topic/${idToRemove}`, {
        method: "DELETE",
      });

      // Filter out the deleted task
      setTopics((prevTopics) =>
        prevTopics.filter((topic) => topic._id !== idToRemove)
      );

      // Find the deleted task in completedTasks
      const deletedTask = completedTasks.find(
        (task) => task._id === idToRemove
      );
        
      
    // Send the deleted task to the completedTask API route
    await fetch("http://localhost:3000/api/completedTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deletedTask), // Assuming deletedTask holds the deleted task data
    });
    
      if (deletedTask) {
        // Remove the deleted task from completedTasks and update state
        setCompletedTasks((prevCompletedTasks) =>
          prevCompletedTasks.filter((task) => task._id !== idToRemove)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxClick = async (id, isChecked) => {
    try {
      const res = await fetch(`http://localhost:3000/api/topic/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ completed: isChecked }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

      const updatedTopics = topics.map((topicItem) =>
        topicItem._id === id
          ? { ...topicItem, completed: isChecked }
          : topicItem
      );

      setTopics(updatedTopics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      const { topics } = await getTopics();
      setTopics(topics);
    };

    fetchTopics();
  }, []);

  return (
    <>
      {topics.map((t) => (
        <div
          key={t._id}
          className={`p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start ${
            t.completed ? "completed" : ""
          }`}
        >
          <div>
            <h2 className="font-bold text-2xl">
              <input
                className="check"
                type="checkbox"
                checked={t.completed}
                onChange={(e) => handleCheckboxClick(t._id, e.target.checked)}
              />
              {t.title}
            </h2>
            <div className="desc">{t.description}</div>
          </div>

          <div className="flex gap-2">
            <div className="status">
              {t.completed ? (
                <p className="com">Completed</p>
              ) : (
                <p className="inc">Incomplete</p>
              )}
            </div>
            <RemoveBtn id={t._id} onRemove={handleTaskRemoval} />
            {!t.completed && (
              <Link href={`/editTopic/${t._id}`}>
                <HiPencilAlt size={24} />
              </Link>
            )}
          </div>
        </div>
      ))}

      <Link href="/api/completedTask">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
        >
          Completed Task
        </button>
      </Link>
    </>
  );
}
