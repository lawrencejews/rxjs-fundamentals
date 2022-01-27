import { fromEvent, merge, interval, concat, race, forkJoin } from 'rxjs';
import { mapTo, startWith, take, map } from 'rxjs/operators';
import {
  labelWith,
  startButton,
  pauseButton,
  setStatus,
  bootstrap,
} from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const isRunning$ = merge(start$, pause$).pipe(startWith(false));

isRunning$.subscribe(setStatus);

const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
// const combined$ = merge(first$, second$);                            // first come first serve basic of streaming.
const combined$ = concat(first$, second$);                            // Run first stream to completion then next stream.
// const combined$ = forkJoin(first$, second$)                       // forkJoin give an array of the last two elements.
bootstrap({ first$, second$, combined$ });