import { Game } from './game';

export class Player {
    constructor(
        public Id: string = '',
        public name: string = '',
        public Games: Game[] = null,
        public HighestBreak: number = 0
    ) {}
}
