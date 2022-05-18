const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iepyq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        const database = client.db("tasktodo");
        const taskCollection = database.collection("tasks");

        app.post("/tasks", async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.get("/tasks/:email", async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        });

        app.put("/tasks", async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "complete"
                }
            };
            const result = await taskCollection.updateOne(query, updateDoc);
            res.send(result);
        })
    }
    finally {

    }

}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("server running");
});

app.listen(port, () => {
    console.log("listening to ", port);
})