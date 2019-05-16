import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GameService, EndOfTurnType } from '../../services/game.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['turn', 'plr1Turn', 'plr1Total', 'plr2Turn', 'plr2Total'];
  plr1Score: number = 0;
  plr1Avg: number = 0;
  plr1NoSfAvg: number = 0;
  plr1Fouls: number = 0;
  plr2Score: number = 0;
  plr2Avg: number = 0;
  plr2NoSfAvg: number = 0;
  plr2Fouls: number = 0;

  plr1StatsSub: Subscription;
  plr2StatsSub: Subscription;
  
  constructor(
    private gameService: GameService,
    private router: Router) {}
    
  ngOnInit(): void {
    if (!this.gameService.GetGameStarted()){
      this.router.navigate(['/gamemenu']);
    }
    
    this.plr1StatsSub = this.gameService.Plr1StatsChanged.subscribe(() => this.UpdatePlrStats(1));
    this.plr2StatsSub = this.gameService.Plr2StatsChanged.subscribe(() => this.UpdatePlrStats(2));
  }
  
  ngOnDestroy(): void {
    this.plr1StatsSub.unsubscribe();
    this.plr2StatsSub.unsubscribe();
  }

  UpdatePlrStats(plr: number){
    const plrStats = this.gameService.GetPlayerStats(plr);
    if (plr === 1) {
      this.plr1Score = plrStats.score;
      this.plr1Avg = plrStats.average;
      this.plr1NoSfAvg = plrStats.noSafesAverage;
      this.plr1Fouls = plrStats.nrFouls;
    } else {
      this.plr2Score = plrStats.score;
      this.plr2Avg = plrStats.average;
      this.plr2NoSfAvg = plrStats.noSafesAverage;
      this.plr2Fouls = plrStats.nrFouls;
    }
  }

  plusClicked =() => this.gameService.IncrementPlayerScore();

  minusClicked = () => this.gameService.DecrementPlayerScore();

  newRackClicked = () => this.gameService.NewRack(false);

  newRack15Clicked = () => this.gameService.NewRack(true);
 
  safeClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Safe);

  missClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Miss);

  foulClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Foul);

  scratchClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Foul);

  getPlayer1Stats = () => this.gameService.GetPlayerStats(1);

  getPlayer2Stats = () => this.gameService.GetPlayerStats(2);
}
