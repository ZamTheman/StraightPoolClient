import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { StartComponent } from './components/start/start.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { GameComponent } from './components/game/game.component';
import { GameService } from './services/game.service';

const appRoutes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'gamemenu', component: GameMenuComponent },
  { path: 'game', component: GameComponent },
  { path: '', redirectTo: '/start', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    GameMenuComponent,
    GameComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
