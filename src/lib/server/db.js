import { MongoClient } from "mongodb"
import { MONGODB_CONNEXION_STRING } from "$env/static/private"

const client = new MongoClient(MONGODB_CONNEXION_STRING);
await client.connect();

const database = client.db('Shop');

const productsRef = database.collection("products");
const couponsRef = database.collection("coupons");
const ordersRef = database.collection("orders");

export { productsRef, couponsRef, ordersRef }