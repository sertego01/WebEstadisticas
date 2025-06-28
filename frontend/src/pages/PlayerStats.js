import React, { useEffect, useState } from "react";

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch(() => setMessage("Error cargando jugadores"));
  }, []);

  const fetchStats = async (playerId) => {
    setMessage("");
    setStats(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/players/${playerId}/stats`
      );
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setMessage("No se encontraron estadísticas para este jugador");
      }
    } catch {
      setMessage("Error de conexión al backend");
    }
  };

  const handleChange = (e) => {
    setSelectedPlayerId(e.target.value);
    if (e.target.value) {
      fetchStats(e.target.value);
    } else {
      setStats(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlayerId) {
      setMessage("Selecciona un jugador para eliminar");
      return;
    }

    // Primera confirmación
    const confirm1 = window.confirm(
      "¿Estás seguro de que deseas eliminar este jugador?"
    );
    if (!confirm1) return;

    // Segunda confirmación
    const confirm2 = window.confirm(
      "Esta acción es irreversible. ¿Deseas continuar?"
    );
    if (!confirm2) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/players/${selectedPlayerId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setMessage("Jugador eliminado con éxito");
        setPlayers(players.filter((player) => player._id !== selectedPlayerId));
        setSelectedPlayerId("");
        setStats(null);
      } else {
        setMessage("Error al eliminar jugador");
      }
    } catch {
      setMessage("Error de conexión al backend");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Estadísticas jugador</h2>
      {message && (
        <p style={{ textAlign: "center", color: "red" }}>{message}</p>
      )}
      <div
        style={{ maxWidth: "400px", margin: "0 auto", marginBottom: "20px" }}
      >
        <label
          style={{ display: "block", marginBottom: "8px", textAlign: "center" }}
        >
          Selecciona un jugador:
        </label>
        <select
          value={selectedPlayerId}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        >
          <option value="">-- Elige jugador --</option>
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name} ({player.number}) - {player.position}
            </option>
          ))}
        </select>
      </div>
      {stats && (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Estadística
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px", textAlign: "left" }}>Goles</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {stats.goals}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "left" }}>Asistencias</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {stats.assists}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "left" }}>Partidos Jugados</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {stats.matchesPlayed}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "left" }}>Minutos</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {stats.minutes}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "left"}}>% Minutos</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {((stats.minutes / (stats.matchesPlayed * 80)) * 100).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "left" }}>Tarjetas amarillas</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {stats.yellowCards}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "left" }}>Tarjetas rojas</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {stats.redCards}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={handleDelete}
            >
              Eliminar jugador
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerStats;
