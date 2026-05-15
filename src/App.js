import { BrowserRouter, Routes, Route } from "react-router-dom";
import FeedbackPage from "./pages/FeedbackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;