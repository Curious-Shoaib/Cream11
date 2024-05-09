const {modelObject,teamResultModel}=require('../models/teamModel.js');


const teamRepo={};

teamRepo.saveTeam=async(teamObj)=>{
    let result;
    try{
        result=await modelObject.create(teamObj);
    }
    catch(error)
    {
        throw error;
    }
    return result;
}

teamRepo.findTeamsAndCreateTeamResults=async(playerStats)=>{

    try{
    const allTeams=await modelObject.find({});
        if(allTeams.length==0)
        {
            const error=new Error("No team was created to process on, First add a team");
            error.status=400;
            throw error;
        }
    allTeams.forEach(team =>{
        const players=team.players;
        let teamPoints=0;
        players.forEach(player=>{

            if(playerStats.get(player.playerName))         //if this player has played in match, it must be in playerStats map
            {
                const playerStateObject=playerStats.get(player.playerName);
                let totalPoints=0;
                //adding batting points
                totalPoints+=playerStateObject.myRun;
                totalPoints+=playerStateObject.sixCount * 2;            // 2 X for a six
                totalPoints+=playerStateObject.boundaryCount;           // 1 X boundary bonus
                if(playerStateObject.myRun>=100)
                {
                    totalPoints+=16;
                }
                else if(playerStateObject.myRun>=50)
                {
                    totalPoints+=8;
                }
                else if(playerStateObject.myRun>=30)
                {
                    totalPoints+=4;
                }
                if(playerStateObject.isDucked && player.role != "BOWLER")
                {
                    totalPoints-=2;
                }
            // Adding bowling points
            totalPoints+=playerStateObject.wicketTaken * 25;
            totalPoints+=playerStateObject.lbwOrBowled * 8;
            totalPoints+=playerStateObject.maidenOver * 12;
            if(playerStateObject.wicketTaken >=5)
            {
                totalPoints+=16;
            }
            else if(playerStateObject.wicketTaken >=4)
            {
                totalPoints+=8;
            }
            else if(playerStateObject.wicketTaken >=3)
            {
                totalPoints+=4;
            }

            //Adding fielding points
            totalPoints+=playerStateObject.catch * 8;
            totalPoints+=playerStateObject.stumps * 12;
            totalPoints+=playerStateObject.runOut * 6;
            if(playerStateObject.catch>=3)
                totalPoints+=4;
            
            //adding captain points
            if(player.playerName==team.captain)
            {
                totalPoints*=2;
            }
            if(player.playerName==team.viceCaptain)
            {
                totalPoints*=1.5;
            }
            player.points=totalPoints;
            teamPoints+=totalPoints;
            }
        });
        team.teamPoints=teamPoints;
    });
    
    await teamResultModel.insertMany(allTeams);
    }
    catch(error)
    {
        if(error.message.startsWith('E11000'))          // if results are alredy processed
            {
                const err=new Error('Results are alredy prepared');
                err.status=400;
                throw err;
            }
            else
                throw error;
    }
    return true;

};

teamRepo.fetchProcessedTeamResults=async()=>{
  try{
    const teamResults=await teamResultModel.find();
    if(teamResults.length==0)
    {
        const error=new Error("Results are not available, First you must have a saved team, then process data. Then you can ask for results");
        error.status=400;
        throw error;
    }
    return teamResults;
  }
  catch(error)
    {
        throw error;
    }
}
module.exports=teamRepo;
