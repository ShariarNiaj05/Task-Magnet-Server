const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;



app.use(express.json())



app.get('/', (req, res) => {
    res.send('Task Magnet server is running')
  })

app.listen(port, () => {
    console.log(`Task Magnet server is running on the port: ${port}`);
  })