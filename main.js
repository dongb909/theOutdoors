let express = require("express");
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")

app.get("/", (req, res)=>{
	res.render("landing")
});

app.get("/places", (req, res)=>{
	let places = [
		{name: "Yosemite National Park", image:"https://images.unsplash.com/photo-1518623380242-d992d3c57b37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80"},
		{name: "Zion National Park", image:"https://images.unsplash.com/photo-1533090631-338411005233?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"},
		{name: "Glacier National Park", image:"https://images.unsplash.com/photo-1533496928027-041f8b02dc78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=932&q=80"}
	]
	res.render("places", {places: places}); //places.ejs file, obj of all data we want to pass through
});

app.post("/places", (req, res)=>{
	res.send("you hit the Post route for places")
});

app.get("/places/add", (req, res)=>{
	res.render("add.ejs")
});

app.listen(3000, ()=>{
	console.log("server has started!!")
});