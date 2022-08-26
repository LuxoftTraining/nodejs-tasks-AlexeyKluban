let express = require('express');
let app = express();
let session = require('express-session');
let fs = require('fs');

let path = require('path');
app.use(express.static(path.join(__dirname, './public')));

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
let notes;
(async () => {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    let db = client.db('tutor');
    notes = db.collection('notes');
})()

app.get("/notes", async function(req,res) {
    let cursor = await notes.find(req.query).sort( { order: 1 } );
    let items = await cursor.toArray()
    res.send(items)
});

app.post("/notes", async function(req,res) {
    let note = req.body;
    note.order = Math.floor(Math.random() *1000);
    await notes.insertOne(req.body)
    res.end();
});

let ObjectId = require('mongodb').ObjectId;

app.delete("/notes/:id", async function(req,res) {
    let id = new ObjectId(req.params.id);
    const result = await notes.deleteOne({_id: id});
    if (result.deletedCount === 1) {
        res.send({ok:true});
    } else {
        res.send({ok:false});
    }
});


app.get("/notes/send-to-top/:id", async function(req,res) {
    const id = new ObjectId(req.params.id);
    const cursor = notes.find().sort( { order: 1 } ).limit(1);
    let note = await cursor.toArray();
    let order = --(note[0].order);
    notes.update({_id: id}, { $set:{order:order} });
    res.end();
});


app.listen(3000);
