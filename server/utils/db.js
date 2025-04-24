import { MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017";
const option = {useUnifiedTopology: true,};

export const client = new MongoClient(connectionString, option);

export const db = client.db("practice-mongo");
