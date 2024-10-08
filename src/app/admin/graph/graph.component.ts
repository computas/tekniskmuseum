import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '@/app/shared/models/endpoints';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'graph-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CanvasJSAngularChartsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() year: string = ''; 
  data: any;
  render: boolean = false;
  chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Antall spilte spill"
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
      itemclick: function (e: any) {
        e.dataSeries.visible = typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible ? false : true;
      }
    },
    data: [{
      type: "line",
      name: "Antall spill",
      showInLegend: true,
      dataPoints: [] // Initialize with empty dataPoints
    }]
  };

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    // Triggered when the input property `year` changes
    if (this.year) {
      this.getDataList().subscribe({
        next: (res) => {
          this.data = res;
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
	const dataPoints = Object.entries(this.data).map(([month, scoreCount]) => ({
		x: new Date(+this.year, Number(month) - 1, 1), // Month is zero-based in JavaScript dates
		y: scoreCount
	  }));

	// Update chart options with new dataPoints
	this.chartOptions.data[0].dataPoints = dataPoints;

	console.log('Updated Chart Options:', this.chartOptions.data[0].dataPoints);
	
  }

  getDataList(): Observable<any> {
    // Fetch data based on the selected year
    return this.http.get<any>(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSCORESPERMONTH}?year=${this.year}`
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
