export interface Player{
  Id: number;
  Name: string;
}

export interface TurnTableData {
  turn: number;
  plr1Turn: string;
  plr1Total: number;
  plr2Turn: string;
  plr2Total: number;
}

const TABLE_DATA: TurnTableData[] = [
  { turn: 1, plr1Turn: '5 + SF', plr1Total: 5, plr2Turn: '3 - 1', plr2Total: 2 },
  { turn: 2, plr1Turn: '0', plr1Total: 5, plr2Turn: '4', plr2Total: 6 },
  { turn: 3, plr1Turn: '12 - 1', plr1Total: 16, plr2Turn: '7 + SF', plr2Total: 13 }
]

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private plr1: Player;
  private plr2: Player;
  private distance: number;
  private tableData: TurnTableData[];
  private gameStarted: boolean;
  
  constructor() {
    this.tableData = TABLE_DATA;
  }

  public GetPlayerOne(): Player{
    return this.plr1;
  }

  public GetPlayerTwo(): Player{
    return this.plr2;
  }

  public GetDistance(): number{
    return this.distance;
  }

  public GetGameStarted(): boolean{
    return this.gameStarted;
  }

  public SetPlayer1(player: Player): void{
    this.plr1 = player;
  }

  public SetPlayer2(player: Player): void{
    this.plr2 = player;
  }

  public SetDistance(distance: number): void{
    this.distance = distance;
  }

  public SetGameStarted(gameStarted: boolean): void{
    this.gameStarted = gameStarted;
  }

  public GetTableData(): TurnTableData[]{
    return this.tableData;
  }
}
