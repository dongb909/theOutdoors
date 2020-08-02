let mongoose = require("mongoose");

let locationSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId, //a mongoose thing
			ref: "Comment" //referencing ids from the Comment docs
		}
	]
});

let Location = mongoose.model("Location", locationSchema);