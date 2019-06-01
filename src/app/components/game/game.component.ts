import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { GamewondialogComponent } from '../gamewondialog/gamewondialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { GameState, StatRow, EndOfTurnType } from 'src/app/models/interfaces';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['turn', 'plr1Turn', 'plr1Total', 'plr2Turn', 'plr2Total'];
  displayedStatsColumns: string[] = ['statType', 'plr1StatVal', 'plr2StatVal'];
  plr1Name: string = '';
  plr1Score: number = 0;
  plr2Name: string = '';
  plr2Score: number = 0;
  statsDataSource: MatTableDataSource<StatRow>;
  gameState: GameState;
  
  plrStatsSub: Subscription;
  scoreChangedSub: Subscription;
  distReachedSub: Subscription;
  gameEnded: Subscription;
  
  constructor(
    private gameService: GameService,
    private storageService: StorageService,
    private router: Router,
    public dialog: MatDialog) { }
    
  ngOnInit(): void {
    if (this.gameService.GetGameState().distance === 10000) {
      this.router.navigate(['/gamemenu']);
    } else {
      this.plrStatsSub = this.gameService.PlrStatsChanged.subscribe(
        () => this.UpdatePlrStats()
      );
      this.distReachedSub = this.gameService.DistanceReached.subscribe(() => {
        this.openDialog();
      });
      this.gameEnded = this.gameService.GameEnded.subscribe(() => 
        this.endGame()  
      );
      this.scoreChangedSub = this.gameService.ScoreChanged.subscribe(() => 
        this.UpdatePlrStats()
      );
        
      this.statsDataSource = this.getEmptyStatDataSourcs();
      this.UpdatePlrStats();
      this.plr1Name = this.gameService.GetPlayerOne().Name;
      this.plr2Name = this.gameService.GetPlayerTwo().Name;
    }
  }
  
  ngOnDestroy(): void {
    if (this.plrStatsSub !== undefined)
      this.plrStatsSub.unsubscribe();

    if (this.distReachedSub !== undefined)
      this.distReachedSub.unsubscribe();
    
    if (this.gameEnded !== undefined)
      this.gameEnded.unsubscribe();
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(GamewondialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(() =>
      this.gameService.EndGameAfterTurn()
    )
  }

  UpdatePlrStats(){
    const plr1Stats = this.gameService.GetPlayerStats(1);
    const plr2Stats = this.gameService.GetPlayerStats(2);
    
    this.statsDataSource.data[0].plr1StatVal = plr1Stats.score;
    this.statsDataSource.data[1].plr1StatVal = plr1Stats.highBreak;
    this.statsDataSource.data[2].plr1StatVal = plr1Stats.average;
    this.statsDataSource.data[3].plr1StatVal = plr1Stats.noSafesAverage;
    this.statsDataSource.data[4].plr1StatVal = plr1Stats.nrFouls;
    this.statsDataSource.data[5].plr1StatVal = plr1Stats.nrSafes;

    this.statsDataSource.data[0].plr2StatVal = plr2Stats.score;
    this.statsDataSource.data[1].plr2StatVal = plr2Stats.highBreak;
    this.statsDataSource.data[2].plr2StatVal = plr2Stats.average;
    this.statsDataSource.data[3].plr2StatVal = plr2Stats.noSafesAverage;
    this.statsDataSource.data[4].plr2StatVal = plr2Stats.nrFouls;
    this.statsDataSource.data[5].plr2StatVal = plr2Stats.nrSafes;
  }

  quitClicked(): void{
    this.storageService.ClearStoredGameState();
    this.router.navigate(['/start']);
  }

  ballsOnTable = () => this.gameService.GetGameState().ballsOnTable;

  getPlr1Score = () => this.gameService.GetGameState().plr1Score;

  getPlr1Fouls = () => this.gameService.GetGameState().plr1Fouls;

  getPlr2Score = () => this.gameService.GetGameState().plr2Score;

  getPlr2Fouls = () => this.gameService.GetGameState().plr2Fouls;

  activePlayer = () => this.gameService.GetActivePlayerNumber();

  dataSource = () => this.gameService.GetDataSource();

  currentTurn = () => this.gameService.CurrentTurn();

  currentBreak = () => this.gameService.GetGameState().currentBreak;

  plusClicked = () => this.gameService.IncrementPlayerScore();

  minusClicked = () => this.gameService.DecrementPlayerScore();

  newRackClicked = () => this.gameService.NewRack(false);

  newRack15Clicked = () => this.gameService.NewRack(true);
 
  safeClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Safe);

  missClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Miss);

  foulClicked = () => this.gameService.EndPlayerTurn(EndOfTurnType.Foul);

  getPlayer1Stats = () => this.gameService.GetPlayerStats(1);

  getPlayer2Stats = () => this.gameService.GetPlayerStats(2);

  private getEmptyStatDataSourcs(): MatTableDataSource<StatRow>{
    let statsDataSource = new MatTableDataSource<StatRow>();
    statsDataSource.data.push({ statType: 'Score', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'High break', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'Average', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'No safe average', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'Nr fouls', plr1StatVal: 0, plr2StatVal: 0 });
    statsDataSource.data.push({ statType: 'Nr safes', plr1StatVal: 0, plr2StatVal: 0 });

    return statsDataSource;
  }

  private endGame(): void{
    this.router.navigate(['/gamesummary']);
  }
}
