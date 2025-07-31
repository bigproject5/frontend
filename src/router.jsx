import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { Signup } from "./Signup";
import WorkerProfile from "./workerProfile";

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
