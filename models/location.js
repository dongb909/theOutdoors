let mongoose = require("mongoose");

let locationSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

let Location = mongoose.model("Location", locationSchema);