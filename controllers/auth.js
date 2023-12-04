const { getEmail } = require('../db.js');
const { signupUser } = require('../db.js');
const jwt = require('jsonwebtoken');

const { createTokens } = require('../jwt.js')
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const isEmail = await getEmail(email);
    if(isEmail.length>0){
        return res.render('signup', {
            message : "That email is already in use."
        });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const user = await signupUser(email, hashedPassword);
    if(user){
        return res.render('signup', {
            message: 'User Registered'
        })
    }
   
}
exports.login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const [user] = await getEmail(email);
    console.log(user.student_id)
    if(!user) {
        res.status(400).json({error: "Email not registered"})
    }
    const user_password = user.password;
    bcrypt.compare(password, user_password).then((match) => {
        if(!match){
            res.status(400).json({ error: "Incorrect Password"})
        } else {
            const accessToken = createTokens(user)
            res.cookie("access-token", accessToken, {
                maxAge: 60*60*24*30*1000
            });
            res.json("LOGGED IN")
        }
    })

    
}