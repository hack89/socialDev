const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User')

//@route GET api/auth
//@desc Test route
//@access Public
router.get('/', auth, async(req, res) => {
    try {
        //since it is a protective route and we use the token which has the ID and in our middleware
        //we set req.user to the user in the token, we can simply pass in req.user we can access it from 
        //anywhere in a protective route -> req.user.id 
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});


//@route POST api/auth
//@desc Authenticate user and get token
//@access Public
router.post('/', [
    check('email', 'Please enter a valid mail').isEmail(),
    check('password', 'Password is required').exists()
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        //if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
        }




        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'), { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
            })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
});


module.exports = router;