import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
// in local import 'moment'
// import * as moment from 'moment';
// in stackblitz import 'moment'
import moment from 'moment';
import { BehaviorSubject, timer, interval, observable, Observable, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public NowTime = new BehaviorSubject<string>(moment().format('HH:mm:ss'));
  public countTime: moment.Moment;
  public isBreak$ = new BehaviorSubject<boolean>(false);
  public isStart = false;
  private voice = new Audio();
  // public timer = timer(1000, 1000);
  // public NowTime = new Date();
  public timer = interval(1000);
  private sub: Subscription;
  private unSub = new Subject();

  public break = new BehaviorSubject<number>(5);
  public session = new BehaviorSubject<number>(25);

  constructor(public ref: ChangeDetectorRef) {
    // setInterval(() => {
    //   this.NowTime.next(moment().format('HH:mm:ss'));
    // }, 500);
    // this.ref.detectChanges();

    // import Voice
    this.voice.src = '../../assets/voice/knocking_an_iron_door3.mp3';
    this.voice.load();
    // show NowTime
    this.timer.subscribe(() => this.NowTime.next(moment().format('HH:mm:ss')));
  }

  public add(value: BehaviorSubject<number>): void {
    let temp = value.getValue();
    temp === 60 ? temp = 60 : value.next(++temp);
  }

  public subtract(value: BehaviorSubject<number>): void {
    let temp = value.getValue();
    temp === 1 ? temp = 1 : value.next(--temp);
  }

  public settime(): void {
    this.isStart = true;

    // const end = moment().hours(0).minutes(this.break.getValue()).seconds(0);
    // 若用this.countTime = end; 使用this.countTime.subtract() end 會一起被 subtract()

    this.countTime = moment().hours(0).minutes(this.session.getValue()).seconds(0);
    // this.sub =
    this.timer.pipe(takeUntil(this.unSub)).subscribe(() => {
      this.countTime.subtract(1, 's');
      // console.log(start.format('mm:ss'));
      if (this.countTime.format('mm:ss') === '00:00') {
        // play voice
        this.voice.play();

        if (this.isBreak$.getValue()) {
          this.countTime = moment().hours(0).minutes(this.session.getValue()).seconds(0);
          this.isBreak$.next(false);
        } else {
          this.countTime = moment().hours(0).minutes(this.break.getValue()).seconds(0);
          this.isBreak$.next(true);
        }
      }
    });

  }

  public cancel(): void {
    this.isStart = false;
    // this.sub.unsubscribe();
    this.unSub.next();
  }

  ngOnInit() {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.unsubscribe();
  }
}
