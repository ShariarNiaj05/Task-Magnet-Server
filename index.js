require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://task-magnet-pro.web.app',
    'https://task-magnet-pro.firebaseapp.com'

  ],

}))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiowubl.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const taskCollection = client.db('taskMagnetDB').collection('task')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    app.put('/tasks', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })


    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id
      console.log('Received ID:', id);
      const query = { _id: new ObjectId(id) }
      const body = req.body;

      console.log( query, body);
      const updateTask = {
        $set: {
          ...body
        }
      }
      const option = { upsert: true }
      const result = await taskCollection.updateOne(query, updateTask, option)
      // console.log(result);
      res.send(result)
    })


    app.patch('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      console.log('checking body', id);

      // const newStatus = req.body.taskStatus;

     /*  const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { taskStatus: newStatus } }
      ); */

      //  res.send(result)
    })


    app.patch('/tasks/changeStatus/:id', async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body.taskStatus;
      console.log('checking body', newStatus);
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { taskStatus: newStatus } }
      );
       res.send(result)
    })

    app.post('/tasks/updateOrder/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
     /*  const newStatus = req.body.taskStatus;
      console.log('checking body', newStatus);
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { taskStatus: newStatus } }
      );
       res.send(result) */
    })


    app.get('/tasks', async (req, res) => {
      const email = req.query.email;

      const filter = { email }
      console.log('checking email', filter);

      const result = await taskCollection.find(filter).toArray();

      res.send(result)
    })


    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)

    })

    // app.get('/mycart', async (req, res) => {
    //   const result = await cartCollection.find().toArray()
    //   res.send(result)
    // })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Task Magnet server is running')
})

app.listen(port, () => {
  console.log(`Task Magnet server is running on the port: ${port}`);
})