import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workerpartdetail from "./pages/workerpartdetail";
import Cartest from "./pages/cartest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Worker-partdetail" element={<Workerpartdetail/>} />
        <Route path="/Car-test" element={<Cartest />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

