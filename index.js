require('dotenv').config()
let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash		= require("connect-flash"),
	Location 	= require("./models/location"),
	Comment  	= require("./models/comment"),
	methodOverride = require("method-override"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	User 		= require("./models/user"),
	expressSession = require("express-session"),
	seedDB		= require("./seeds"),
	PW 			= process.env.PW
require('dotenv').config()


// seedDB();
/*========================
	REQUIRING ROUTES
==========================*/
let commentRoutes = require("./routes/comments"),
	locationRoutes = require("./routes/locations"),
	indexRoutes = require("./routes/index")


/*========================
	CONNECTION
==========================*/
mongoose.connect(`mongodb+srv://dongb909:${PW}@theoutdoors.cnl85.mongodb.net/TheOutdoors?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); 
app.use(methodOverride("_method"));
app.use(flash());

/*========================
	PASSPORT CONFIGURATION
==========================*/
app.use(expressSession({
	secret: "Hi my name is Rachel!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next){	//a middleware that runs for EVERY route thus every route and template has access to the variable "currentUser"
	res.locals.currentUser = req.user; //only avail if user is loggedin or else it'll return undefined
	res.locals.flashMessageError = req.flash("flashMessageError");
	res.locals.flashMessageSuccess = req.flash("flashMessageSuccess");
	//currentUser = {_id: req.user.id}
	next();
});

/*========================
	USING ROUTES
==========================*/
app.use(indexRoutes);
app.use("/locations/:id/comments", commentRoutes);
app.use("/locations", locationRoutes); 


app.listen(3000, ()=>{
	console.log("server has started!!")
});