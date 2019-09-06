import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from '../services/api.service';
import {CookieService} from 'ngx-cookie-service';
import {DateService} from '../services/date.service';

@Component({
  selector: 'app-enter-current-day',
  templateUrl: './enter-current-day.component.html',
  styleUrls: ['./enter-current-day.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnterCurrentDayComponent implements OnInit {
  users = undefined;
  activeButtons = {
    alcohol: {key: 1, name: 'Alcohooooool, wyter so!', active: true},
    sport: {key: 2, name: 'Sport, mau chli brämse...', active: true}
  };
  total = {1: 0, 2: 0};
  dataEntries = {1: undefined, 2: undefined};
  allDataEntries = {};

  selectedDate: Date = undefined;
  selectedUser: string = undefined;
  selectedUserInt: number = undefined;

  dateClass = (d: Date) => this.getDayCssClass(d);

  constructor(private matSnackBar: MatSnackBar,
              private apiService: ApiService,
              private dateService: DateService,
              private cookieService: CookieService) {
    this.selectedDate = new Date();
  }

  ngOnInit() {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;

      if (this.cookieService.check('selected_user')) {
        this.selectedUser = this.cookieService.get('selected_user');
        this.selectedUserInt = Number(this.selectedUser);
      }

      this.loadActivities();
    });
  }

  userChanged($event) {
    this.cookieService.set('selected_user', $event.value);
    this.selectedUser = $event.value;
    this.selectedUserInt = Number(this.selectedUser);

    this.loadActivities();
  }

  dateChanged($event) {
    this.selectedDate = $event.value;

    this.loadActivities();
  }

  loadActivities() {
    const newTotal = {1: 0, 2: 0};
    const newDataEntries = {1: undefined, 2: undefined};

    if (this.selectedUser === undefined) {
      this.total = newTotal;
      this.dataEntries = newDataEntries;
      return;
    }

    this.apiService.getActivities(this.selectedUserInt, this.dateService.formatDate(this.selectedDate)).subscribe((data) => {
      // @ts-ignore
      data.forEach((obj) => {
        newTotal[obj.type_id] = Number(obj.sum);
        newDataEntries[obj.type_id] = obj;
      });
    }, () => {
      this.total = newTotal;
      this.dataEntries = newDataEntries;
    }, () => {
      this.total = newTotal;
      this.dataEntries = newDataEntries;
    });

    this.loadAllActivities();
  }

  loadAllActivities() {
    this.allDataEntries = {1: {}, 2: {}};

    if (this.selectedUser === undefined) {
      return;
    }

    this.apiService.getActivities(this.selectedUserInt, undefined).subscribe((data) => {
      // @ts-ignore
      data.forEach((obj) => {
        this.allDataEntries[obj.type_id][obj.date] = obj.sum > 0;
      });
    });
  }

  selectActivity(value) {
    value.active = false;
    this.total[value.key] += 1;
    const total = this.total[value.key];

    if (this.dataEntries[value.key]) {
      this.apiService.updateActivity(this.dataEntries[value.key].id, total).subscribe(
        () => {
          this.loadActivities();
          value.active = true;
        }
      );
    } else {
      const userId = this.selectedUserInt;
      const typeId = value.key;
      const date = this.dateService.formatDate(this.selectedDate);
      this.apiService.createActivity(userId, typeId, date, total).subscribe(
        () => {
          this.loadActivities();
          value.active = true;
        }
      );
    }

    this.matSnackBar.open(value.name, '', {
      duration: 2000,
    });
  }

  resetDay() {
    if (this.dataEntries[1]) {
      this.apiService.updateActivity(this.dataEntries[1].id, 0).subscribe(
        () => this.loadActivities()
      );
    }
    if (this.dataEntries[2]) {
      this.apiService.updateActivity(this.dataEntries[2].id, 0).subscribe(
        () => this.loadActivities()
      );
    }
  }

  getDayCssClass(d: Date) {
    const fDate = this.dateService.formatDate(d);
    const hasAlcohol = this.allDataEntries[1][fDate] === true;
    const hasSport = this.allDataEntries[2][fDate] === true;

    if (hasAlcohol && hasSport) {
      return 'date-both';
    }
    if (hasAlcohol) {
      return 'date-alcohol';
    }
    if (hasSport) {
      return 'date-sport';
    }

    return undefined;
  }

}
