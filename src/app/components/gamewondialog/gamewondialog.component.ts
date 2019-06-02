import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-gamewondialog',
  templateUrl: './gamewondialog.component.html',
  styleUrls: ['./gamewondialog.component.css']
})
export class GamewondialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GamewondialogComponent>,
    private gameService: GameService) { }

  ngOnInit() {
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

  continueTurnClicked(): void{
    this.gameService.EndGameAfterTurn();
    this.dialogRef.close();
  }

  endGameClicked(): void{
    this.gameService.EndGame(true);
    this.dialogRef.close();
  }
}
