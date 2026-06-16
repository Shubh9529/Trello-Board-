// username , password | user table
//organization | ORGNIZATIONS Table
//bords || Bords table
// issues | issues table
const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");


let USERS_ID = 1;
let organizations_ID = 1;
let boards_ID = 1;
let issues = 1;

const USERS = [];

const organizations = [];

const BOARDS = [{
    id: 1,
    titile: "Demons website(frontend",
    organizations: 1
}];
const ISSUES = [{
    id: 1,
    titile: "Add dark mode",
    boardId: 1,
    state: "IN_PROGRESS"
}, {
    id: 2,
    title: "Allow admins to create more courses",
    boardID: 1,
    state: "DONE"
}]

const app = express();
app.use(express.json());
// Create endpoint
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username);

    if (userExists) {
        return res.status(411).json({
            message: "User with this username already exists"
        });
    }
    USERS.push({
        username,
        password,
        id: USERS_ID++
    })
    res.json({
        message: "you have signed up successfully"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username && u.password === password);
    if (!userExists) {
        return res.status(403).json({
            message: "incorrect credentials"
        });
    }

    const token = jwt.sign({
            userId: userExists.id
        },
        "demonsgroup12345password"
    );

    res.json({ token });
})


//authenticated Route- Middleware
app.post("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    organizations.push({
        id: organizations_ID++,
        titile: req.body.titile,
        descriptions: req.body.descriptions,
        admin: userId,
        members: []

    })
    res.json({
        message: "Org created",
        id: organizations_ID - 1
    })


})
app.post("/add-member-to-organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationID = Number(req.body.organizationID);
    const memerUserUsername = req.body.memberUserUsername;

    const organization = organizations.find(
        org => org.id == organizationID
    );
    console.log("Logged in userId:", userId);
    console.log("organizationID:", organizationID);
    console.log("organization found:", organization);
    console.log("All organizations:", organizations);

    if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "either org doesnt exist or your are not an admin of this org "
        })
        return
    }
    const memberUser = USERS.find(
        u => u.username.trim() === memerUserUsername.trim()
    );

    if (!memberUser) {
        return res.status(411).json({
            message: "No user with this username exists in our DB"
        });

    }
    organization.members.push(memberUser.id);
    res.json({
        message: "New member added!"
    })

})

app.post("/board", (req, res) => {

})



app.post("/issue", (req, res) => {

})

// Read , this will send request 

app.get("/organization", authMiddleware, (req, res) => {

    const userId = req.userId;
    const organizationId = req.query.organizationId;
    const organization = organizations.find(
        org => org.id == Number(organizationId)


    );
    if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "either org doesnt exist or your are not an admin of this org "


        })
        return
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                if (!user) {
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
})

app.get("/board", (req, res) => {})
app.get("/issue", (req, res) => {

})

app.get("/members", (req, res) => {

})

//update

app.put("/issue", (req, res) => {

})

//delete
app.put("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationID = Number(req.body.organizationID);

    const organization = organizations.find(
        org => org.id === organizationID
    );
    if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "either org doesnt exist or your are not an admin of this org "
        })
        return
    }
    const memberUser = USERS.find(u => u.username === memerUserUsername);
    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our DB"
        })
        return
    }
    organization.members = organization.members.filter(id => id !== memberUser.id);
    res.json({
        message: "Member removed successfully!"
    });
})


app.listen(5000);