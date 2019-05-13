import { Component, OnInit } from '@angular/core';
import { GameService, Player } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  player1: Player;
  player2: Player;
  distance: number;

  constructor(
    private gameService: GameService,
    private router: Router) { }

  ngOnInit() {
    this.player1 = { Name: 'Samuel', Id: -1 };
    this.player2 = { Name: 'Jesse', Id: -1 };
    this.distance = 75;
  }

  startGameClicked(): void{
    this.gameService.SetPlayer1(this.player1);
    this.gameService.SetPlayer2(this.player2);
    this.gameService.SetDistance(this.distance);
    this.gameService.SetGameStarted(true);
    this.router.navigate(['/game']);
  }

}
