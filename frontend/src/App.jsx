import {useEffect, useState} from 'react'

import './App.css'
import FileCard from "./components/FileCard.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AddFilePage from "./pages/addFilePage.jsx";
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
