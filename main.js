let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

mongoose.connect("mongodb://localhost/the_outdoors", {useNewUrlParser: true, useUnifiedTopology: true})
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")

let locationSchema = new mongoose.Schema({
	name: String,
	image: String
});

let Location = mongoose.model("Location", locationSchema);

// Location.create({name: "Yosemite National Park", image:"https://images.unsplash.com/photo-1518623380242-d992d3c57b37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80"}, (err, location)=>{
// 	if(err) console.log(err);
// 	else console.log("NEWLY CREATED LOCATION"); console.log(location);
// })

// let places = [
// 		{name: "Yosemite National Park", image:"https://images.unsplash.com/photo-1518623380242-d992d3c57b37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80"},
// 		{name: "Zion National Park", image:"https://images.unsplash.com/photo-1533090631-338411005233?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"},
// 		{name: "Glacier National Park", image:"https://images.unsplash.com/photo-1533496928027-041f8b02dc78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=932&q=80"},
// 		{name: "Yoho National Park", image:"https://images.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1654&q=80"}
// 	]



app.get("/", (req, res)=>{
	res.render("landing")
});

app.get("/places", (req, res)=>{
	Location.find({}, (err, allLocations)=>{
		if (err){
			console.log(err)
		} else {
			res.render("places", {places: allLocations}); //send all locations you just got from db and send them through to the places.ejs file
		}
	})
	// res.render("places", {places: places}); //places.ejs file, obj of all data we want to pass through
});

app.post("/places", (req, res)=>{
	let name = req.body.name;
	let image = req.body.image;
	let newLocation = {name, image}
	// places.push(newLocation)
	//Create new location and save to db
	Location.create(newLocation, (err, newCreation)=>{
		if(err){
			console.log(err)
		} else {
			res.redirect("/places")
		}
	})
});

app.get("/places/add", (req, res)=>{
	res.render("add.ejs")
});

app.listen(3000, ()=>{
	console.log("server has started!!")
});