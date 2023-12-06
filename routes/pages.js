const express = require('express')
const router = express.Router();
const { validateToken } = require('../jwt.js');

router.get('/', validateToken, (req, res) => {
    res.render('index');
});
router.get('/signup', (req, res)=>{
    res.render('signup'); 
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/dashboard', validateToken, (req, res)=>{
    res.render('dashboard');
})
router.get('/add', validateToken, (req, res) => {
    res.render('add');
})

module.exports = router;