// move.service.ts
import { Injectable } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class MoveService {
  constructor() { }

  getMoveAnimation() {
    return trigger('move', [
      state('left', style({
        transform: 'translateX(0)'
      })),
      state('right', style({
        transform: 'translateX(calc(100vw - 100px))'
      })),
      transition('left <=> right', [
        animate('1s')
      ])
    ]);
  }
}
