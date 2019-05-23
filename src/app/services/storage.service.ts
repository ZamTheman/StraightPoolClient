import { Injectable } from '@angular/core';
import { GameState } from './game.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  items: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
      this.items = db.list('/users').valueChanges();
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
    this.db.list('users').push({'name': playerName});
  }

  public GetDbUserByName(playerName: string){
    let test =  this.db.list('users', ref => ref.orderByChild('name').equalTo(playerName)).snapshotChanges();

    return test;
  }
}
