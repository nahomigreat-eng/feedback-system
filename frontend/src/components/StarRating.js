// components/StarRating.js
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating, setRating }) {
  return (
    <div>
      {[1,2,3,4,5].map((star) => (
        <FaStar
          key={star}
          size={30}
          color={star <= rating ? "gold" : "gray"}
          onClick={() => setRating(star)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
}