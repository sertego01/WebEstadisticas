const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const Player = require("../models/Player");

// Añadir un partido
router.post("/", async (req, res) => {
  try {
    const { player, goals, assists, minutes, yellowCards, redCards } = req.body;

    // Validar que el jugador exista
    const playerExists = await Player.findById(player);
    if (!playerExists) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    // Crear un nuevo partido
    const match = new Match({
      player,
      goals,
      assists,
      minutes,
      yellowCards,
      redCards,
    });

    await match.save();

    // Incrementar partidos jugados del jugador
    playerExists.matchesPlayed += 1;
    await playerExists.save();

    res.status(201).json({ message: "Partido añadido con éxito", match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al añadir el partido" });
  }
});

module.exports = router;
