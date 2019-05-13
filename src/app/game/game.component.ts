import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { TurnTableData, GameService, Player } from '../game.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {
  displayedColumns: string[] = ['turn', 'plr1Turn', 'plr1Total', 'plr2Turn', 'plr2Total'];
  dataSource: MatTableDataSource<TurnTableData>;
  plr1: Player;
  plr1Score: number;
  plr1Fouls: number;
  plr2: Player;
  plr2Score: number;
  plr2Fouls: number;
  ballsOnTable: number;
  currentBreak: number;
  plr1Turn: boolean;
  currentTurn: number;

  constructor(
    private gameService: GameService,
    private router: Router) {
  }
  
  ngOnInit() {
    if (!this.gameService.GetGameStarted())
      this.router.navigate(['/gamemenu']);

    this.setupNewGame();
  }

  plusClicked(){
    if (this.ballsOnTable === 0)
      return;

    this.currentBreak++;
    this.ballsOnTable--;

    if (this.plr1Turn){
      this.plr1Score++;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Score++;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }
  }

  minusClicked(){
    if (this.ballsOnTable === 15)
      return;

    this.currentBreak--;
    this.ballsOnTable++;

    if (this.plr1Turn){
      this.plr1Score--;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Score--;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }
  }

  newRackClicked(){
    this.currentBreak += this.ballsOnTable - 1;
    if (this.plr1Turn){
      this.plr1Score += this.ballsOnTable - 1;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Score += this.ballsOnTable - 1;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }
    
    this.ballsOnTable = 15;
  }

  newRack15Clicked(){
    this.currentBreak += this.ballsOnTable;
    if (this.plr1Turn){
      this.plr1Score += this.ballsOnTable;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Score += this.ballsOnTable;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }

    this.ballsOnTable = 15;
  }

  safeClicked(){
    if (this.plr1Turn){
      this.plr1Fouls = 0;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString() + '+SF';
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Fouls = 0;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString() + '+SF';
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }

    if (!this.plr1Turn){
      this.currentTurn++;
      this.addNewRow();
    }

    this.plr1Turn = !this.plr1Turn;
    this.currentBreak = 0;
  }

  missClicked(){
    if (this.plr1Turn){
      this.plr1Fouls = 0;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Fouls = 0;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString();
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }

    if (!this.plr1Turn){
      this.currentTurn++;
      this.addNewRow();
    }

    this.plr1Turn = !this.plr1Turn;
    this.currentBreak = 0;
  }

  foulClicked(){
    if (this.plr1Turn){
      this.plr1Score--;
      this.plr1Fouls++;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString() + '-1';
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Score--;
      this.plr2Fouls++;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString() + '-1';
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }

    if (!this.plr1Turn){
      this.currentTurn++;
      this.addNewRow();
    }

    this.plr1Turn = !this.plr1Turn;
    this.currentBreak = 0;
  }

  scratchClicked(){
    if (this.plr1Turn){
      this.plr1Score--;
      this.plr1Fouls++;
      this.dataSource.data[this.currentTurn - 1].plr1Turn = this.currentBreak.toString() + '-1';
      this.dataSource.data[this.currentTurn - 1].plr1Total = this.plr1Score;
    } else {
      this.plr2Score--;
      this.plr2Fouls++;
      this.dataSource.data[this.currentTurn - 1].plr2Turn = this.currentBreak.toString() + '-1';
      this.dataSource.data[this.currentTurn - 1].plr2Total = this.plr2Score;
    }
    
    if (!this.plr1Turn){
      this.currentTurn++;
      this.addNewRow();
    }

    this.plr1Turn = !this.plr1Turn;
    this.currentBreak = 0;
  }

  private addNewRow(){
    this.dataSource.data.push(
      { turn: this.currentTurn, plr1Turn: '-', plr1Total: this.plr1Score, plr2Turn: '-', plr2Total: this.plr2Score }
    );
    this.dataSource.connect().next(this.dataSource.data);
  }
    
  private setupNewGame(){
    this.plr1 = this.gameService.GetPlayerOne();
    this.plr1Score = 0;
    this.plr1Fouls = 0;
    this.plr2 = this.gameService.GetPlayerTwo();
    this.plr2Score = 0;
    this.plr2Fouls = 0;
    this.ballsOnTable = 15;
    this.currentBreak = 0;
    this.currentTurn = 1;
    this.plr1Turn = true;
    this.dataSource = new MatTableDataSource<TurnTableData>();
    this.dataSource.data.push({ turn: 1, plr1Turn: '-', plr1Total: 0, plr2Turn: '-', plr2Total: 0 });
  }

}
