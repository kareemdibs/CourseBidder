//------------modules used-------------//

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const cors = require('cors');
//------------modules used-------------//

const app = express();
app.use(cors());
app.use(helmet());
// allow the app to use cookieparser
app.use(cookieparser());
// allow the express server to process POST request rendered by the ejs files 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//-------------------mongodb-----------------//
mongoose.connect("mongodb+srv://coursebidder:Generativeai1@coursebidder.gb7lsik.mongodb.net/CourseBidder", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    name: {type: String, required: true}, 
    //PFP as well
})
const User = new mongoose.model("User", userSchema);

const listingSchema = new mongoose.Schema({
  email: { type: String, required: true},
  id: { type: String, required: true },
  price: {type: Number, requred: true}, 
  sold: {type: Boolean, default: false},

})
const Listing = new mongoose.model("Listing", listingSchema);

//-------------------mongodb-----------------//

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    // check if user is logged in, by checking cookie
    let username = req.cookies.username;
    if(username){
        return res.render("mainpage", {
            username,
        });
    }else{
        res.redirect("/login");
    }

});
app.get("/mainpage", (req, res) => {
    // check if user is logged in, by checking cookie
    let username = req.cookies.username;
    if(username){
        return res.render("mainpage", {
            username,
        });
    }else{
        res.redirect("/login");
    }

});



app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  const user = await User.findOne({ email: username }).lean()
  if (!user) {
    res.status(404).send({message: "No  User Found"})
  } else {

    var validatePassword = await bcrypt.compare(password, user.pass)

    if (!validatePassword) {
      res.status(400).send({message: "Invalid Password"})
    } else {

    //  console.log("Successful Login   " + username);
      res.cookie("username", username, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });

   
    res.status(201).json({ message: 'User logged in successfully' });

    }
  }
});


app.post("/register", async (req,res)=>{
  try {
    const { username, password, fullname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Use User.create to create a new user and save it to the database
    const newUser = await User.create({
      email: username,
      pass: hashedPassword,
      name: fullname,
    });

 //   console.log('User created:', newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle error response
    res.status(500).json({ error: 'Internal Server Error, Could be a Duplicate Email' });
  }
    
})

app.post("/logout", (req, res) => {
    // clear all cookies
    Object.keys(req.cookies).forEach(cookieName => {
      res.clearCookie(cookieName);
    });
  
    res.status(201).json({ message: 'Listing created successfully' });
   
});


app.post("/makeListing", async (req, res) => {
  // Extract data from the request body
  try {
    const { classid, prc } = req.body;
    username = req.cookies.username;
    const privateEmail = await bcrypt.hash(username, 10);
    // Use User.create to create a new user and save it to the database
    const newListing = await Listing.create({
      email: privateEmail,
      price: prc, 
      id: classid,
    });

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 


})


















const PORT = '3001' //Find an open port to run backend on
app.listen(PORT, () => console.log(`server started`));

async function registerUser() {
  try {
    const apiUrl = 'http://localhost:3000/register'; // Update with your actual API endpoint
    const userData = {
      username: "vansh@gmail.com",
      password: "harshakancharla", // Replace with the desired password
      fullname: "Vansh Vansh"
    };

    const response = await axios.post(apiUrl, userData);

    console.log(response.data.message);


  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
  }
}

//registerUser();



//Atij Password is bruinVANSH ved password is coorsLight1 anish password is flumeBar


/*
TODO:

Create a way that users are SECURELY attached to listings, when a listing status is marked as 1, share the EMAIL of the user


*/