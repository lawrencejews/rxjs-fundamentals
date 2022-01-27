import { toArray } from 'lodash';
import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { skipUntil, takeUntil, scan } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

const counter$ = interval(1000).pipe(
  skipUntil(start$),
  scan((total) => total + 1, 0),
  takeUntil(pause$));

counter$.subscribe(setCount);