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

// router.get("/allusers", async (req, res) => {
//     const users = await prisma.user.findMany({});

//     res.json(
//         {
//             Entity: users,
//             Success: true
//         }
//     )
// })

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
        return next(new Error(error));
    }

    if (!existingUser || !bcrypt.compare(Password, existingUser.Password)) {
        res.json({
            Error: "Invalid credentials",
            Success: false
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
        return next(new Error(error));
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

module.exports = router;