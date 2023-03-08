const router = require("express").Router() ;
const bcrypt = require("bcrypt") ;
const User = require("../models/User") ;

// using post to insert the data

router.post("/register" , async (req,res)=>{

    const {name,email,password} = req.body ;

    //Checking all the missing fields
    if(!name || !email || !password){
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

        const doesUserAlreadyExist = await User.findOne({email});
        if(doesUserAlreadyExist){
            return res.status(400).json({error:`User is already exist with this email!`})
        }
        const hashedPassword = await bcrypt.hash(password , 12)
        const newUser = new User({name , email , password:hashedPassword});

        const result = await newUser.save() ;

        return res.status(200).json({result})
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message})
    }
});

// using get to read the data

router.get("/register/:id" , async(req , res)=> {
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        // console.log(user);
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
});

// using put to update the data

router.patch("/register/:id" , async(req , res)=> {
    try{
        const _id = req.params.id
        const user = await User.findByIdAndUpdate(_id , req.body,{hourlyrate:32})
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

router.delete("/register/:id" , async(req , res) => {

    try{
        const _id = req.params.id 
        const user = await User.findByIdAndDelete(_id)
        
        if(!_id){
           return res.status(404).send()
        }
        else{
           return res.status(200).send(`User ${user} is deleted successfully`)
        }
    }
    catch(err){
        res.status(500).send(err)
    }

});

module.exports = router ;