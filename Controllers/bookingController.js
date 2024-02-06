const Booking = require("../models/bookingsModel");
const Game = require("../models/gameModel");
const User = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require("moment");

// nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// book people and send email to user with the booking details
const BookPeople = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body, // spread operator to get all the data from the request body
      user: req.params.userId,
    });
    const user = await User.findById(req.params.userId);
    // res.json(user._id)
    await newBooking.save();
    const game = await Game.findById(req.body.game); // get the game from the request body
    game.peopleBooked = [...game.peopleBooked, ...req.body.people]; // add the booked people to the game peopleBooked array in the database

    await game.save();
    // send email to user with the booking details
    let mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Booking Details",
      text: `Hello ${user.name}, your booking details are as follows:
      Game_Name: ${game.name}
      people: ${req.body.people}
      Start Time: ${moment(game.startTime, "HH:mm:ss").format("hh:mm A")}
      End Time: ${moment(game.endTime, "HH:mm:ss").format("hh:mm A")}
      Staring Date: ${game.staringDate}
      Thank you for choosing us! 
      `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error Occurs", err);
      } else {
        console.log("Email sent!!!");
      }
    });
    res.status(200).send({
      message: "People booked successfully",
      data: newBooking,
      user: user._id,
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("game").populate("user");
    res.status(200).send({
      message: "All bookings",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to get bookings",
      data: error,
      success: false,
    });
  }
};

const GetAllBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.user_Id }).populate([
      "game",
      "user",
    ]);
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};

// cancel booking by id and remove the people from the game peopleBooked array
const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    const user = await User.findById(req.params.user_id);
    const game = await Game.findById(req.params.game_id);

    if (!booking || !user || !game) {
      return res.status(404).send({
        message: "Booking not found",
        data: { booking, user, game },
        success: false,
      });
    }

    await booking.remove();

    game.peopleBooked = game.peopleBooked.filter(
      (people) => !booking.people.includes(people)
    );

    await game.save();
    
    return res.status(200).send({
      message: "Booking cancelled successfully",
      data: booking,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Booking cancellation failed",
      data: error.message, // Use error.message for a more informative error response
      success: false,
    });
  }
};

module.exports = {
  BookPeople,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking,
};
