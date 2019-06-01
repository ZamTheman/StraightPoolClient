import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { GameState, PlayerStats, Player, EndOfTurnType, DSTurn, Turn } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public PlrStatsChanged: Subject<boolean>;
  public DistanceReached: Subject<boolean>;
  public GameEnded: Subject<boolean>;
  public ScoreChanged: Subject<boolean>;

  private gameState: GameState;
  private endGameAfterTurn: boolean = false;
  private EmptyStats: PlayerStats = {
    score: 0,
    highBreak: 0,
    average: 0,
    noSafesAverage: 0,
    nrFouls: 0,
    nrSafes: 0,
    nrTurns: 0,
  }
  
  constructor(private storageService: StorageService){
    this.PlrStatsChanged = new Subject<boolean>();
    this.DistanceReached = new Subject<boolean>();
    this.GameEnded = new Subject<boolean>();
    this.ScoreChanged = new Subject<boolean>();
  }

  public CurrentTurn = () =>  this.gameState.table.length;
  public CurrentTurnIndex = () =>  this.gameState.table.length - 1;

  public GetGameState(): GameState{
    if (this.gameState === undefined)
      this.CreateNewGameState(
        { Name: '', Id: '-1' },
        { Name: '', Id: '-1' },
        10000
      )
      
    return this.gameState;
  }

  public GetActivePlayerNumber(): number{
    return this.gameState.currentPlayer;
  }

  public GetPlayerOne(): Player{
    if (this.gameState !== undefined)
      return this.gameState.player1;
  }

  public GetPlayerTwo(): Player{
    if (this.gameState !== undefined)
      return this.gameState.player2;
  }

  public GetDistance(): number{
    return this.gameState.distance;
  }

  public GetPlayerStats(plr: number): PlayerStats{
    if ((plr === 2 && this.CurrentTurn() === 1)
      || (plr === 1 && this.CurrentTurn() === 1 && this.gameState.currentPlayer === 1)){
        return this.EmptyStats;
      } 

    let nrTurns = this.CurrentTurn();
    if (this.gameState.currentPlayer === 1){
      nrTurns--;
    } else if (this.gameState.currentPlayer === 2 && plr === 2){
      nrTurns--;
    }

    const avrScore = plr === 1 ? Math.round(this.gameState.plr1Score / nrTurns * 100) / 100
      : Math.round(this.gameState.plr2Score / nrTurns * 100) / 100

    let nrTurnWithNoSafes = nrTurns;
    let nrFouls = 0;
    for (let i = 0; i < nrTurns; i++){
      if (plr === 1){
        if (this.gameState.table[i].plr1TurnSafe && this.gameState.table[i].plr1TurnScore === 0){
          nrTurnWithNoSafes--;
        }
      } else {
        if (this.gameState.table[i].plr2TurnSafe && this.gameState.table[i].plr2TurnScore === 0){
          nrTurnWithNoSafes--;
        }
      }
    }

    const avrScoreWithoutSafes = plr === 1 ? Math.round(this.gameState.plr1Score / nrTurnWithNoSafes * 100) / 100
      : Math.round(this.gameState.plr2Score / nrTurnWithNoSafes * 100) / 100
    
    return { 
        score: plr === 1 ? this.gameState.plr1Score : this.gameState.plr2Score,
        highBreak: plr === 1 ? this.gameState.plr1HighBreak : this.gameState.plr2HighBreak,
        average: avrScore,
        noSafesAverage: avrScoreWithoutSafes,
        nrFouls: plr === 1 ? this.gameState.plr1TotFouls : this.gameState.plr2TotFouls,
        nrSafes: plr === 1 ? this.gameState.plr1TotSafes : this.gameState.plr2TotSafes,
        nrTurns: nrTurns
      }
  }

  public CreateNewGameState(plr1: Player, plr2: Player, distance: number): void{
    this.gameState = {
      distance: distance,
      currentPlayer: 1,
      currentBreak: 0,
      ballsOnTable: 15,
      player1: plr1,
      plr1Score: 0,
      plr1Fouls: 0,
      plr1HighBreak: 0,
      plr1TotFouls: 0,
      plr1TotSafes: 0,
      player2: plr2,
      plr2Score: 0,
      plr2Fouls: 0,
      plr2HighBreak: 0,
      plr2TotFouls: 0,
      plr2TotSafes: 0,
      table: [
        { 
          turnId: 1,
          plr1TurnScore: 0,
          plr1TurnFoul: false,
          plr1TurnSafe: false,
          plr2TurnScore: 0,
          plr2TurnFoul: false,
          plr2TurnSafe: false
        }
      ]
    }
  }

  public SetGameState(gameState: GameState): void{
    this.gameState = gameState;
  }

  public IncrementPlayerScore(): void{
    if (this.gameState.ballsOnTable === 0)
      return;

    this.gameState.currentBreak++;
    this.gameState.ballsOnTable--;
    
    if (this.gameState.currentPlayer === 1){
      this.gameState.plr1Score++;
      this.gameState.table[this.CurrentTurnIndex()].plr1TurnScore++;
    } else {
      this.gameState.plr2Score++;
      this.gameState.table[this.CurrentTurnIndex()].plr2TurnScore++;
    }

    if (this.gameState.plr1Score >= this.gameState.distance
      || this.gameState.plr2Score >= this.gameState.distance){
      this.DistanceReached.next(true);
    }

    this.ScoreChanged.next();
  }

  public DecrementPlayerScore(): void{
    if (this.gameState.ballsOnTable === 15)
      return;

    this.gameState.currentBreak--;
    this.gameState.ballsOnTable++;

    if (this.gameState.currentPlayer === 1){
      this.gameState.plr1Score--;
      this.gameState.table[this.CurrentTurnIndex()].plr1TurnScore--;
    } else {
      this.gameState.plr2Score--;
      this.gameState.table[this.CurrentTurnIndex()].plr2TurnScore--;
    }

    this.ScoreChanged.next();
  }
  
  public NewRack(lastBallPocketed: boolean){
    const ballsLeft = lastBallPocketed ? 0 : 1;
    this.gameState.currentBreak += this.gameState.ballsOnTable - ballsLeft;
    
    if (this.gameState.currentPlayer === 1){
      this.gameState.plr1Score += this.gameState.ballsOnTable - ballsLeft;
      this.gameState.table[this.CurrentTurnIndex()].plr1TurnScore += this.gameState.ballsOnTable - ballsLeft;
    } else {
      this.gameState.plr2Score += this.gameState.ballsOnTable - ballsLeft;
      this.gameState.table[this.CurrentTurnIndex()].plr2TurnScore += this.gameState.ballsOnTable - ballsLeft;
    }
    
    this.gameState.ballsOnTable = 15;

    if (this.gameState.plr1Score >= this.gameState.distance
      || this.gameState.plr1Score >= this.gameState.distance){
      this.DistanceReached.next(true);
    }

    this.ScoreChanged.next();
  }
  
  public EndPlayerTurn(endType: EndOfTurnType): void{
    if (this.gameState.currentPlayer === 1){
      switch (endType){
        case EndOfTurnType.Safe:
          this.gameState.plr1Fouls = 0;
          this.gameState.plr1TotSafes++;
          this.gameState.table[this.CurrentTurnIndex()].plr1TurnSafe = true;
          break;
        case EndOfTurnType.Miss:
          this.gameState.plr1Fouls = 0;
          break;
        case EndOfTurnType.Foul:
          this.gameState.plr1Score--;
          this.gameState.plr1TotFouls++;
          if (this.gameState.currentBreak > 0){
            this.gameState.plr1Fouls = 0;
          }
          this.gameState.plr1Fouls++;
          this.gameState.table[this.CurrentTurnIndex()].plr1TurnFoul = true;
          break;
      }

      if (this.gameState.currentBreak > this.gameState.plr1HighBreak)
        this.gameState.plr1HighBreak = this.gameState.currentBreak;

      this.gameState.currentPlayer = 2;
    } else{
        switch (endType){
          case EndOfTurnType.Safe:
            this.gameState.plr2Fouls = 0;
            this.gameState.plr2TotSafes++;
            this.gameState.table[this.CurrentTurnIndex()].plr2TurnSafe = true;
            break;
          case EndOfTurnType.Miss:
            this.gameState.plr2Fouls = 0;
            break;
          case EndOfTurnType.Foul:
            this.gameState.plr2Score--;
            this.gameState.plr2TotFouls++;
            if (this.gameState.currentBreak > 0){
              this.gameState.plr2Fouls = 0;
            }
            this.gameState.plr2Fouls++;
            this.gameState.table[this.CurrentTurnIndex()].plr2TurnFoul = true;
            break;
          }

        if (this.gameState.currentBreak > this.gameState.plr2HighBreak)
          this.gameState.plr2HighBreak = this.gameState.currentBreak;

        this.AddTurn();
    }

    this.gameState.currentBreak = 0;
    this.PlrStatsChanged.next();
    this.storageService.StoreGameState(this.gameState);
    if (this.endGameAfterTurn)
      this.EndGame();
  }
  
  public GetDataSource(): MatTableDataSource<DSTurn>{
    let dataSource = new MatTableDataSource<DSTurn>();
    this.gameState.table.forEach(tr => {
      const playersTurnStrings = this.GetPlayersTurnStrings(tr);
      
      dataSource.data.push({
        turnId: tr.turnId,
        plr1Turn: playersTurnStrings[0],
        plr1Total: this.gameState.plr1Score,
        plr2Turn: playersTurnStrings[1],
        plr2Total: this.gameState.plr2Score
      })
    })
    
    return dataSource;
  }
  
  public EndGameAfterTurn(): void{
    this.endGameAfterTurn = true;
  }

  public EndGame(): void{
    this.GameEnded.next(true);
  }

  private AddTurn(): void{
    this.gameState.table.push(
      {
        turnId: this.gameState.table[this.gameState.table.length - 1].turnId + 1,
        plr1TurnScore: 0,
        plr1TurnFoul: false,
        plr1TurnSafe: false,
        plr2TurnScore: 0,
        plr2TurnFoul: false,
        plr2TurnSafe: false
      }
    )

    this.gameState.currentPlayer = 1;
  }

  private GetPlayersTurnStrings(turn: Turn): string[]{
    let plr1TurnString = '';
    if (turn.plr1TurnScore > 0 || (!turn.plr1TurnFoul && !turn.plr1TurnSafe)) {
      plr1TurnString += turn.plr1TurnScore;
    }
    
    if (turn.plr1TurnFoul){
      plr1TurnString += plr1TurnString !== '' ? ' - 1' : '- 1';
    }
    
    if (turn.plr1TurnSafe){
      plr1TurnString += plr1TurnString !== '' ? ' + SF' : 'SF';
    }
    
    let plr2TurnString = '';
    if (turn.plr2TurnScore > 0 || (!turn.plr2TurnFoul && !turn.plr2TurnSafe)) {
      plr2TurnString += turn.plr2TurnScore;
    }

    if (turn.plr2TurnFoul){
      plr2TurnString += plr2TurnString !== '' ? ' - 1' : '- 1';
    }

    if (turn.plr2TurnSafe){
      plr2TurnString += plr2TurnString !== '' ? ' + SF' : 'SF';
    }

    return [plr1TurnString, plr2TurnString];
  }

}
