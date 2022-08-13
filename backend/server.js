const express = require("express")
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const app = express()
const PORT = "5000"
const mongoose = require('mongoose')
require('dotenv').config()

// db connection
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log('DBと接続成功')
  }).catch((err) => {
    console.error(err)
  })

// middleware
app.use(express.json()) // json
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)


app.listen(PORT, () => {
  console.log("5000 is listened")
})

app.get('/', (req, res) => {
  res.send('hello world')
})