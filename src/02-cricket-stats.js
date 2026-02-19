/**
 * 🏏 Cricket Player Stats Dashboard
 *
 * IPL ka stats dashboard bana raha hai tu! Har function ARROW FUNCTION
 * hona chahiye (const fn = () => ...). Regular function declarations
 * mat use karna — arrow functions ki practice karna hai!
 *
 * Functions (sab arrow functions honge):
 *
 *   1. calcStrikeRate(runs, balls)
 *      - Strike rate = (runs / balls) * 100, rounded to 2 decimal places
 *      - Agar balls <= 0 ya runs < 0, return 0
 *
 *   2. calcEconomy(runsConceded, overs)
 *      - Economy = runsConceded / overs, rounded to 2 decimal places
 *      - Agar overs <= 0 ya runsConceded < 0, return 0
 *
 *   3. calcBattingAvg(totalRuns, innings, notOuts = 0)
 *      - Batting avg = totalRuns / (innings - notOuts), rounded to 2 decimal places
 *      - Default notOuts = 0
 *      - Agar innings - notOuts <= 0, return 0
 *
 *   4. isAllRounder(battingAvg, economy)
 *      - Return true agar battingAvg > 30 AND economy < 8
 *
 *   5. getPlayerCard(player)
 *      - player object: { name, runs, balls, totalRuns, innings, notOuts, runsConceded, overs }
 *      - Return: { name, strikeRate, economy, battingAvg, isAllRounder }
 *      - Use the above functions internally
 *      - Agar player null/undefined hai ya name missing, return null
 *
 * Hint: Use const fn = (params) => expression or const fn = (params) => { ... }
 *
 * @example
 *   calcStrikeRate(45, 30)  // => 150
 *   calcEconomy(24, 4)      // => 6
 *   getPlayerCard({ name: "Jadeja", runs: 35, balls: 20, totalRuns: 2000, innings: 80, notOuts: 10, runsConceded: 1500, overs: 200 })
 *   // => { name: "Jadeja", strikeRate: 175, economy: 7.5, battingAvg: 28.57, isAllRounder: false }
 */
export const calcStrikeRate = (runs, balls) => {
  if(balls<=0 || runs<0){
    return 0
  }
  let runrate=(runs/balls)*100
  runrate= runrate.toFixed(2);
  return Number(runrate);
  // Your code here
};

export const calcEconomy = (runsConceded, overs) => {
  if(overs<=0|| runsConceded<0){
    return 0
  }
  let economy=runsConceded/overs;
  economy= economy.toFixed(2);
  return Number(economy)
  // Your code here
};

export const calcBattingAvg = (totalRuns, innings, notOuts = 0) => {
  if(innings<=notOuts){
    return 0
  }
  let battingAvg=totalRuns/(innings-notOuts)
  battingAvg= battingAvg.toFixed(2)
  return Number(battingAvg)
  // Your code here
};

export const isAllRounder = (battingAvg, economy) => {
  if(battingAvg>30 && economy<8){
    return true
  }return false;
  // Your code here
};

export const getPlayerCard = (player) => {
  if(player==undefined||player==null||player.name==undefined||player.name == null ){
    return null
  }
  let strikeRate=calcStrikeRate(player.runs,player.balls)
  let economy=calcEconomy(player.runsConceded,player.overs)
  let battingAvg=calcBattingAvg(player.totalRuns,player.innings,player.notOuts)
  let yisAllRounder= isAllRounder(player.battingAvg,player.economy)
  return { name:player.name, strikeRate:strikeRate, economy:economy, battingAvg:battingAvg, isAllRounder:yisAllRounder}
  // Your code here
};
