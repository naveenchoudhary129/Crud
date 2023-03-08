const router = require("express").Router() ;
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken");
const User = require("../models/User") ;

// using post to insert the data

router.post("/login" , async(req,res)=>{

    const {email,password} = req.body ;

    //Checking all the missing fields
    if(!email || !password){
        return res.status(400).json({error:`Please enter all the required field!`})
    }

    //Checking email Validation
    const emailReg = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/ ;

    if(!emailReg.test(email)){
        return res.status(400).json({error:`Please enter a valid email!`})
    }

    //Checking password length
    if(password.length < 6){
        return res.status(400).json({error:`Password must be atleast 6 characters long!`})
    }

    try {
        const doesUserExists = await User.findOne({email})

        if(!doesUserExists){
            return res.status(400).json({error:"Invalid Email"})
        }

        const doesPasswordMatch = await bcrypt.compare(password , doesUserExists.password);

        if(!doesPasswordMatch){
            return res.status(400).json({error:"Invalid Password"})
        }

        // Genrate a token

        const payload = {_id:doesUserExists._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET , {expiresIn:"1h"})

        return res.status(200).json({token})
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message})
    }
});

// using get to read the data

router.get("/login/:id" , async(req , res)=> {
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        // console.log(emp);
        if(!user){
            return res.status(404).send()
        }
        else{
            return res.send(`User ${user} get successfully!`)
        }
    }
    catch(err){
        res.status(500).send(err)
    }
})

// using put to update the data

router.patch("/login/:id" , async(req , res)=> {
    try{
        const _id = req.params.id
        const user = await User.findByIdAndUpdate(_id , req.body , {hourlyrate:32})
        // console.log(user);
        if(!user){
            return res.status(404).send()
        }
        else{
            return res.send(`User ${user} is updated successfully!`)
        }
    }
    catch(err){
        res.status(500).send(err)
    }
});

// using delete to Delete the data

router.delete("/login/:id" , async(req , res) => {

    try{
        const _id = req.params.id 
        const user = await User.findByIdAndDelete(_id)
        
        if(!_id){
           return res.status(404).send()
        }
        else{
           return res.status(200).send(`User ${user} is deleted successfully!`)
        }
    }
    catch(err){
        res.status(500).send(err)
    }

});

module.exports = router ;