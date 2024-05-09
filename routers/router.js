const express=require('express');
const {saveTeam,processResult,showResults}=require('../services/teamService');
const router=express.Router();


// this endpoint must have valid body object, i.e. fields should be like this,
// {
//    "teamName" : "Hunters",
//    "players" : ["<Array of 11 players>"],
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
module.exports=router;