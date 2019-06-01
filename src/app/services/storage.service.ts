import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { DbUser, GameStat, GameState, PlayerStats } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  users: Observable<DocumentChangeAction<DbUser>[]>;
  
  constructor(
    private fireStore: AngularFirestore,
    ) {
    this.users = fireStore.collection<DbUser>('users').snapshotChanges();
  }

  public StoreGameState(gameState: GameState): void{
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  public GetGameState(): GameState{
    return JSON.parse(localStorage.getItem('gameState'));
  }

  public ClearStoredGameState(){
    localStorage.removeItem('gameState');
  }

  public AddNewUser(playerName: string): void{
    this.fireStore
      .collection('users')
      .add(
        {
          'name': playerName,
          'highBreak': 0
        });
  }

  public SaveGame(
    plr1Id: string,
    plr1Stats: PlayerStats,
    plr2Id: string,
    plr2Stats: PlayerStats): void {
    const plr1Won = plr1Stats.score > plr2Stats.score;
    const plr1Doc = this.fireStore.doc<DbUser>('users/' + plr1Id);
    plr1Doc.collection<GameStat>('games').add({
      'date': new Date,
      'win': plr1Won,
      'avg': plr1Stats.average,
      'noSafeAvg': plr1Stats.average,
      'foulsPerVisit': plr1Stats.nrFouls / plr1Stats.nrTurns,
      'sfsPerVisit': plr1Stats.nrSafes / plr1Stats.nrTurns,
      'gameTimeSeconds': 3600
    })

    const plr2Doc = this.fireStore.doc<DbUser>('users/' + plr2Id);
    plr2Doc.collection<GameStat>('games').add({
      'date': new Date,
      'win': !plr1Won,
      'avg': plr2Stats.average,
      'noSafeAvg': plr2Stats.average,
      'foulsPerVisit': plr2Stats.nrFouls / plr2Stats.nrTurns,
      'sfsPerVisit': plr2Stats.nrSafes / plr2Stats.nrTurns,
      'gameTimeSeconds': 3600
    })

    const plr1DocSub = plr1Doc.valueChanges().subscribe(plr => {
      if (plr1Stats.highBreak > plr.highBreak){
        plr.highBreak = plr1Stats.highBreak;
        plr1Doc.update(plr);
      }

      plr1DocSub.unsubscribe();
    })
  }
}
