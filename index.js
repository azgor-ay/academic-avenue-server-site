const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@academic-avenue-cluster.ujqv3q7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const collegesCollection = client
      .db("academic-avenue-DB")
      .collection("colleges");

    const feedbackCollection = client
      .db("academic-avenue-DB")
      .collection("feedbacks");

    const researchesCollection = client
      .db("academic-avenue-DB")
      .collection("researches");

    const usersCollection = client.db("academic-avenue-DB").collection("users");

    const myCollegesCollection = client
      .db("academic-avenue-DB")
      .collection("myColleges");

    // Apis
    app.get("/colleges", async (req, res) => {
      let query = {};
      if (req.query.id) {
        query = { _id: new ObjectId(req.query.id) };
      }
      const result = await collegesCollection.find(query).toArray();
      res.send(result);
    });
    
    app.get("/colleges", async (req, res) => {
      let query = {};
      if (req.query.id) {
        query = { _id: new ObjectId(req.query.id) };
      }
      const result = await collegesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/feedbacks", async (req, res) => {
      const result = await feedbackCollection.find().toArray();
      res.send(result);
    });

    app.get("/researches", async (req, res) => {
      const result = await researchesCollection.find().toArray();
      res.send(result);
    });

    app.post("/myColleges", async (req, res) => {
      const selectedOne = req.body;
      const result = await myCollegesCollection.insertOne(selectedOne);
      res.send(result);
    });

    app.get("/myColleges", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const result = await myCollegesCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/selectedcolleges/:id", verifyJWT, verifyStudent, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await selectedcollegesCollection.findOne(query);
    //   res.send(result);
    // });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "existing user" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = { email: { $eq: req.query.email } };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Academic Avenue - Endgame Task");
});

app.listen(port);
