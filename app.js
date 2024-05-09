const {config}=require('dotenv');
config();                                     // to configure environment variables
const express = require('express');
const {connect}=require('mongoose');
const {errorLoger}=require('./utilities/ErrorLogger');
const {requestLogger}=require('./utilities/RequestLogger');
const bodyParser=require('body-parser');
const router=require('./routers/router');
const app = express();
const PORT = process.env.PORT || 3000;
const databaseURL= process.env.DB_URL || 'mongodb://localhost:27017/task';

(async function run() {
  try {
    
    await connect(databaseURL);
    console.log("You are successfully connected to MongoDB!");
    
  } catch(error) {
    console.log('Error in mongoDB connection', error);
  }
})();         // made it immidiately invoke function .


app.use(bodyParser.json());     // Parses the body text as json
app.use(requestLogger);

app.use('/',router);

app.use('*',(req,res,next)=>{

    res.send({message : "No resource available for this endpoint."})
});

app.use(errorLoger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
