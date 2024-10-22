const express = require('express');
const router = express.Router();

const { auth } = require('../utils/auth');

const p = require('@prisma/client');
const prisma = new p.PrismaClient();

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

        const notifications = await prisma.notification.findMany({
            where: {
                UserID: user.ID,
                Sent: false
            },
            select: {
                Message: true,
                ID: true
            }
        });

        if (notifications && notifications.length > 0) {
            for (i = 0; i < notifications.length; i++) {
                const updateStatus = await prisma.notification.update({
                    data: {
                        Sent: true
                    },
                    where: {
                        ID: notifications[i].ID
                    }
                });

                delete notifications[i].ID;
            }
        }

        res.status(200)
            .json({
                result: notifications,
                success: true
            })
    }
    catch (error) {
        console.log("Error fetching Notifications: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
})

module.exports = router;