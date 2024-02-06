const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  BookPeople,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking,
} = require("../Controllers/bookingController");

router.post("/book-people/:userId", BookPeople);
router.get("/get-all-bookings", authMiddleware, GetAllBookings);
router.get("/:user_Id", authMiddleware, GetAllBookingsByUser);
router.delete("/:booking_id/:user_id/:game_id", authMiddleware, CancelBooking);

module.exports = router;
