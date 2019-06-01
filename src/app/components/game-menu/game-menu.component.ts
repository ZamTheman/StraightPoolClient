export class DbPlayer{
  constructor(public Id: string, public Name: string){}
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit, OnDestroy {
  newPlayer: string = '';
  distance: number;
  dbPlayers = <DbPlayer[]>[];
  dbUsersSubscription: Subscription;
  selectedPlayer1: DbPlayer;
  selectedPlayer2: DbPlayer;

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

    this.selectedPlayer1 = this.selectedPlayer2 = new DbPlayer('', '');
    this.dbUsersSubscription = this.storageService
        .users
        .subscribe(data => {
          this.dbPlayers = <DbPlayer[]>[];
          data.forEach(d => {
            this.dbPlayers.push(
              new DbPlayer (
                d.payload.doc.id,
                d.payload.doc.data().name)
            )
          })

          if (this.dbPlayers.length > 0)
            this.selectedPlayer1 = this.dbPlayers[0];

          if (this.dbPlayers.length > 1)
            this.selectedPlayer2 = this.dbPlayers[1];
        })
  }

  ngOnDestroy(){
    this.dbUsersSubscription.unsubscribe();
  }

  addUserClicked(): void{
    this.storageService.AddNewUser(this.newPlayer);
    this.newPlayer = '';
  }

  startGameClicked(): void{
    this.gameService
      .CreateNewGameState(
        { Id: this.selectedPlayer1.Id, Name: this.selectedPlayer1.Name },
        { Id: this.selectedPlayer2.Id, Name: this.selectedPlayer2.Name },
        this.distance);
    this.router.navigate(['/game']);
  }
}
