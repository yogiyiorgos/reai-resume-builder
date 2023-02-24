const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World'
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`)
})