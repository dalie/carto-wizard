import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Duration } from 'luxon';
import { BehaviorSubject, timer } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators';

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

  constructor() {
    timer(0, 1000)
      .pipe(takeWhile(() => this.active))
      .subscribe({
        next: () => {
          this._elapsedTime$.next(this._elapsedTime$.value.plus(1000));
        },
      });
  }

  ngOnInit(): void {}
}
