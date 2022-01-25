require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const pgPool = require('./db')
const pgSession = require('connect-pg-simple')(session);
const router = require('./router')
const app = express();

let sessionOptions = session({
    store: new pgSession({
        pool: pgPool, 
    }),
    
    secret: "asdashdgashjdfg172hahdsj2662", 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        maxAge: 1000 * 60 * 60, 
        httpOnly: true
    }
})
app.use(sessionOptions)

app.use(function(req, res, next) {
    res.locals.restaurante = req.session.restaurante
    next()
})

app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(expressLayouts)

app.use(express.urlencoded({ extended: true }))

app.use('/', router)

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
