import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  newPlayer: string = '';
  distance: number;
  dbPlayers: any;
  dbSubscription: Subscription;
  selectedPlayer1: string;
  selectedPlayer2: string;

  constructor(
    private gameService: GameService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit() {
    this.distance = 75;
    if (this.storageService.GetGameState() !== undefined && this.storageService.GetGameState() !== null){
      this.gameService.SetGameState(this.storageService.GetGameState());
      this.router.navigate(['/game']);
    };

    this.selectedPlayer1 = this.selectedPlayer2 = '';

    this.dbSubscription = this.storageService
      .items
      .subscribe(
        data => {
          this.dbPlayers = data;
          this.selectedPlayer1 = this.dbPlayers[0].name;
          this.selectedPlayer2 = this.dbPlayers[1].name;
        })
  }

  addUserClicked(): void{
    this.storageService.AddNewUser(this.newPlayer);
  }

  startGameClicked(): void{
    this.storageService.GetDbUserByName(this.selectedPlayer1).subscribe(plr1 => {
      this.storageService.GetDbUserByName(this.selectedPlayer2).subscribe(plr2 => {
        this.gameService
          .CreateNewGameState(
            { Id: plr1[0].key, Name: this.selectedPlayer1 },
            { Id: plr2[0].key, Name: this.selectedPlayer2 },
            this.distance);
        this.router.navigate(['/game']);
        }
      )
    });
  }
}
