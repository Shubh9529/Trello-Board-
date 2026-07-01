const mongoose = require("mongoose");
mongoose.connect("")
const userSchema = mongoose.Schema({
    username: String,
    password: String
})

const organizationSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]
})

const organizationModel = mongoose.model("organizations", organizationSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = {
    organizationModel,
    userModel
}