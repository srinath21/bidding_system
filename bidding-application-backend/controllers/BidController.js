const express = require('express');
const router = express.Router();

const { auth } = require('../utils/auth');

const p = require('@prisma/client');
const prisma = new p.PrismaClient();

router.post("/", auth, async (req, res, next) => {
    try {
        const { AuctionCode, BidAmount } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                EmailID: req.token_details.email
            }
        });

        if (!user) {
            res.status(401)
                .json({
                    error: "Invalid User",
                    success: false
                });
            res.end();
            return;
        }

        const auction = await prisma.auction.findUnique({
            where: {
                Code: AuctionCode,
                UserID: {
                    not: user.ID
                },
                CloseTime: {
                    gt: new Date()
                }
            }
        });

        if (!auction) {
            res.status(400)
                .json({
                    error: "Invalid Auction",
                    success: false
                });
            res.end();
            return;
        }

        const bid = await prisma.bid.create({
            data: {
                AuctionCode: AuctionCode,
                UserID: user.ID,
                BidAmount: BidAmount
            }
        });

        delete bid.ID;
        delete bid.UserID;

        res.status(201)
            .json({
                data: bid,
                success: true
            });
    }
    catch (error) {
        console.log("Error creating a bid: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

router.get("/all", auth, async (req, res, next) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                EmailID: req.token_details.email
            }
        });

        if (!user) {
            res.status(401)
                .json({
                    error: "Invalid User",
                    success: false
                });
            res.end();
            return;
        }

        const bids = await prisma.bid.findMany({
            where: {
                UserID: user.ID
            },
            select: {
                BidAmount: true,
                Auction: true
            }
        });

        bids.forEach(bid => {
            delete bid.Auction.ID;
            delete bid.Auction.UserID;
        })

        res.statusCode(200)
            .json({
                data: bids,
                success: true
            });
    }
    catch (error) {
        console.log("Error fetching all bids: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

router.get("/:auctionCode", auth, async (req, res, next) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                EmailID: req.token_details.email
            }
        });

        if (!user) {
            res.status(401)
                .json({
                    error: "Invalid User",
                    success: false
                });
            res.end();
            return;
        }

        const bids = await prisma.bid.findMany({
            where: {
                AuctionCode: req.params.auctionCode,
            },
            select: {
                BidAmount: true,
                User: true
            }
        });

        bids.forEach(bid => {
            delete bid.User.ID;
            // delete bid.ID;
        })
    }
    catch (error) {
        console.log("Error fetching all bids: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
})

module.exports = router;