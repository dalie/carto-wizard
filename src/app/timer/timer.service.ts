import { Injectable } from '@angular/core';
import { Duration } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  time: Duration = Duration.fromMillis(0);

  constructor() {}
}
