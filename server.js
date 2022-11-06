 const express = require("express");
 const mongoose = require('mongoose');
 const Registeruser = require("./model");
 const jwt = require("jsonwebtoken");
 const app = express();
 const middleware = require("./middleware");
 const Msgmodel = require("./Msgmodel");
 const cors = require("cors");

 require('dotenv').config();


 mongoose.connect("mongodb+srv://binarybrains:binarybrains123@cluster0.3osfkny.mongodb.net/?retryWrites=true&w=majority")
 .then(() => console.log('DB Connected!'))
 .catch((err) =>{ console.log(err);})

 app.use(express.json());
 app.use(cors({origin:"*"}));


 app.post('/register',async (req,res)=>{
   try {
    const {email,username,password,confirmpassword} = req.body;
     let exist = await Registeruser.findOne({email});

        if(exist){
            return res.status(400).send("User already exist")
        }
        if(password !== confirmpassword){
            return res.send(400).send("Passwords are not matching");
        }

        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })

        await newUser.save();
        res.status(200).send("Registered successfully");

   } catch(err) {
        console.log(err);
        return res.status(500).send("Internal server error")
   }
});

app.post("/login", async(req,res) =>{
    try {
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist){
            return res.status(400).send("User not found");
        }
        if(exist.password !== password){
            return res.status(400).send("Invalid credentials");
        }

        let payload = {
            user: {
                id: exist.id
            }
        }

        jwt.sign(payload,'jwtSecret',{expiresIn: 3600000},(err,token) =>{
            if(err) throw err;
           return res.status(200).json({token});
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
})


app.get("/myprofile",middleware, async(req,res) =>{
    try {
        let exist = await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send("User not found")
        }
        res.json(exist);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }
});

app.post('/addmsg',middleware,async(req,res) =>{
    try {
        const {text} = req.body;
        const exist = await Registeruser.findById(req.user.id);
        let newmsg = new Msgmodel({
            user : req.user.id,
            username : exist.username,
            text
         })
         await newmsg.save();
         let allmsg = await Msgmodel.find();
         return res.json(allmsg)

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }
})

app.get('/getmsg',middleware,async(req,res) =>{

    try {
        let allmsg = await Msgmodel.find();
        return res.json(allmsg)
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }    

})


app.listen(5000,() =>{
    console.log("Server running on 5000");
})
