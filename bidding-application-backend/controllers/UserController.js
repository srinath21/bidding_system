const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

const p = require('@prisma/client');
const { auth } = require('../utils/auth');
const prisma = new p.PrismaClient();

router.post("/", async (req, res) => {
    let { FirstName, LastName, EmailID, Password, EmailSubscription } = req.body;

    let isExisting;
    try {
        isExisting = await prisma.user.findFirst({
            where: {
                EmailID: EmailID
            }
        }) !== null;
    }
    catch (error) {
        console.log(error);
        res.json({
            error: "Something went wrong",
            success: false
        })
        res.end();
        return;
    }

    if (isExisting) {
        res
            .status(200)
            .json({
                error: "Email already exists",
                success: false
            })
    }
    else {
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(Password, salt);

        const user = await prisma.user.create({
            data: {
                FirstName: FirstName,
                LastName: LastName,
                EmailID: EmailID,
                Password: hashedPassword,
                EmailSubscription: EmailSubscription
            }
        });

        // delete user sensitive information
        delete user.Password;
        delete user.ID;

        res
            .status(200)
            .json(
                {
                    result: user,
                    success: true
                }
            )
    }
});

router.post("/login", async (req, res, next) => {
    const { EmailID, Password } = req.body;

    let existingUser;
    try {
        existingUser = await prisma.user.findFirst({
            where: {
                EmailID: EmailID
            }
        });
    }
    catch (error) {
        console.log("Error updating user password: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })

        return;
    }

    if (!existingUser || !await bcrypt.compare(Password, existingUser.Password)) {
        res.json({
            error: "Invalid credentials",
            success: false
        });
        return;
    }

    let token;
    try {
        token = jwt.sign({
            email: existingUser.EmailID
        },
            process.env.JWT_SECRET || 'superSecret',
            { expiresIn: "1h" }
        );
    }
    catch (error) {
        console.log("Error updating user password: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
        return;
    }

    res
        .status(200)
        .json({
            success: true,
            result: {
                authToken: token,
                emailID: existingUser.EmailID,
                firstName: existingUser.FirstName,
                lastName: existingUser.LastName
            }
        })
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

        delete user.ID;
        delete user.Password;

        res.status(200)
            .json({
                result: user,
                success: true
            })
    }
    catch (error) {
        console.log("Error fetching user details: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
})

router.patch("/", auth, async (req, res, next) => {
    try {
        let { FirstName, LastName, EmailID, EmailSubscription } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                EmailID: req.token_details.email
            }
        });

        if (!user || user.EmailID.toLowerCase() !== EmailID.toLowerCase()) {
            res.status(401)
                .json({
                    error: "Invalid User",
                    success: false
                });
            res.end();
            return;
        }

        const userUpdated = await prisma.user.update({
            data: {
                FirstName: FirstName,
                LastName: LastName,
                EmailSubscription: EmailSubscription
            },
            where: {
                ID: user.ID
            }
        });

        delete userUpdated.ID;
        delete userUpdated.Password;
        delete userUpdated.CreatedTime;

        return res.status(200)
            .json({
                result: userUpdated,
                success: true
            });
    }
    catch (error) {
        console.log("Error updating user details: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
});

router.post("/user/changepassword", auth, async (req, res, next) => {
    let { UpdatedPassword, OldPassword } = req.body;
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

        if (!await bcrypt.compare(OldPassword, user.Password)) {
            res.json({
                error: "Password is invalid",
                success: false
            });
            return;
        }

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(UpdatedPassword, salt);

        const updateUser = await prisma.user.update({
            data: {
                Password: hashedPassword
            },
            where: {
                ID: user.ID
            }
        });

        res.status(200)
            .json({
                result: updateUser,
                success: true
            })
    }
    catch (error) {
        console.log("Error updating user password: ", error);
        res.status(200)
            .json({
                error: "Something went wrong!",
                success: false
            })
    }
})

module.exports = router;