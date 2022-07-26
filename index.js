// require Express
const express = require('express');
//require cors
const cors = require('cors');
require('dotenv').config();



// require MongoUtil
const mongoUtil = require('./MongoUtil');
const {ObjectId}= require ('mongodb');

//Express app
const app = express();

//Express use Json
app.use(express.json());

// cors 
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

async function run(){

    // connect to mongodb
  const db = await mongoUtil.connect(MONGO_URI, DB_NAME);

    //route
    app.get('/', function (req, res) {

        res.json({

            'message': 'recipes'

        });


    })


    // Task 2: Create a Add Recipe Endpoint
    app.post('/recipes/add',async function(req,res){
        await db.collection('dwad-recipes').insertOne({

            "title": req.body.title,
            "ingredients": req.body.ingredients,
            "prep_time": req.body.prep_time,


        })
        res.json({
            'message':'Recipe Added'
        })

    })

    // Task 3 Create a Get all Recipes Endpoint /recipes
    app.get('/recipes', async function(req,res){

        let criteria ={}

        if (req.query.title){

            criteria.title = {
                '$regex':req.query.title,
                '$options':'i'
            }
        }

        if (req.query.min_prep_time){
            criteria.prep_time = {
                '$gte': parseInt(req.query.min_prep_time)
            }

        }

        const recipes = await db.collection('dwad-recipes').find(criteria,{

            'projection': {
            
                'title': 1,
        
                'prep_time': 1
            }


        }).toArray();
        res.json(recipes);
    })

    // Task 4 Create a Update Recipe Endpoint The URL for the endpoint should be /recipes/<recipeId>
    app.put('/recipes/:recipeId', async function (req, res) {

       
        const recipes = await db.collection('dwad-recipes').findOne({
            '_id': ObjectId(req.params.recipeId)
        })

        const results = await db.collection('dwad-recipes').updateOne({
            '_id': ObjectId(req.params.recipeId)
        }, {
            "$set": {
                'title': req.body.title ? req.body.title : recipes.title,
                'ingredients': req.body.ingredients ? req.body.ingredients : recipes.ingredients,
                'prep_time': req.body.prep_time ? req.body.prep_time : recipes.prep_time
            }
        })

        res.json({
            'message': 'data udpated successfully',
            'results': results
        })

    })

    // Task 5: Create a Delete Recipe Endpoint /recipes/<recipeId>
    app.delete('/recipes/:recipeId', async function (req, res) {
        await db.collection('dwad-recipes').deleteOne({
            '_id': ObjectId(req.params.recipeId)
        })
        res.json({
            'message': "data deleted successfully"
        })
    })





}
run();

//server
app.listen(3000,function(){
console.log("server running")


})