app.get("/", (req, res)=>{
	res.render("landing")
});

/*========================
	AUTH ROUTES
==========================*/
app.get("/register", (req, res)=>{
	res.render("register")
});

app.post("/register", (req,res)=>{
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if (err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/locations")
		})
	})
})

/*========================
	LOGIN ROUTES
==========================*/
app.get("/login", (req, res)=>{
	res.render("login")
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/locations",
	failureRedirect: "/login"
}), (err,res)=>{});
//authenticate compares body with db on its own. the cb isn't needed but just there so you remember it's a middleware. Is the same authenicate as with register, but for register, you're making the user first and then signing them in

/*========================
	LOGIN ROUTES
==========================*/
app.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/locations")
})

/*========================
	MIDDLEWARE
==========================*/
//only allow users to do something if they're logged something
function isLoggedIn(req, res, next){ //express knows what you place in these params
	if(req.isAuthenticated()){ //if passport method returns true
		return next();
	}
	res.redirect("/login");
}
