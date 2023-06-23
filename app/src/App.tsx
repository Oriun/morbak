import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import HomeView from "./views/home";
import SelectView from "./views/select";
import CreateView from "./views/create";
import LobbyView from "./views/lobby";
import MainLayout from "./layouts/main";
import NameView from "./views/name";


function App() {
  console.log("hello");
  return (
    <MainLayout>
      <Router>
        <Routes>
          <Route index element={<HomeView />} />
          <Route path="/name" element={<NameView />} />
          <Route path="/select" element={<SelectView />} />
          <Route path="/create" element={<CreateView />} />
          <Route path="/lobby" element={<LobbyView />} />
        </Routes>
      </Router>
    </MainLayout>
  );
}

export default App;
