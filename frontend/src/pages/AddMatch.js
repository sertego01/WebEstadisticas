import React, { useState, useEffect } from "react";

const AddMatch = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Cargar lista de jugadores
    fetch("http://localhost:5000/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch(() => setMessage("Error cargando jugadores"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedPlayerId) {
      setMessage("Selecciona un jugador");
      return;
    }

    if (minutes > 80 || minutes < 0) {
      setMessage("Los minutos deben estar entre 0 y 80");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: selectedPlayerId,
          goals,
          assists,
          matchesPlayed: 1,
          minutes,
          yellowCards,
          redCards,
        }),
      });

      if (res.ok) {
        setMessage("Partido añadido con éxito");
        setGoals(0);
        setAssists(0);
        setMinutes(0);
        setYellowCards(0);
        setRedCards(0);
        setSelectedPlayerId("");
      } else {
        setMessage("Error al añadir el partido");
      }
    } catch {
      setMessage("Error de conexión al backend");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Añadir partido</h2>
      {message && (
        <p style={{ color: "red", textAlign: "center" }}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Selecciona jugador:</label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            required
          >
            <option value="">-- Selecciona --</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name} ({player.number}) - {player.position}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Goles:</label>
          <input
            type="number"
            value={goals}
            onChange={(e) => setGoals(Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label>Asistencias:</label>
          <input
            type="number"
            value={assists}
            onChange={(e) => setAssists(Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label>Minutos:</label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            min="0"
            max="80"
          />
        </div>
        <div>
          <label>Tarjetas amarillas:</label>
          <input
            type="number"
            value={yellowCards}
            onChange={(e) => setYellowCards(Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label>Tarjetas rojas:</label>
          <input
            type="number"
            value={redCards}
            onChange={(e) => setRedCards(Number(e.target.value))}
            min="0"
          />
        </div>
        <button type="submit">Guardar partido</button>
      </form>
    </div>
  );
};

export default AddMatch;
