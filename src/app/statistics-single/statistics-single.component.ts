import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {CookieService} from 'ngx-cookie-service';
import {DateService} from '../services/date.service';

@Component({
  selector: 'app-statistics-single',
  templateUrl: './statistics-single.component.html',
  styleUrls: ['./statistics-single.component.scss']
})
export class StatisticsSingleComponent implements OnInit {
  users = undefined;

  total = {1: 0, 2: 0};
  selectedUser: string = undefined;
  selectedUserInt: number = undefined;

  constructor(private apiService: ApiService,
              private dateService: DateService,
              private cookieService: CookieService) {
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

  loadActivities() {
    this.total[1] = 0;
    this.total[2] = 0;

    this.apiService.getActivities(this.selectedUserInt, undefined, this.dateService.startDateStats).subscribe((data) => {
      // @ts-ignore
      data.forEach((obj) => {
        this.total[obj.type_id] += Number(obj.sum);
      });
    });
  }
}
