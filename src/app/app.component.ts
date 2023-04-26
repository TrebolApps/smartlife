import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

interface Goal {
  name: string;
  category: string;
}

interface ResponseData {
  [dayOfWeek: number]: {
    goals: Goal[];
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentDate: Date = new Date();
  schedule: any[] = [];
  excludedDays: number[] = [];
  selectedDayIndex: number | null = null;

  constructor(private http: HttpClient, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    }
  }

  ngOnInit(): void {
    this.fetchGoals();
  }

  handleDateChange() {
    this.fetchGoals();
    this.selectedDayIndex = null;
  }

  fetchGoals() {
    this.http.get<ResponseData>('https://aove-panel-back.herokuapp.com/smartlife-goal/getAllSmartlifeGoal/ ' + this.currentDate.toString()).subscribe(
      (response: ResponseData) => {
        const goals: any = response;
        console.log(`goals:`)
        console.log(goals);

        const schedule: any[] = [];
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
        for (let i = 0; i < 7; i++) {
          const dayOfWeek = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + i);
          const day = {
            name: goals[i].day,
            date: dayOfWeek.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            goals: goals[i]?.goals || []
          };
          schedule.push(day);
        }

        this.schedule = schedule;

      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getDateWeek() {
    const currentDate = new Date(this.currentDate);
    const year = currentDate.getFullYear();

    // Cálculo de la semana actual
    const onejan = new Date(year, 0, 1);
    const millisecsInDay = 86400000;
    const weekNumber = Math.ceil((((currentDate.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);

    const formattedDate = year + '-W' + weekNumber;
    console.log(`Week number: ${formattedDate}`);
    return formattedDate;
  }

  selectDay(index: number) {
    this.selectedDayIndex = index;
  }
}
