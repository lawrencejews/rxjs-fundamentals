import StateCore from 'markdown-it/lib/rules_core/state_core';
import { fromEvent, of, timer, merge, NEVER, interval } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

// const start$ = fromEvent(startButton, 'click').mapTo(true);
// const pause$ = fromEvent(pauseButton, 'click').mapTo(false);

// const counter1$ = merge(start$, pause$).pipe(
//   switchMap(shouldIBeRunning => {
//     if (shouldIBeRunning) {
//       return interval(1000)
//     }
//     else {
//       NEVER;
//     }
//   }),

//   scan((total) => total + 1, 0), 
// )

// counter$.subscribe(setCount);

const endpoint = 'http://localhost:3333/api/facts';

const fetchData = () => {
    return fromFetch(endpoint).pipe(
      tap(clearError),
      mergeMap(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Something went wrong')
      }
    }),
      retry(4),
      catchError((error) => {
        console.warn(error);
        return of({ error: error.message });
      }),
    );
}

const fetch$ = fromEvent(startButton, 'click').mapTo(true);
const stop$ = fromEvent(stopButton, 'click').mapTo(false);

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap(shouldFetch => {
    if (shouldFetch) {
      return timer(0, 5000).pipe(
        tap(() => clearError()),
        tap(() => clearFacts()),
        exhaustMap(fetchData)
      )
    } else {
      return NEVER;
    }
  })
)

factStream$.subscribe(addFacts);