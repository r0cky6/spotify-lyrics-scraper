// imports - packages
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import https from 'https'
import fs from 'fs'
import dotenv from 'dotenv'

import sanitize from './helpers/mdb-sanitize.js'
import mongoose from 'mongoose'
import connectMongoDBSession from 'connect-mongodb-session'

// imports - models

// imports - routes
import userRoutes from './routes/user.js'
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
app.use('/', userRoutes)
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
