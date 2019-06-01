export interface Player{
    Id: string;
    Name: string;
  }
  
  export interface GameState{
    distance: number,
    currentPlayer: number;
    currentBreak: number,
    ballsOnTable: number,
    player1: Player,
    plr1HighBreak: number;
    plr1TotSafes: number;
    plr1TotFouls: number;
    player2: Player,
    plr2HighBreak: number;
    plr2TotSafes: number;
    plr2TotFouls: number;
    plr1Score: number;
    plr1Fouls: number;
    plr2Score: number;
    plr2Fouls: number;
    table: Turn[]
  }
  
  export interface Turn{
    turnId: number;
    plr1TurnScore: number;
    plr1TurnFoul: boolean;
    plr1TurnSafe: boolean;
    plr2TurnScore: number;
    plr2TurnFoul: boolean;
    plr2TurnSafe: boolean;
  }
  
  export interface DSTurn{
    turnId: number;
    plr1Turn: string;
    plr1Total: number;
    plr2Turn: string;
    plr2Total: number;
  }
  
  export interface PlayerStats{
    score: number;
    highBreak: number;
    average: number;
    noSafesAverage: number;
    nrFouls: number;
    nrSafes: number;
    nrTurns: number;
  }
  
  export enum EndOfTurnType{
    Safe,
    Miss,
    Foul
  }

  export interface GameStat{
    date: Date,
    win: boolean,
    avg: number,
    noSafeAvg: number,
    foulsPerVisit: number,
    sfsPerVisit: number,
    gameTimeSeconds: number
  }
  
  export interface DbUser{
    name: string,
    highBreak: number,
    games: GameStat[]
  }

  export interface StatRow{
    statType: string,
    plr1StatVal: number,
    plr2StatVal: number
  }
  