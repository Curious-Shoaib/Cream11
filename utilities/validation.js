const {readFileSync}=require('fs');
const validator={};

validator.validateTeam=(teamObj)=>{
    if(!teamObj)
    {
        const error=new Error('Please enter team details');
        error.status=400;
        throw error;
    }
    const {teamName,captain,viceCaptain,players : selectedPlayersArray}=teamObj;
    if(!teamName || teamName=="")
    {
        const error=new Error('Please enter a team name');
        error.status=400;
        throw error;
    }
    if(!captain || captain=="")
    {
        const error=new Error('Please choose a captain');
        error.status=400;
        throw error;
    }
    if(!viceCaptain || viceCaptain=="")
    {
        const error=new Error('Please choose a vice-captain');
        error.status=400;   
        throw error;
    }
    if(viceCaptain === captain)
        {
            const error=new Error('captain and vice captain must be different player');
            error.status=400;   
            throw error;
        }
    if(!selectedPlayersArray)
    {
        const error=new Error('Please choose remaining 11 players');
        error.status=400;    
        throw error;  
    }
    if(selectedPlayersArray.length < 11)
    {
        const error=new Error(`please choose remaining ${11-selectedPlayersArray.length} players`);
        error.status=400; 
        throw error;     
    }
    if(selectedPlayersArray.length > 11)
    {
        const error=new Error(`you cannot choose more than 11 players`);
        error.status=400;    
        throw error;  
    }
    if(!selectedPlayersArray.includes(captain))
    {
        const error=new Error(`Captain must be amongst choosen players`);
        error.status=400;    
        throw error;  
    }
    if(!selectedPlayersArray.includes(viceCaptain))
        {
            const error=new Error(`Vice captain must be amongst choosen players`);
            error.status=400;    
            throw error;  
        }
    let SavedPlayersData=readFileSync('./data/players.json' , 'utf-8');  // read data is json string, 
    SavedPlayersData=JSON.parse(SavedPlayersData);                                      // converting it to native javascript objects

    const playerMap=new Map();
    SavedPlayersData.forEach(item => {
        playerMap.set(item.Player , {team : item.Team, role : item.Role});
    });
    let firstTeam=0;
    let secondTeam=0;
    let batterCount=0;
    let wkCount=0;
    let allRounderCount=0;
    let bowlerCount=0;
    selectedPlayersArray.forEach((player,index) =>{
        const selectedPlayerData=playerMap.get(player);
        if(!selectedPlayerData)
        {
            const error=new Error(`choosen player ${player} is not available in either team`);
            error.status=400;
            throw error;
        }
        const team=selectedPlayerData.team;
        const role=selectedPlayerData.role;
        if(team=='Chennai Super Kings')
            firstTeam++;
        else 
            secondTeam++;
        if(role=='BATTER')
            batterCount++;
        else if(role=='ALL-ROUNDER')
            allRounderCount++;
        else if(role=='WICKETKEEPER')
            wkCount++;
        else 
            bowlerCount++;
        selectedPlayersArray[index]={                           // converting string element of array to player object for further use
            playerName : selectedPlayersArray[index], 
            role : role,
            points : 0
        }
    });

    if(!firstTeam || !secondTeam)
    {
        const error=new Error("All 11 players can't be choosen from single team. At least choose one player from different team");
        error.status=400;
        throw error;
    }
    if(!batterCount)
    {
        const error=new Error("there needs to be at least one batter");
        error.status=400;
        throw error;
    }
    if(batterCount>8)
    {
        const error=new Error("No more than 8 batter can be choosen");
        error.status=400;
        throw error;
    }
    if(!bowlerCount)
    {
        const error=new Error("there needs to be at least one bowler");
        error.status=400;
        throw error;
    }
    if(bowlerCount>8)
    {
        const error=new Error("No more than 8 bowler can be choosen");
        error.status=400;
        throw error;
    }
    if(!wkCount)
    {
        const error=new Error("there needs to be at least one wicketKeeper");
        error.status=400;
        throw error;
    }
    if(wkCount>8)
    {
        const error=new Error("No more than 8 wicketKeeper can be choosen");
        error.status=400;
        throw error;
    }
    if(!allRounderCount)
    {
        const error=new Error("there needs to be at least one allRounder");
        error.status=400;
        throw error;   
    }
    if(allRounderCount>8)
    {
        const error=new Error("No more than 8 allRounders can be choosen");
        error.status=400;
        throw error;   
    }

}

module.exports=validator;