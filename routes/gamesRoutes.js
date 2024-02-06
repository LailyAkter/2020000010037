const express = require("express");
const router = express();

const authMiddleware = require("../middlewares/authMiddleware");
const { AddGame, GetAllGames, UpdateGame, DeleteGame, GetGameById, GetGamesByFromAndTo } = require("../Controllers/gameController");

router.post("/add-game", authMiddleware, AddGame);
router.post("/get-all-games", authMiddleware, GetAllGames);
router.put("/:id", authMiddleware, UpdateGame);
router.delete("/:id", authMiddleware, DeleteGame);
router.get("/:id", authMiddleware, GetGameById);
router.post("/get", authMiddleware, GetGamesByFromAndTo);

module.exports = router;
