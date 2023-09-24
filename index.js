const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

// middle wares
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlsud.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const menuCollection = client.db('spicyRestaurant').collection('menu');
        const reviewCollection = client.db('spicyRestaurant').collection('reviews');
        const cartCollection = client.db('spicyRestaurant').collection('carts');

        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result)
        });

        //cart collection 
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([])
            }
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        });

        app.post('/carts', async (req, res) => {
            const item = req.body;
            const result = await cartCollection.insertOne(item);
            res.send(result)
        })

    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Spicy restaurant is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/**
 * ---------------------
 *  Naming convention 
 * ------------------------
 * users: userCollection
 * app.get('users) 
 * app.get('users/:id) 
 * app.post('users') 
 * app.put('users/:id')
 * app.patch('users/:id')
 */