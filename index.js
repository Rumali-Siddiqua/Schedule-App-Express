// Express setup
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// Encryption: SHA256
const crypto = require('crypto');

// DB setup
const db = require('./database')

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static assets
app.use(express.static('public'))

// Template: EJS
app.set('view engine', 'ejs')

// Routes
// Home
app.get('/', (req, res) => {
    res.render('pages/index')
})

// Returns all users
app.get('/users', (req, res) => {
    db.any('SELECT firstname, lastname, email FROM users;')
    .then((data) => {
        res.render('pages/list_users', {
            users: data
        })
    })
    .catch((err) => {
        res.send(err)  
    })
})


// Displays the page to add a new user
app.get('/users/new', (req, res) => {        
    res.render('pages/new_user')
})

// Adds an user 
 app.post('/users/new', (req, res) => {    
    req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64')
    db.any('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);', 
        [req.body.firstname, req.body.lastname, req.body.email, req.body.password])
    .then(() => {
        res.redirect('/users')
    })
    .catch((err) => {
        res.send(err)  
    })    
})

// Returns 1 user based on user_id 
app.get('/users/:user_id', (req, res) => {
    res.render('pages/list_users', {
        users: [data.users[req.params.user_id]]
    })    
  })

// Returns all schedules
app.get('/schedules', (req, res) => {
    db.any('SELECT firstname, lastname, day, to_char(start_at,\'fmHH12:MI AM\') as start_at, \
        to_char(end_at,\'fmHH12:MI AM\') as end_at \
        FROM users, schedules where users.id = user_id order by firstname, day;')
    .then((data) => {
        res.render('pages/list_schedules', {
            schedules: data
        })
    })
    .catch((err) => {
        res.send(err)  
    })    
})

// Returns the schedules of a specific user
app.get('/users/:user_id/schedules', (req, res) => {    
    let list = []
    for (let i=0; i<data.schedules.length; i++) {
        if (data.schedules[i].user_id == req.params.user_id) {
            list.push(data.schedules[i])
        }
    }
    res.render('pages/list_schedules', {
        schedules: list
    })
  })

// Displays the page to add a new schedule
app.get('/schedules/new', (req, res) => {     
    db.any('SELECT id, firstname, lastname FROM users order by firstname;')
    .then((data) => {   
        res.render('pages/new_schedule', {
            users: data
        })
    })
})

// Adds a new schedule 
 app.post('/schedules/new', (req, res) => {    
    req.body.user_id = Number(req.body.user_id)
    req.body.day = Number(req.body.day)
    db.any('INSERT INTO schedules (user_id, day, start_at, end_at) VALUES ($1, $2, $3, $4);', 
        [req.body.user_id, req.body.day, req.body.start_at, req.body.end_at])
    .then(() => {
        res.redirect('/schedules')
    })
    .catch((err) => {
        res.send(err)  
    })    
})

app.listen(PORT, () => {
    console.log(`Project 3C listening at http://localhost:${PORT}`)
})
