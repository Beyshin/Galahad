import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import {useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {PopupProvider} from "./context/PopupContext.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);


  return (
      <PopupProvider>
          <BrowserRouter>
            {/* Routes */}
            <Routes>
                <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/home" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MainPage setIsAuthenticated={setIsAuthenticated} />
                    </ProtectedRoute>
                } />
            </Routes>
          </BrowserRouter>
      </PopupProvider>
  )
}

export default App
