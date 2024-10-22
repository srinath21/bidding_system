const express = require('express');
const router = express.Router();

const { auth } = require('../utils/auth');

const p = require('@prisma/client');
const prisma = new p.PrismaClient();

router.post("/", auth, async (req, res, next) => {
    try {
        const { AuctionCode, StraightBidAmount, MaximumBidAmount } = req.body;
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
                Code: parseInt(AuctionCode),
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
                AuctionCode: parseInt(AuctionCode),
                UserID: user.ID,
                StraightBidAmount: StraightBidAmount,
                MaximumBidAmount: MaximumBidAmount
            }
        });

        const getObservers = await prisma.bid.findMany({
            where: {
                AuctionCode: parseInt(AuctionCode),
                UserID: {
                    not: user.ID
                }
            },
            distinct: ['UserID'],
            select: {
                UserID: true
            }
        });

        if (getObservers && getObservers.length > 0) {
            for (i = 0; i < getObservers.length; i++) {
                let notification = await prisma.notification.create({
                    data: {
                        Message: `${user.FirstName} ${user.LastName} has bid ${bid.StraightBidAmount} for ${auction.ProductName}`,
                        UserID: getObservers[i].UserID
                    }
                });

                if (notification)
                    console.log("Successfully added notification");
            }
        }

        delete bid.ID;
        delete bid.UserID;

        res.status(201)
            .json({
                result: bid,
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
                StraightBidAmount: true,
                MaximumBidAmount: true,
                Auction: {
                    select: {
                        Code: true,
                        ProductName: true,
                        ProductDescription: true,
                        ProductImages: true,
                        MinimumAmount: true,
                        CloseTime: true
                    }
                },
                CreatedTime: true
            },
            orderBy: {
                CreatedTime: "desc"
            }
        });

        bids.forEach(bid => {
            bid.Auction.ProductImages = Buffer.from(bid.Auction.ProductImages).toString('base64');
            delete bid.CreatedTime;
        })

        res.status(200)
            .json({
                result: bids,
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

router.get("/auction/:auctionCode", auth, async (req, res, next) => {
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
                AuctionCode: parseInt(req.params.auctionCode),
            },
            select: {
                AuctionCode: true,
                StraightBidAmount: true,
                MaximumBidAmount: true,
                User: {
                    select: {
                        FirstName: true,
                        LastName: true,
                        EmailID: true
                    }
                },
                CreatedTime: true
            },
            orderBy: {
                CreatedTime: "desc"
            }
        });

        bids.forEach(bid => {
            if (bid.User.EmailID === req.token_details.email)
                bid.User.IsCurrentUser = true;
            else
                bid.User.IsCurrentUser = false;

            delete bid.User.EmailID;
            delete bid.CreatedTime;
        })

        res.status(200)
            .json({
                result: bids,
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
})

module.exports = router;