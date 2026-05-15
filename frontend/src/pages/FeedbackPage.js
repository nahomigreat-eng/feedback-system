import { useState } from "react";
import { useLocation } from "react-router-dom";
import StarRating from "../components/StarRating";
import { API_URL } from "../config";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(""); // ✅ NEW DATE STATE

  const query = new URLSearchParams(useLocation().search);
  const customerId = query.get("customerId");

  const submit = async () => {
    if (!comment.trim()) {
      alert("Comment required");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Rating must be 1–5");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    await fetch(`${API_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        rating,
        comment,
        date, // ✅ SEND DATE TO DATABASE
      }),
    });

    alert("Submitted successfully");

    setRating(0);
    setComment("");
    setDate(""); // reset date
  };

  return (
    <div style={styles.container}>
      <h2>Feedback Page/ሀሳብ መስጫ</h2>

      If you are willing, please specify the department you are commenting on and provide your Name and phone number
      /እባኮዎ ፍቃደኛ ከሆኑ ሀሳብ ስለሚሰጡበት ክፍል ስሞትን እና ስልክ ቁጥርዎትን ቢፅፉልን

      <StarRating rating={rating} setRating={setRating} />

      {/* ✅ DATE INPUT ADDED */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.dateInput}
      />

      <textarea
        style={styles.textarea}
        placeholder="Write your comment (English or አማርኛ)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <br />

      <button style={styles.button} onClick={submit}>
        Submit
      </button>
    </div>
  );
}

// STYLES
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Noto Sans Ethiopic', Arial",
  },

  dateInput: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginTop: "10px",
    fontFamily: "'Noto Sans Ethiopic', Arial",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },

  button: {
    marginTop: "10px",
    padding: "10px 15px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};