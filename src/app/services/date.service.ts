import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public startDateStats = new Date(2019, 8, 1);

  constructor() {
  }

  public formatDate(date: Date): string {
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1;
    const year: number = date.getFullYear();

    return year + '-' + this.padNumber(month, 2) + '-' + this.padNumber(day, 2);
  }

  public padNumber(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
