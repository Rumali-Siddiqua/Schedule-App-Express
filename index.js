const express = require('express')
const app = express()
// const bcrypt = require('bcrypt');
// const saltRounds = 10

const PORT = process.env.PORT || 3000

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//access to data.js file
const data = require ('./data')


//routes
app.get('/', (req, res) => {
  res.send('Welcome to our schedule website');
  console.log(data)
});
app.get('/users', (req, res) => {
  res.send(data.users);
});
app.get('/schedules', (req, res) => {
  res.send(data.schedules);
});

// Returns 1 user based on user_id 
app.get('/users/:user_id', (req, res) => {  
  res.send(data.users[req.params.user_id]);
})

// Returns the schedules of a specific user
app.get('/users/:user_id/schedules', (req, res) => {       
  let response = ""
  for (let i=0; i<data.schedules.length; i++) {
      if (data.schedules[i].user_id == req.params.user_id) {
          response += JSON.stringify(data.schedules[i])+"<br>"
      }
  }
  res.send(response);
})

// add an user 
app.post('/users', (req, res) => {
  req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64')
  data.users.push(req.body)    
  res.send(req.body)
})

//schedules
  app.post('/schedules', (req, res) => {
    data.schedules.push(req.body)
    res.send(req.body)
    console.log(req.body)

  })


//Create parameterized routes

// app.get('/users/:id/schedules', (req, res) => {
//      const id = Number(req.params.id)
      
//      let schedules= []

//      for(let i = 0; i <data.schedules.length; i++){
//     let currentSchedule = data.schedules[i]
//     if(currentSchedule.user_id === id){
//         schedules.push(currentSchedule)
//     }
//   }
//    res.send(schedules)
//     })
 //Create routes to update data
//   app.post('/users', (req, res) => {
    
//     const plainTextPassword = req.body.password
//     console.log(plainTextPassword)
//     bcrypt.hash(plainTextPassword, saltRounds, (err,hash) => {
//     //Store hash  in your password DB.
//     console.log(err)
//     console.log(hash)
//     });

//     res.send('Just Testing')
// })

 


  app.listen(PORT, () => {

    console.log(`App listening at http://localhost:${PORT}`)
})
