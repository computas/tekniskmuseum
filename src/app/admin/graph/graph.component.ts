import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '@/app/shared/models/endpoints';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface DataPoint {
  x: Date;
  y: number;
}

type ScoresPerMonthResponse = Record<string, number>;

@Component({
  selector: 'app-graph-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CanvasJSAngularChartsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() year = ''; 
  dataList: Record<string, number> = {};
  render = false;
  chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Statistikk for året "
    },
    axisX: {
      valueFormatString: "MMM",
      intervalType: "month",
      interval: 1
    },
    axisY: {
      title: "Antall spilte spill",
      suffix: ""
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: { dataSeries: { visible: boolean; }; }) {
        e.dataSeries.visible = typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible ? false : true;
      }
    },
    data: [{
      type: "line",
      name: "Antall spill",
      showInLegend: true,
      dataPoints: [] as DataPoint[]
    }]
  };

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.year) {
      this.getDataList().subscribe({
        next: (res) => {
          this.dataList = res;
          this.updateChartData();
		  this.render = true;
        },
        error: (err) => {
          console.error('Failed to get data from backend', err);
        }
      });
    }
  }

  updateChartData() {
    const dataPoints: DataPoint[] = Object.entries(this.dataList).map(([month, scoreCount]) => ({
      x: new Date(+this.year, Number(month) - 1, 1),
      y: Number(scoreCount)
    }));

	this.chartOptions.data[0].dataPoints = dataPoints;
  this.chartOptions.title.text += this.year;

	
  }

  getDataList(): Observable<ScoresPerMonthResponse> {
    return this.http.get<ScoresPerMonthResponse>(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSCORESPERMONTH}?year=${this.year}`,
      {
        withCredentials: true,
      }
    );
  }

  ngOnDestroy(): void {
	  this.render = false;
  }

  ngAfterViewInit(): void {
    const canvasChart = this.el.nativeElement.querySelector('canvasjs-chart');
    if (canvasChart) {
      this.renderer.setStyle(canvasChart, 'width', '100%');
      this.renderer.setStyle(canvasChart, 'height', '400px');
    }
  }

}
