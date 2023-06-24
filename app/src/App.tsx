import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import HomeView from "./views/home";
import SelectView from "./views/select";
import CreateView from "./views/create";
import LobbyView from "./views/lobby";
import NameView from "./views/name";
import MainLayout from "./layouts/main";
import { Provider } from "./contexts/main";
import GameView from "./views/game";

function App() {
  return (
    <Router>
      <Provider>
        <MainLayout>
          <Routes>
            <Route index element={<HomeView />} />
            <Route path="/name" element={<NameView />} />
            <Route path="/select" element={<SelectView />} />
            <Route path="/create" element={<CreateView />} />
            <Route path="/lobby" element={<LobbyView />} />
            <Route path="/game" element={<GameView />} />
          </Routes>
        </MainLayout>
      </Provider>
    </Router>
  );
}

export default App;
