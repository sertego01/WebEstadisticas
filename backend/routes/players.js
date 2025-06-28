const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Match = require("../models/Match");

// Crear nuevo jugador
router.post("/", async (req, res) => {
  const { name, number, position } = req.body;
  try {
    const player = new Player({ name, number, position });
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: "Error creando jugador" });
  }
});

// Obtener lista de jugadores
router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo jugadores" });
  }
});

// Eliminar jugador y sus partidos
router.delete("/:id", async (req, res) => {
  try {
    const playerId = req.params.id;

    // Elimina los partidos asociados al jugador
    await Match.deleteMany({ player: playerId });

    // Elimina el jugador
    await Player.findByIdAndDelete(playerId);

    res.status(200).json({ message: "Jugador y sus partidos asociados eliminados" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar jugador y sus partidos asociados" });
  }
});

// Obtener estadísticas totales de un jugador
router.get("/:id/stats", async (req, res) => {
  const playerId = req.params.id;
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    const stats = await Match.aggregate([
      { $match: { player: player._id } },
      {
        $group: {
          _id: "$player",
          goals: { $sum: "$goals" },
          assists: { $sum: "$assists" },
          minutes: { $sum: "$minutes" },
          yellowCards: { $sum: "$yellowCards" },
          redCards: { $sum: "$redCards" },
        },
      },
    ]);

    // Si no hay partidos, devolver estadísticas iniciales
    const playerStats = stats.length > 0 ? stats[0] : {
      goals: 0,
      assists: 0,
      minutes: 0,
      yellowCards: 0,
      redCards: 0,
    };

    // Enviar la respuesta incluyendo partidos jugados del jugador
    res.json({
      _id: playerId,
      name: player.name,
      matchesPlayed: player.matchesPlayed,
      ...playerStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
