// imports
import express from 'express'
import cors from 'cors'

// global variables
const PORT = process.env.PORT || 5000
const app = new express()

// app initialization
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

// routes

// production
if( process.env.NODE_ENV === 'production' ) {
    app.use(express.static(__dirname + '/public/'))
    app.get( '/.*/', (req, res) => res.sendFile(__dirname + '/public/index.html') )
}

// starting app
app.listen( PORT, ()=> console.log(`listening on port ${PORT}...`) )