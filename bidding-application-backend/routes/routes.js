const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const auctionController = require("../controllers/AuctionController");
const bidsController = require("../controllers/BidController");
const notificationController = require("../controllers/NotificationController");

// add user routes
router.use("/users", userController);

// add auction routes
router.use("/auctions", auctionController);

// add bid routes
router.use("/bids", bidsController);

// add notification controller
router.use("/notifications", notificationController);

// export the router module so that server.js file can use it
module.exports = express.Router().use("/api", router);