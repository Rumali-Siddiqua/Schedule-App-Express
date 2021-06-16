// Express setup
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// access to data.js file
const data = require('./data.js')
app.use(express.static('public'))

// Template: EJS
app.set('view engine', 'ejs')

//routes
app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/users', (req, res) => {
    res.render('pages/list_users', {
        users: data.users
    })
})

// add a new user and display the page
app.get('/users/new', (req, res) => {        
    res.render('pages/new_user')
})

// Adds an user 
app.post('/users/new', (req, res) => {    
    req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64')
    data.users.push(req.body)    
    res.redirect('/users')
    
})

// Returns 1 user based on user_id 
app.get('/users/:user_id', (req, res) => {
    res.render('pages/list_users', {
        users: [data.users[req.params.user_id]]
    })    
  })

// Returns all schedules
app.get('/schedules', (req, res) => {
    res.render('pages/list_schedules', {
        users: data.users,
        schedules: data.schedules
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
    res.render('pages/new_schedule', {
        users: data.users
    })
})

// Adds a new schedule 
 app.post('/schedules/new', (req, res) => { 
    req.body.user_id = Number(req.body.user_id)
    req.body.day = Number(req.body.day)

    var d = new Date()    
    d.setHours(req.body.start_at.substring(0, 2), req.body.start_at.substring(3, 5));
    req.body.start_at = formatAMPM(d)
        
    d.setHours(req.body.end_at.substring(0, 2), req.body.end_at.substring(3, 5));
    req.body.end_at = formatAMPM(d)

    data.schedules.push(req.body) 
    res.redirect('/schedules')
    
})

app.listen(PORT, () => {
    console.log(`Project 3B listening at http://localhost:${PORT}`)
})

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return strTime;
}