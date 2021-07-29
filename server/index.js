// imports - packages
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import https from 'https'
import fs from 'fs'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import sanitize from './helpers/mdb-sanitize.js'
import mongoose from 'mongoose'
import connectMongoDBSession from 'connect-mongodb-session'

// imports - models
import user from './models/user.js'

dotenv.config()

// global variables
const PORT = process.env.PORT || 5000
const MAX_AGE = 14 * 24 * 3600 * 1000
const app = new express()
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9jhae.mongodb.net/lyrics-scraper?retryWrites=true&w=majority`
const DB_OPTIONS = { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true 
}
const MDBsession = connectMongoDBSession(session)
const store = new MDBsession({
    uri: DB_URI,
    collection: 'sessions'
})

// middleware
app.disable('etag');
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store
}))
// https server configuration
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
const server = https.createServer(serverConfig, app) 

// database connection
mongoose
    .connect(DB_URI, DB_OPTIONS)
    .then(()=> server.listen( PORT, ()=> console.log(`listening on port ${PORT}...`)))
    .catch((err)=> console.error(err) )

// production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public/'))
    app.get( '/.*/', (req, res) => res.sendFile(__dirname + '/public/index.html') )
}

// routes
app.get('/favicon.ico', (req, res) => res.status(204).end());
// signup a user
app.post('/api/signup', async (req, res) => {
    let { email, username, password, remember } = req.body.form    
    if (email && username && password) {
        email = sanitize(email.trim())
        username = sanitize(username.trim())
        password = bcrypt.hashSync(sanitize(password.trim()), 10)
    }

    if (!email || !username || !password) return res.status(400).json({msg: 'bad credentials!'})
    if (!!( await user.findOne({ email }) )) return res.status(400).json({msg: 'email is taken'})
    await user.create(  
        {email, username, password}, 
        (err, doc) => { 
            if (err) return res.status(400).json({msg: err})
            req.session.user_id = doc._id
            if (remember) req.session.cookie.maxAge = MAX_AGE
            return res.status(201).json({msg: `welcome`})
        }
    )
})

// login the user
app.post('/api/login', async (req, res) => {
    let { email, password, remember } = req.body.form
    if (email && password && remember) {
        email = sanitize(email.trim())
        password = sanitize(password.trim())
        remember = sanitize(remember)
    }

    const foundUser = await user.findOne({ email })
    if (foundUser) {
        if (bcrypt.compareSync(password, foundUser.password)) {
            req.session.user_id = foundUser._id
            if (!!remember) req.session.cookie.maxAge = MAX_AGE
            return res.status(200).json({msg: `You've logged in`})
        }else return res.status(400).json({msg: `Wrong password`})
    }
    return res.status(404).json({msg: `Wrong email`})
})

// logout the user
app.post('/api/logout', async (req, res) => {
    req.session.user_id = null
    req.session.destroy()
    await res.clearCookie('connect.sid')
    return res.status(200).json({msg: `You've logged out`})
})

// get all public info about a user
app.get('/api/u/:id', async (req,res) => {
    if (req.params.id) return res.status(200).json(await user.findOne({'_id': req.params['id'] }, {password: 0}).lean())
    if (req.session.user_id) return res.status(200).json(await user.findOne({'_id': req.session.user_id}, {password: 0}).lean())
    return res.status(400).json({msg: `You aren't authenticated`})
})