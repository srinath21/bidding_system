const express = require('express');
const router = express.Router();

const { auth } = require('../utils/auth');

const p = require('@prisma/client');
const prisma = new p.PrismaClient();

router.post("/", auth, async (req, res, next) => {
    const { ProductName, ProductDescription, ProductImages, CloseTime, MinimumAmount } = req.body;
    console.log(req.token_details)
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
                ProductImages: ProductImages,
                CloseTime: CloseTime,
                MinimumAmount: MinimumAmount
            }
        })

        delete auction.ID;
        delete auction.UserID;

        res.status(201)
            .json({
                data: auction,
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

        res.status(200)
            .json({
                data: auctions,
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

router.get("/all", async (req, res, next) => {
    try {
        const auctions = await prisma.auction.findMany({});

        auctions.forEach(auction => {
            delete auction.ID;
            delete auction.UserID;
        })

        res.status(200)
            .json({
                data: auctions,
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

router.patch("/:auctionCode", auth, async (req, res, next) => {
    const { ProductName, ProductDescription, ProductImages, CloseTime, MinimumAmount } = req.body;
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
                ProductImages: ProductImages,
                CloseTime: CloseTime,
                MinimumAmount: MinimumAmount
            },
            where: {
                Code: auctionCode,
                UserID: user.ID
            }
        })

        delete auction.ID;
        delete auction.UserID;

        res.status(201)
            .json({
                data: auction,
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

router.delete("/:auctionCode", auth, async (req, res, next) => {
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
                Code: auctionCode,
                UserID: user.ID
            }
        });

        delete auction.ID;
        delete auction.UserID;

        res.status(200)
            .json({
                data: auction,
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

router.get("/:auctionCode", auth, async (req, res, next) => {
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
                Code: auctionCode,
                UserID: user.ID
            }
        });

        delete auction.ID;
        delete auction.UserID;

        res.status(200)
            .json({
                data: auction,
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