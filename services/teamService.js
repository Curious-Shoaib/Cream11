
const {saveTeam,findTeamsAndCreateTeamResults,fetchProcessedTeamResults}=require('../repository/teamRepo');
const {validateTeam}=require('../utilities/validation');
const {readFileSync}=require('fs');

const teamService={};

teamService.saveTeam=async(teamObj)=>{
   try{
      validateTeam(teamObj);      // if recieved object is not valid, then validator will throw error
      // validateTeam() also converts teamObj's elements from player name to player object to fecilitate future usage
      const result=await saveTeam(teamObj);
      return result;             // return truthy if team saved, otherwise team repo will throw error
   }
   catch(error){
            throw error;
   }
}

teamService.processResult=async()=>{
     try{
      let matchObject= await readFileSync('./data/match.json','utf-8');
      matchObject=JSON.parse(matchObject);
      const playersStats=new Map();                // we will populate this map for every player who played in this match 
                                                   // this map will store player's contributions
      let i=0;
      while(i<matchObject.length)         //traversing every delivery
      {
         const bowler=matchObject[i].bowler;       // this bowler varible will be assigned in start of every new over
         let conceededRun=0;
         const currentOver=matchObject[i].overs;
         if(!playersStats.get(bowler))                   // populating map for bowler if not pre-exist
         {
            playersStats.set(bowler,createPlayerStateObject(bowler));
         }
         while(matchObject[i] && matchObject[i].overs==currentOver)     // this loop run for an over only
         {
            const batter=matchObject[i].batter;
            const batsman_run=matchObject[i].batsman_run;
            const playerOut=matchObject[i].player_out;
            const total_run=matchObject[i].total_run;
            const outReason=matchObject[i].kind;
            const fielders_involved=matchObject[i].fielders_involved;
            if(playerOut!= "NA" && !playersStats.get(playerOut))                   // populating map for out batter if not pre-exist
            {
               playersStats.set(playerOut,createPlayerStateObject(playerOut));
            }
            if(!playersStats.get(batter))                   // populating map for batter if not pre-exist
            {
               playersStats.set(batter,createPlayerStateObject(batter));
            }
            if(matchObject[i].fielders_involved !="NA" && !playersStats.get(fielders_involved))   // populating fielder involved in some fielding scenrio
            {
               playersStats.set(fielders_involved,createPlayerStateObject(fielders_involved));
            }
            
            // adding batsman stats
            const forBatter=playersStats.get(batter);
            forBatter.myRun+=batsman_run;
            if(batsman_run==4)
               forBatter.boundaryCount++;
            else if(batsman_run==6)
               forBatter.sixCount++;
            if(playerOut != "NA" && playersStats.get(playerOut).myRun==0) // if any batsman got ducked
            {
               playersStats.get(playerOut).isDucked=true;
            }
            
            //adding fielder stats and bowler stats
            if(outReason=="caught")
            {
               playersStats.get(bowler).wicketTaken++;
               playersStats.get(fielders_involved).catch++;
            }
            else if(outReason=="lbw" || outReason=="bowled" || outReason=="Bowled")
            {
               playersStats.get(bowler).wicketTaken++;
               playersStats.get(bowler).lbwOrBowled++;
            }
            else if(outReason=="caught and bowled")
            {
               playersStats.get(bowler).wicketTaken++;
               playersStats.get(bowler).catch++;
            }
            else if(outReason=="run-out" || outReason=='run_out' || outReason=='runout' || outReason=='Runout' || outReason=='RunOut' || outReason=='run out' || outReason=='Run Out')
            {
               playersStats.get(fielderInvolved).runOut++;
            }
            else if(outReason=="stumps" || outReason=='stumped' || outReason=='Stumped' || outReason=='Stumps')
            {
               playersStats.get(fielderInvolved).stumps++;
            }

            conceededRun+=total_run;
            i++;
         }
         if(conceededRun==0)
         {
            playersStats.get(bowler).maidenOver++;
         }
      }
      // now we need to fetch all teams from database and update points to each team and each player of team
      // repo layer will handle this part, so we are calling repo's findTeamAndUpdatePoints()
      await findTeamsAndCreateTeamResults(playersStats);
     }
     catch(error)
     {
         throw error;
     }
}


teamService.showResults=async()=>{

      const teamsArray=await fetchProcessedTeamResults();
      teamsArray.sort((x,y)=>y.teamPoints- x.teamPoints);

      const WinnerPoints=teamsArray[0].teamPoints;
      for(let team of teamsArray)
      {
         if(team.teamPoints==WinnerPoints)
         {
            team.winningStatus="Winner";
         }
         else
         {
            break;
         }
      }
      return teamsArray;
}


function createPlayerStateObject(name){
   const playerObj={
      playerName : name,
      myRun : 0,
      sixCount : 0,
      boundaryCount : 0,
      isDucked : false,
      wicketTaken : 0,
      lbwOrBowled : 0,
      maidenOver : 0,
      catch : 0,
      stumps : 0,
      runOut :0
   }
   return playerObj;
}
module.exports=teamService;

