const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();

router.use(fileUpload())

const { auth, optional } = require('../utils/auth');

const p = require('@prisma/client');
const prisma = new p.PrismaClient();

router.post("/", auth, async (req, res, next) => {
    const { ProductName, ProductDescription, CloseTime, MinimumAmount } = req.body;
    const { ProductImages } = req.files;
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

        const auction = await prisma.auction.create({
            data: {
                UserID: user.ID,
                ProductName: ProductName,
                ProductDescription: ProductDescription,
                ProductImages: ProductImages.data,
                CloseTime: CloseTime,
                MinimumAmount: MinimumAmount
            }
        })

        delete auction.ID;
        delete auction.UserID;

        auction.ProductImages = Buffer.from(auction.ProductImages).toString('base64');

        res.status(201)
            .json({
                result: auction,
                success: true
            })
    }
    catch (error) {
        console.log("Error in Auction Create: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

router.get("/", auth, async (req, res, next) => {
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

        const auctions = await prisma.auction.findMany({
            where: {
                UserID: user.ID
            }
        });

        auctions.forEach(auction => {
            delete auction.ID;
            delete auction.UserID;
        });

        const maxBids = await prisma.bid.groupBy({
            by: ["AuctionCode"],
            _max: {
                StraightBidAmount: true
            }
        })

        let auctionsWithMaxBid = auctions.map((auction) => {
            const maxBid = maxBids.find(bid => bid.AuctionCode === auction.Code);

            return {
                ...auction,
                CurrentBid: maxBid ? maxBid._max.StraightBidAmount : 0
            }
        });

        res.status(200)
            .json({
                result: auctionsWithMaxBid,
                success: true
            });
    }
    catch (error) {
        console.log("Error fetching auctions for user: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
})

router.get("/all", optional, async (req, res, next) => {
    try {
        const auctions = req.token_details ?
            await prisma.auction.findMany({
                where: {
                    User: {
                        EmailID: {
                            not: req.token_details.email
                        }
                    },
                }
            }) :
            await prisma.auction.findMany({});

        auctions.forEach(auction => {
            auction.ProductImages = Buffer.from(auction.ProductImages).toString('base64');

            delete auction.ID;
            delete auction.UserID;
        })

        const maxBids = await prisma.bid.groupBy({
            by: ["AuctionCode"],
            _max: {
                StraightBidAmount: true
            }
        })

        let auctionsWithMaxBid = auctions.map((auction) => {
            const maxBid = maxBids.find(bid => bid.AuctionCode === auction.Code);

            return {
                ...auction,
                CurrentBid: maxBid ? maxBid._max.StraightBidAmount : 0
            }
        });

        res.status(200)
            .json({
                result: auctionsWithMaxBid,
                success: true
            });
    }
    catch (error) {
        console.log("Error fetching all auctions: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

router.patch("/auction/:auctionCode", auth, async (req, res, next) => {
    const { ProductName, ProductDescription, CloseTime, MinimumAmount } = req.body;
    const { ProductImages } = req.files;
    const auctionCode = req.params.auctionCode;
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

        const auction = await prisma.auction.update({
            data: {
                ProductName: ProductName,
                ProductDescription: ProductDescription,
                ProductImages: ProductImages.arrayBuffer,
                CloseTime: CloseTime,
                MinimumAmount: MinimumAmount
            },
            where: {
                Code: parseInt(auctionCode),
                UserID: user.ID
            }
        })

        delete auction.ID;
        delete auction.UserID;

        auction.ProductImages = Buffer.from(auction.ProductImages).toString('base64');

        res.status(201)
            .json({
                result: auction,
                success: true
            })
    }
    catch (error) {
        console.log("Error updating auction: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

router.delete("/auction/:auctionCode", auth, async (req, res, next) => {
    const auctionCode = req.params.auctionCode;
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

        const auction = await prisma.auction.delete({
            where: {
                Code: parseInt(auctionCode),
                UserID: user.ID
            }
        });

        delete auction.ID;
        delete auction.UserID;

        auction.ProductImages = Buffer.from(auction.ProductImages).toString('base64');

        res.status(200)
            .json({
                result: auction,
                success: true
            })
    }
    catch (error) {
        console.log("Error deleting auction: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
})

router.get("/auction/:auctionCode", auth, async (req, res, next) => {
    const auctionCode = req.params.auctionCode;
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

        const auction = await prisma.auction.findUniqueOrThrow({
            where: {
                Code: parseInt(auctionCode),
            }
        });

        const bid = await prisma.bid.findFirst({
            where: {
                AuctionCode: parseInt(auctionCode)
            },
            orderBy: {
                StraightBidAmount: 'desc'
            }
        });

        if (bid) {
            auction.CurrentBid = bid.StraightBidAmount;
        }

        auction.ProductImages = Buffer.from(auction.ProductImages).toString('base64');

        delete auction.ID;
        delete auction.UserID;

        res.status(200)
            .json({
                result: auction,
                success: true
            })
    }
    catch (error) {
        console.log("Error fetching auction: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

module.exports = router;