import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/services/storage.service';
import { StatRow } from 'src/app/models/interfaces';

@Component({
  selector: 'app-gamesummary',
  templateUrl: './gamesummary.component.html',
  styleUrls: ['./gamesummary.component.css']
})
export class GamesummaryComponent implements OnInit {
  displayedStatsColumns: string[] = ['statType', 'plr1StatVal', 'plr2StatVal'];
  dataSource: MatTableDataSource<StatRow>;

  constructor(
    private gameService: GameService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit() {
    this.dataSource = this.getEmptyStatDataSource();
    if (this.gameService.GetGameState().distance === 10000){
      this.router.navigate(['/start']);  
    } else {
      this.UpdatePlrStats();
      this.StoreGame();
      this.storageService.ClearStoredGameState();
    }
  }

  okButtonClicked = () => {
    this.gameService.SetGameState(null);
    this.router.navigate(['/start']);
  }

  UpdatePlrStats() {
    const plr1Stats = this.gameService.GetPlayerStats(1);
    const plr2Stats = this.gameService.GetPlayerStats(2);
    
    this.dataSource.data[0].plr1StatVal = plr1Stats.score;
    this.dataSource.data[1].plr1StatVal = plr1Stats.highBreak;
    this.dataSource.data[2].plr1StatVal = plr1Stats.average;
    this.dataSource.data[3].plr1StatVal = plr1Stats.noSafesAverage;
    this.dataSource.data[4].plr1StatVal = plr1Stats.nrFouls;
    this.dataSource.data[5].plr1StatVal = plr1Stats.nrSafes;

    this.dataSource.data[0].plr2StatVal = plr2Stats.score;
    this.dataSource.data[1].plr2StatVal = plr2Stats.highBreak;
    this.dataSource.data[2].plr2StatVal = plr2Stats.average;
    this.dataSource.data[3].plr2StatVal = plr2Stats.noSafesAverage;
    this.dataSource.data[4].plr2StatVal = plr2Stats.nrFouls;
    this.dataSource.data[5].plr2StatVal = plr2Stats.nrSafes;
  }

  StoreGame(): void {
    this.storageService.SaveGame(
      this.gameService.GetPlayerOne().Id,
      this.gameService.GetPlayerStats(1),
      this.gameService.GetPlayerTwo().Id,
      this.gameService.GetPlayerStats(2)
    );
  }

  private getEmptyStatDataSource(): MatTableDataSource<StatRow>{
    let statsDataSource = new MatTableDataSource<StatRow>();
    statsDataSource.data.push({ statType: 'Score', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'High break', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'Average', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'No safe average', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'Nr fouls', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'Nr safes', plr1StatVal: 0, plr2StatVal: 0 });

    return statsDataSource;
  }
}
