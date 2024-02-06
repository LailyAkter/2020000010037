const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  boardNumber: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  staringDate: {
    type: String,
    required: true,
  },
  maxPlayers: {
    type: Number,
    required: true,
  },
  peopleBooked: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "Yet to start",
  },
});

module.exports = mongoose.model("games", gameSchema);
