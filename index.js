const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// const _ = require('lodash');
const passport = require('passport');
const passportJWT = require('passport-jwt');

var sess;

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '123gido%khong^nen*biet';
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
// Sử dụng strategy
passport.use(strategy);
const app = express();

app.use(session({ secret: 'ssshhhhh' }));

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded()) //đẻ sử dụng body
    // initialize passport with express
app.use(passport.initialize());
// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
const Sequelize = require('sequelize');
// initialze an instance of Sequelize
const sequelize = new Sequelize({
    database: 'mysql_node2',
    username: 'root',
    password: '',
    dialect: 'mysql',
});
// check the databse connection
sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
// create user model
const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
});
// create table with user model
User.sync()
    .then(() => console.log('User table created successfully'))
    .catch(err => console.log('oooh, did you enter wrong database credentials?'));
// create some helper functions to work on the database
const createUser = async({ name, password }) => {
    return await User.create({ name, password });
};
const getAllUsers = async() => {
    return await User.findAll();
};
const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};
// set some basic routes
app.get('/', function(req, res) {
    sess = req.session;
    if (sess.email) {
        return res.redirect('/chat');
    }
    res.render('index');
});
app.get('/register', function(req, res) {

    res.render('register');
});
app.get('/chat', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        return res.redirect('/');
    }
    res.render('chat');
});
// get all users
app.get('/users', function(req, res) {
    getAllUsers().then(user => res.json(user));
});
// register route
app.post('/register', function(req, res, next) {
    const { name, password } = req.body;
    createUser({ name, password }).then(user =>
        // res.json({ user, msg: 'account created successfully' })

        res.redirect('/')
    );
});

//login route
app.post('/login', async function(req, res, next) {
    const { name, password } = req.body;
    if (name && password) {
        var user = await getUser({ name: name });
        if (!user) {
            res.status(401).json({ message: 'No such user found' });
        }
        if (user.password === password) {
            sess = req.session;
            sess.email = name;

            // from now on we'll identify the user by the id and the id is the
            // only personalized value that goes into our token
            // let payload = { id: user.id };
            // let token = jwt.sign(payload, jwtOptions.secretOrKey);
            // res.send(JSON.stringify());
            console.log('login');
            res.redirect('/chat');

            // res.json({ msg: 'ok', token: token });

        } else {
            res.status(401).json({ msg: 'Password is incorrect' });
        }
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        console.log('logout');
        res.redirect('/');
    });
});

// protected route
app.get('/protected', passport.authenticate('jwt', { session: true, }), function(req, res) {
    res.json('Success! You can now see this without a token.');

});
// start app
app.listen(3000, function() {
    console.log('Express is running on port 3000');
});