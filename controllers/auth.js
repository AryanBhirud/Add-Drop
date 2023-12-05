const { getEmail } = require('../db.js');
const { signupUser } = require('../db.js');
const jwt = require('jsonwebtoken');

const { createTokens } = require('../jwt.js')
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const isEmail = await getEmail(email);
    if (isEmail.length > 0) {
        return res.render('signup', {
            message: "That email is already in use."
        });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const user = await signupUser(email, hashedPassword);
    if (user) {
        return res.render('signup', {
            message: 'User Registered'
        })
    }

}
exports.login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const [user] = await getEmail(email);
    console.log(user?.student_id)
    if (!user) {
        return res.status(404).render('signup', {
            message: "User not found"
        })
    }
    const user_password = user?.password;
    bcrypt
    .compare(password, user_password)
    .then((match) => {
        if (!match) {

            res
            .status(404)
            .redirect('/login?message=Incorrect%20Password');

        } else {
            const accessToken = createTokens(user)
            res.cookie('email', user.email, {
                maxAge: 60 * 60 * 24 * 30 * 1000
            });
            res.cookie('student_id', user.student_id, {
                maxAge: 60 * 60 * 24 * 30 * 1000
            });
            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 30 * 1000
            });

            res.redirect('/')
        }
    })
}

exports.logout = async (req, res) => {
    res.clearCookie("access-token");
    res.redirect('/login')
}