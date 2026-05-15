import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FeedbackPage from "./pages/FeedbackPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/" element={<Login setToken={setToken} />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            token ? (
              <AdminDashboard setToken={setToken} />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />

        {/* FEEDBACK PAGE */}
        <Route path="/feedback" element={<FeedbackPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;