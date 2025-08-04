import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workerpartdetail from "./pages/workerpartdetail";
import Cartest from "./pages/cartest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* inspectionId를 URL 파라미터로 받도록 수정 */}
        <Route path="/Worker-partdetail/:inspectionId" element={<Workerpartdetail />} />
        <Route path="/Car-test" element={<Cartest />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
