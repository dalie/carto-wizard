import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Duration } from 'luxon';
import { BehaviorSubject, timer } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators';
import { TimerService } from './timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {
  private _elapsedTime$ = new BehaviorSubject<Duration>(Duration.fromMillis(0));

  @Input()
  active = false;

  elapsedTime$ = this._elapsedTime$.asObservable();

  constructor(private _timer: TimerService) {
    timer(0, 10)
      .pipe(takeWhile(() => this.active))
      .subscribe({
        next: () => {
          const duration = this._elapsedTime$.value.plus(10);
          this._elapsedTime$.next(duration);
          this._timer.time = duration;
        },
      });
  }

  ngOnInit(): void {}
}
