import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/login.jsx";
import { Signup } from "./pages/Signup/Signup.jsx";
import WorkerProfile from "./pages/WokerProfile/WorkerProfile.jsx";

export function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/worker" element={<WorkerProfile />} />
            </Routes>
        </Router>
    );
}
