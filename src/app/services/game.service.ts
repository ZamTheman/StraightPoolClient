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
  player2: Player,
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
  average: number;
  noSafesAverage: number;
  nrFouls: number;
}

export enum EndOfTurnType{
  Safe,
  Miss,
  Foul
}

import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public Plr1StatsChanged: Subject<any>;
  public Plr2StatsChanged: Subject<any>;

  private gameState: GameState;
  private EmptyStats: PlayerStats = {
    score: 0,
    average: 0,
    noSafesAverage: 0,
    nrFouls: 0
  }
  
  constructor(private storageService: StorageService){
    this.Plr1StatsChanged = new Subject<any>();
    this.Plr2StatsChanged = new Subject<any>();
  }

  public CurrentTurn = () =>  this.gameState.table.length;
  public CurrentTurnIndex = () =>  this.gameState.table.length - 1;

  public GetGameState(): GameState{
    return this.gameState;
  }

  public GetActivePlayerNumber(): number{
    return this.gameState.currentPlayer;
  }

  public GetPlayerOne(): Player{
    return this.gameState.player1;
  }

  public GetPlayerTwo(): Player{
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
        if (this.gameState.table[i].plr1TurnFoul){
          nrFouls++;
        }
      } else {
        if (this.gameState.table[i].plr2TurnSafe && this.gameState.table[i].plr2TurnScore === 0){
          nrTurnWithNoSafes--;
        }
        if (this.gameState.table[i].plr2TurnFoul){
          nrFouls++;
        }
      }
    }

    const avrScoreWithoutSafes = plr === 1 ? Math.round(this.gameState.plr1Score / nrTurnWithNoSafes * 100) / 100
      : Math.round(this.gameState.plr2Score / nrTurnWithNoSafes * 100) / 100
    
    return { 
        score: plr === 1 ? this.gameState.plr1Score : this.gameState.plr2Score,
        average: avrScore,
        noSafesAverage: avrScoreWithoutSafes,
        nrFouls: nrFouls
      }
  }

  public SetGameState(gameState: GameState): void{
    this.gameState = gameState;
  }

  public CreateNewGameState(plr1: Player, plr2: Player, distance: number): void{
    this.gameState = {
      distance: distance,
      currentPlayer: 1,
      currentBreak: 0,
      ballsOnTable: 15,
      player1: plr1,
      player2: plr2,
      plr1Score: 0,
      plr2Score: 0,
      plr1Fouls: 0,
      plr2Fouls: 0,
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
  }
  
  public EndPlayerTurn(endType: EndOfTurnType): void{
    if (this.gameState.currentPlayer === 1){
      switch (endType){
        case EndOfTurnType.Safe:
          this.gameState.plr1Fouls = 0;
          this.gameState.table[this.CurrentTurnIndex()].plr1TurnSafe = true;
          break;
        case EndOfTurnType.Miss:
          this.gameState.plr1Fouls = 0;
          break;
        case EndOfTurnType.Foul:
          this.gameState.plr1Score--;
          if (this.gameState.currentBreak > 0){
            this.gameState.plr1Fouls = 0;
          }
          this.gameState.plr1Fouls++;
          this.gameState.table[this.CurrentTurnIndex()].plr1TurnFoul = true;
          break;
      }

      this.gameState.currentPlayer = 2;
    } else{
        switch (endType){
          case EndOfTurnType.Safe:
            this.gameState.plr2Fouls = 0;
            this.gameState.table[this.CurrentTurnIndex()].plr2TurnSafe = true;
            break;
          case EndOfTurnType.Miss:
            this.gameState.plr2Fouls = 0;
            break;
          case EndOfTurnType.Foul:
            this.gameState.plr2Score--;
            if (this.gameState.currentBreak > 0){
              this.gameState.plr2Fouls = 0;
            }
            this.gameState.plr2Fouls++;
            this.gameState.table[this.CurrentTurnIndex()].plr2TurnFoul = true;
            break;
          }

        this.AddTurn();
    }

    this.gameState.currentBreak = 0;
    
    if (this.gameState.currentPlayer === 1){
      this.Plr2StatsChanged.next(); 
    } else {
      this.Plr1StatsChanged.next();
    }

    this.storageService.StoreGameState(this.gameState);
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
