import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AddFilePage from "./pages/AddFilePage.jsx";
import MainPage from "./pages/MainPage.jsx";


function App() {

  return (
          <BrowserRouter>
            {/* Routes */}
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/addFile" element={<AddFilePage />} />
            </Routes>
          </BrowserRouter>
  )
}

export default App
