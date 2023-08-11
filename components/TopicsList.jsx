'use client';
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

export default function TopicsList() {
  const [topics, setTopics] = useState([]);


  const handleTaskRemoval = (idToRemove) => {
    setTopics((prevTopics) => prevTopics.filter((topic) => topic._id !== idToRemove));
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
        topicItem._id === id ? { ...topicItem, completed: isChecked } : topicItem
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
              {t.completed ? <p className="com">Completed</p> : <p className="inc">Incomplete</p>}
            </div>
            <RemoveBtn id={t._id} onRemove={handleTaskRemoval} />
            {!t.completed && (
            <Link href={`/editTopic/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>)}
          </div>
        </div>
      ))}
    </>
  );
}
