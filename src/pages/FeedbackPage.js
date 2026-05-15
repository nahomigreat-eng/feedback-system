import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function FeedbackPage() {
  const [params] = useSearchParams();
  const customerId = params.get("customerId");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId, rating, comment }),
    });

    alert("Thank you for your feedback!");
  };

  return (
    <div>
      <h2>Customer Feedback</h2>
      <p>Customer ID: {customerId}</p>

      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <textarea
        placeholder="Write your comment"
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}