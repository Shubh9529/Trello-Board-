// username , password | user table
//organization | ORGNIZATIONS Table
//bords || Bords table
// issues | issues table
const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { userModel, organizationModel } = require("./models");



let boards_ID = 1;
let issues = 1;
// let organizations = [];
// let organizations_ID = 1;


const BOARDS = [];
const ISSUES = [];

const app = express();
app.use(express.json());
// Create endpoint
app.post("/signup", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // const userExists = USERS.find(u => u.username === username);
    const userExists = await userModel.findOne({
        username: username,

    })

    if (userExists) {
        return res.status(411).json({
            message: "User with this username already exists"
        });
        return;
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.json({
        id: newUser._id,
        message: "you have signed up successfully"
    })
})

app.post("/signin", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    });

    if (!userExists) {
        return res.status(403).json({
            message: "Incorrect credentials"

        })
        return;
    }
    const token = jwt.sign({
        userId: userExists.id
    }, "secret123123");

    res.json({
        token
    });
});

//authenticated Route- Middleware
app.post("/organization", authMiddleware, async(req, res) => {
    const organization = await organizationModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: req.userId,
        members: []
    });

    res.json({
        message: "Org created",
        id: organization._id
    });
});
app.post("/add-member-to-organization", authMiddleware, async(req, res) => {
    const userId = req.userId;
    const organizationID = req.body.organizationID;
    const memberUserUsername = req.body.memberUserUsername;

    const organization = await organizationModel.findById(organizationID);
    console.log("Organization:", organization);

    if (!organization) {
        return res.status(404).json({
            message: "Organization not found"
        });
    }

    if (!organization.admin) {
        return res.status(400).json({
            message: "Organization has no admin. Create a new organization."
        });
    }

    if (organization.admin.toString() !== userId) {
        return res.status(403).json({
            message: "You are not the admin of this organization"
        });
    }

    const memberUser = await userModel.findOne({
        username: memberUserUsername
    });

    if (!memberUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    organization.members.push(memberUser._id);
    await organization.save();

    res.json({
        message: "New member added!"
    });
});

app.post("/board", (req, res) => {

})



app.post("/issue", (req, res) => {

})

// Read , this will send request 

app.get("/organization", authMiddleware, async(req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = await organizationModel.findById(organizationId);

    if (!organization || organization.admin.toString() !== userId) {
        return res.status(411).json({
            message: "either org doesnt exist or you are not an admin of this org"
        });
    }

    const members = await userModel.find({
        _id: { $in: organization.members }
    }).select("username");

    res.json({
        organization: {
            _id: organization._id,
            title: organization.title,
            description: organization.description,
            admin: organization.admin,
            members: members
        }
    });
});
// app.get("/board", (req, res) => {})
// app.get("/issue", (req, res) => {



app.get("/members", (req, res) => {

})

//update

app.put("/issue", (req, res) => {

})

//delete
app.delete("/members", authMiddleware, async(req, res) => {
    const userId = req.userId;
    const organizationID = req.body.organizationID;
    const memberUserUsername = req.body.memberUserUsername;

    const organization = await organizationModel.findById(organizationID);

    if (!organization) {
        return res.status(404).json({
            message: "Organization not found"
        });
    }

    if (organization.admin.toString() !== userId) {
        return res.status(403).json({
            message: "You are not the admin of this organization"
        });
    }

    const memberUser = await userModel.findOne({
        username: memberUserUsername
    });

    if (!memberUser) {
        return res.status(404).json({
            message: "No user with this username exists in our DB"
        });
    }

    organization.members = organization.members.filter(
        id => id.toString() !== memberUser._id.toString()
    );

    await organization.save();

    res.json({
        message: "Member removed successfully!"
    });
});

app.listen(5000);