let mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose")

let userSchema = new mongoose.Schema({
	username: String,
	password: String
	
});

userSchema.plugin(passportLocalMongoose); //detects duplicate users too so won't let you register
module.exports = mongoose.model("User", userSchema);