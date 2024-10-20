const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const auctionController = require("../controllers/AuctionController");
const bidsController = require("../controllers/BidController");

// add user routes
router.use("/users", userController);

// add auction routes
router.use("/auctions", auctionController);

// add bid routes
router.use("/bids", bidsController);

// export the router module so that server.js file can use it
module.exports = express.Router().use("/api", router);