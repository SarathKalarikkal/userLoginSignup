const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv').config()
const hbs = require('hbs')
const collection  = require('./mongoConnect')
const bcrypt = require('bcrypt')


const PORT = process.env.PORT || 3001

const templatePath = path.join(__dirname, "../templates")

app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(express.urlencoded({extended : false}))

app.use(express.static('public'));
// app.use(express.static(__dirname + 'public'));

app.get('/', (req, res)=>{
    res.render('signup')
})
app.get('/login', (req, res)=>{
  res.render('login')
})
app.get('/signup', (req, res)=>{
    res.render('signup')
})


app.post("/signup", async(req, res)=>{


  const user = await collection.findOne({ email: req.body.email });
      
  if (user) {
      res.render("already");
      return;

  }else{

    const hashedPassword = await bcrypt.hash(req.body.password,10)

    const data = {
     name : req.body.name,
     email : req.body.email,
     password : hashedPassword
    }
 
    await collection.insertMany([data])
    
    res.render("home")
  }
   
})

app.post("/login", async(req, res) => {
  try {
      const user = await collection.findOne({ email: req.body.email });
      
      if (!user) {
          res.render("wrong");
          return;
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      
      if (isPasswordValid) {

          res.render("success");
      } else {
         
        res.render("wrong");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
  }
});



app.listen(PORT,()=>{
    console.log("The server is connected");
})