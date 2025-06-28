import React, { useState } from "react";

const AddPlayer = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !number || !position) {
      setMessage("Por favor, rellena todos los campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number: Number(number), position }),
      });

      if (res.ok) {
        setMessage("Jugador añadido con éxito");
        setName("");
        setNumber("");
        setPosition("");
      } else {
        setMessage("Error al añadir jugador");
      }
    } catch (error) {
      setMessage("Error de conexión al backend");
    }
  };

  return (
    <div className="container">
      <h2>Añadir jugador</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Número:</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label>Posición:</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          >
            <option value="">-- Seleccionar --</option>
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Medio">Mediocentro</option>
            <option value="Ataque">Delantero</option>
          </select>
        </div>
        <button type="submit">Añadir jugador</button>
      </form>
    </div>
  );
};

export default AddPlayer;
