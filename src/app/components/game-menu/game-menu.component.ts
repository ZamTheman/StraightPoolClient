import { Component, OnInit } from '@angular/core';
import { GameService, Player } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  player1: Player = { Name: 'Samuel', Id: -1 };
  player2: Player = { Name: 'Jesse', Id: -1 };
  distance: number;

  constructor(
    private gameService: GameService,
    private router: Router) { }

  ngOnInit() {
    this.distance = 75;
  }

  startGameClicked(): void{
    this.gameService.CreateNewGameState(this.player1, this.player2, this.distance);
    this.router.navigate(['/game']);
  }

}
