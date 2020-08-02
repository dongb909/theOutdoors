let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
	text: String,
	author: String
})

module.exports = mongoose.model("Comment", commentSchema);
//exporting as "Comment" variable is the name of the model, comment Schema returns an obj with the structure as commentSchema but created by .model method.