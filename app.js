import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { initializePassport } from './passport.config.js'

const app = express()
const server = app.listen(8080, () => console.log("Server up"))

const connection = mongoose.connect("mongodb://localhost:27017/clase25users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let baseSession = session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/clase25sessions'}),
    secret: 'PruebasCoder',
    resave: false,
    saveUninitialized: false
})

app.use(express.json())
app.use(baseSession)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.post('/register', passport.authenticate('register', { failureRedirect: '/failedRegister'}), (req, res) => {
    res.send({message: "signed up"})
})

app.post('/failedRegister', (req, res) => {
    res.send({error: "I cannot register"})
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin'}), (req, res) => {
    res.send({message: "Logged In"})
})

app.post('/failedLogin', (req, res) => {
    res.send({error: "I cannot login"})
})

app.get('/currentSession', (req, res) => {
    // res.send(req.session)
    res.send(req.user)
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { console.log(err) }
        else res.send({message: "Logged out"})
    })
})
