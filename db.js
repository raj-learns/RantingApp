import mongoose from 'mongoose';
// const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://2022ceb1025_db_user:Raghukul%402004@cluster0.tfn7sfq.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
await mongoose.connect(uri);
//await mongoose.connect("mongodb+srv://2022ceb1025_db_user:Raghukul%402004@cluster0.tfn7sfq.mongodb.net/my_database?retryWrites=true&w=majority");
console.log("Connected to MongoDB using Mongoose");

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);
