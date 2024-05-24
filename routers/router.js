const express=require('express');
const {saveTeam,processResult,showResults}=require('../services/teamService');
const router=express.Router();


// this endpoint must recieve valid body object, i.e. fields should be like this,
// {
//    "teamName" : "Hunters",
//    "players" : ["<Array of 11 players name string>"],
//    "captain" : "<choosen captain name>",
//    "viceCaptain" : "<choosen vice captain>"
// }
router.post('/add-team',async(req,res,next)=>{
   try{
    const teamObj=req.body;
    await saveTeam(teamObj);
    res.status(200).json({message : "team created successfully"});
   }
   catch(error)
   {
        next(error);
   }
})

router.put('/process-result',async(req,res,next)=>{
      
      try{
         await processResult();
         res.status(200).json({message : "Results are ready"});
      }
      catch(error)
      {
         next(error);
      }

});
router.get('/team-result',async(req,res,next)=>{

      try{
         const teamResults=await showResults();
         res.status(200).send(teamResults);
      }
      catch(error)
      {
         next(error);
      }

})


router.all('/',(req,res,next)=>{
   
   const apiInstructions={
      'To Add team' : "use  /add-team to send team JSON with POST request",
      'TeamObjectSample' : {
         "teamName" : "<Any Arbitrary name>",
         "players" : ["<Array of 11 players that must have valid names in string>"],
         "captain" : "<choosen captain name>",
         "viceCaptain" : "<choosen vice captain>"
      },
      'To process Match result' : "use /process-result  with PUT request , it will process all teams point",
      'To get the team results and Winners' : "use /team-result with GET request, it will return array of all teams result"
   };
   res.send(apiInstructions);
})
module.exports=router;