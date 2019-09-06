import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DateService} from './date.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient,
              private dateService: DateService) {
  }

  public getUsers() {
    return this.httpClient.get('http://alkosport.breitmuuufrosch.ch/api/users/read.php');
  }

  public getActivities(userId?: number, date?: string, from?: Date) {
    let fd: string;

    if (from !== undefined) {
      fd = this.dateService.formatDate(from);
    } else {
      fd = 'undefined';
    }

    let query = 'http://alkosport.breitmuuufrosch.ch/api/activities/read.php?';
    query += 'user_id=' + userId;
    query += '&date=' + date;
    query += '&from=' + fd;

    return this.httpClient.get(query);
  }

  public updateActivity(activityId: number, sum: number) {
    let query = 'http://alkosport.breitmuuufrosch.ch/api/activities/update.php?';
    query = query + 'activity_id=' + activityId;
    query += '&sum=' + sum;

    return this.httpClient.get(query);
  }

  public createActivity(userId: number, typeId: number, date: string, sum: number) {
    let query = 'http://alkosport.breitmuuufrosch.ch/api/activities/create.php?';
    query = query + 'user_id=' + userId;
    query += '&type_id=' + typeId;
    query += '&date=' + date;
    query += '&sum=' + sum;

    return this.httpClient.get(query);
  }
}
