const Game = require("../models/gameModel.js");

// Add a new game
const AddGame = async (req, res) => {
  try {
    const existingGame = await Game.findOne({ boardNumber: req.body.boardNumber });
    if (existingGame) {
      // Game already exists
      return res.status(200).send({
        message: "Game already exists",
        success: false,
        data: null
      });
    }
    // Game doesn't exist, save new game
    await new Game({
      name: req.body.name,
      boardNumber: req.body.boardNumber,
      startTime: req.body.startTime,
      endTime:req.body.endTime,
      staringDate:req.body.staringDate,
      maxPlayers:req.body.maxPlayers,
      peopleBooked:req.body.peopleBooked,
    }).save();
    res.status(200).send({
      message: "Game created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get all games and if the startingdate is passed 1 hour ago , make the status of the game to "Completed"
const GetAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    games.forEach(async (game) => {
      const journey = new Date(game.staringDate);

      const departure = new Date(
        `${journey.getFullYear()}-${
          journey.getMonth() + 1
        }-${journey.getDate()} ${game.departure}`
      );

      if (departure.getTime() - new Date().getTime() < 3600000) {
        await Game.findByIdAndUpdate(game._id, { status: "Completed" });
      }
    });

    const orderedGames = games.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") {
        return 1;
      } else if (a.status !== "Completed" && b.status === "Completed") {
        return -1;
      } else {
        return new Date(a.staringDate) - new Date(b.staringDate);
      }
    });

    res.status(200).send({
      message: "Games fetched successfully",
      success: true,
      data: orderedGames,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Games Found",
      success: false,
      data: error,
    });
  }
};

// get all games by from and to
const GetGamesByFromAndTo = async (req, res) => {
  try {
    const games = await Game.find({
      from: req.query.from,
      to: req.query.to,
      staringDate: req.query.staringDate,
    });

    games.forEach(async (game) => {
      const journey = new Date(game.staringDate);
      const departure = new Date(
        `${journey.getFullYear()}-${
          journey.getMonth() + 1
        }-${journey.getDate()} ${game.departure}`
      );

      if (departure.getTime() - new Date().getTime() < 3600000) {
        await Game.findByIdAndUpdate(game._id, { status: "Completed" });
      }
    });

    const filteredGames = games.filter(
      (game) => game.status !== "Completed" && game.status !== "Running"
    );
    res.status(200).send({
      message: "Games fetched successfully",
      success: true,
      data: filteredGames,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Games Found",
      success: false,
      data: error,
    });
  }
};

// update a game
const UpdateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).send({
        message: "Game not found",
        success: false,
      });
    }

    if (game.status === "Completed") {
      console.log(game.status);
      return res.status(400).send({
        message: "You can't update a completed game",
        success: false,
      });
    }

    // Update the game
    await Game.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).send({
      message: "Game updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
      data: error,
    });
  }
};


// delete a Game
const DeleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Game deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get Game by id
const GetGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.status(200).send({
      message: "Game fetched successfully",
      success: true,
      data: game,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddGame,
  GetAllGames,
  UpdateGame,
  DeleteGame,
  GetGameById,
  GetGamesByFromAndTo,
};
