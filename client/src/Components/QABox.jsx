import React, { useState } from "react";
import axios from "axios";
import "./QABox.css";

const QABOX = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/docs/qa",
        { question },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAnswer(res.data);
    } catch (err) {
      console.error("Error asking question:", err);
      setAnswer({ answer: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qa-container">
      <h2>Ask a Question</h2>
      <div className="qa-input">
        <input
          type="text"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="qa-answer">
          <h3>Answer:</h3>
          <p>{answer.answer}</p>

          {answer.source && (
            <div className="qa-source">
              <strong>Source:</strong> {answer.source.title}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QABOX;
