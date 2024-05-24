require('dotenv').config();   // to configure environment variables
const express = require('express');
const {connect}=require('mongoose');
const {errorLoger}=require('./utilities/ErrorLogger');
const {requestLogger}=require('./utilities/RequestLogger');
const bodyParser=require('body-parser');
const router=require('./routers/router');
const app = express();
const PORT = process.env.PORT || 3000;
const databaseURL= process.env.DB_URL || 'mongodb://localhost:27017/task-';

connect(databaseURL)
.then(result=>{console.log("You are successfully connected to MongoDB!")})
.catch(error => {console.log('Error in mongoDB connection', error)});

app.use(bodyParser.json());     // to parse stringified json to json object
app.use(requestLogger);

app.use('/',router);

app.use('*',(req,res)=>{

    res.send({message : "No resource available for this endpoint. please use one of these -> 1. GET / to see API details 2. POST /add-team  3. PUT /process-result  4. GET /team-result"})
});

app.use(errorLoger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
