const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  minutes: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);
