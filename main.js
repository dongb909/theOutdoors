let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

mongoose.connect("mongodb://localhost/the_outdoors", {useNewUrlParser: true, useUnifiedTopology: true}) //27017 port
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")

let locationSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

let Location = mongoose.model("Location", locationSchema);
//"Yosemite National Park", "imag
// e" : "https://images.unsplash.com/photo-1518623380242-d992d3c57b37?ixlib=rb-1.2.1&ixid=e
// yJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80", "__v" : 0 }
// { "_id" : ObjectId("5f238c606918652c92a6102f"), "name" : "Zion ", "image" : "https://ima
// ges.unsplash.com/photo-1533090631-338411005233?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&
// auto=format&fit=crop&w=600&q=60", "__v" : 0 }
// { "_id" : ObjectId("5f238ca66918652c92a61031"), "name" : "Yoho", "image" : "https://imag
// es.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd
// 9&auto=format&fit=crop&w=1654&q=80", "__v" : 0 }
// { "_id" : ObjectId("5f238cbd6918652c92a61032"), "name" : "Glacier", "image" : "https://i
// mages.unsplash.com/photo-1533496928027-041f8b02dc78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEy
// MDd9&auto=format&fit=crop&w=932&q=80", "__v" : 0 }

// Location.create({
// 	name: "Yosemite",
// 	image: "https://images.unsplash.com/photo-1518623380242-d992d3c57b37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80",
// 	description: "It's located in California’s Sierra Nevada mountains. Known for its giant, ancient sequoia trees."
// }, (err, location)=>{
// 	if (err) console.log(err);
// 	else console.log(location);
// })

app.get("/", (req, res)=>{
	res.render("landing")
});

app.get("/locations", (req, res)=>{
	Location.find({}, (err, allLocations)=>{
		if (err){
			console.log(err)
		} else {
			res.render("index", {locations: allLocations}); //sending data from db to index.ejs file
		}
	})
});

app.post("/locations", (req, res)=>{
	let name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		newLocation = {name, image, description}
	Location.create(newLocation, (err, newCreation)=>{
		if(err){
			console.log(err)
		} else {
			res.redirect("/locations")
		}
	})
});

app.get("/locations/add", (req, res)=>{
	res.render("add")
});

app.get("/locations/:id", (req, res)=>{
	Location.findById(req.params.id, (err, foundLocation)=>{
		if (err) console.log(err);
		else res.render("show", {location: foundLocation});
	})
})

app.listen(3000, ()=>{
	console.log("server has started!!")
});