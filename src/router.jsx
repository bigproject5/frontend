import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./login";
import { Signup } from "./Signup";

export function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}
