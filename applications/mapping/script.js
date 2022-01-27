import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import { pluck, concatMap,mergeMap, take, map } from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

const character$ = of(1, 2, 3, 4).pipe(
  mergeMap((n) => from(getCharacter(n)))
);

character$.subscribe(render);
