import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Rest from "./pages/Rest/Rest";
function App() {
  return (
    <>
      <Router>
        <Sidebar>
          <Routes>
            <Route path="/" element={<Navigate replace to="/restful" />} />
            <Route path="/restful" element={<Rest />} />
          </Routes>
        </Sidebar>
      </Router>
    </>
  );
}

export default App;
