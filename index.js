const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const  ObjectId  = require('mongodb').ObjectId;
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zom1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const booksCollection = client.db("BookShop").collection("books");
  const ordersCollection = client.db("BookShop").collection("orders");

  app.get('/events', (req, res) => {
    booksCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.get('/product/:id', (req, res) => {
    booksCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents);
      console.log(err);
    })
  })


  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    booksCollection.insertOne(newEvent)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    booksCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('heroku login', (req, res) => {
    ordersCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
