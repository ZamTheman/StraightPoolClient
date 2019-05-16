import { Injectable } from '@angular/core';
import { GameState } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public StoreGameState(gameState: GameState): void{
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  public GetGameState(): GameState{
    return JSON.parse(localStorage.getItem('gameState'));
  }
}
