import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Admin } from "./pages/Admin";
import { Portal } from "./pages/Portal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/portal" element={<Portal />} />
    </Routes>
  );
}

export default App;
