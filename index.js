require('dotenv').config()

const port = process.env.API_PORT || 5500 
const mongodbInit = require('./server-mongodb')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())


// Routes/Controllers
app.use('/api/products', require('./controllers/productsController'))
app.use('/api/users', require('./controllers/usersController'))





// Init api 
mongodbInit()
app.listen(port, () => console.log(`WebApi is running on http://localhost:${port}`))


