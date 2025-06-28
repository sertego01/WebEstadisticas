import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AddPlayer from "./pages/AddPlayer";
import PlayerStats from "./pages/PlayerStats";
import AddMatch from "./pages/AddMatch";

const Layout = ({ children }) => {
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Web Estadísticas Fútbol Base</h1>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/add-player" className="nav-button">
              Añadir jugador
            </Link>
          </li>
          <li>
            <Link to="/player-stats" className="nav-button">
              Estadísticas jugador
            </Link>
          </li>
          <li>
            <Link to="/add-match" className="nav-button">
              Añadir partido
            </Link>
          </li>
        </ul>
      </nav>
      <hr />
      <div>{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/add-player" element={<AddPlayer />} />
          <Route path="/player-stats" element={<PlayerStats />} />
          <Route path="/add-match" element={<AddMatch />} />
          <Route path="*" element={<p>Selecciona una opción del menú</p>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
