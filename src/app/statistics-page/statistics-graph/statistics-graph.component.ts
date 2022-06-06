import { Component, Input, OnInit } from '@angular/core';
import { Point, UsageReport } from '../../core/statistics/models/usage-report.model';
import { Observable, of } from 'rxjs';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { map } from 'rxjs/operators';
import { getRemoteDataPayload, getFirstSucceededRemoteData } from '../../core/shared/operators';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
// add UdeM 2022 | import chart library
import * as Highcharts from 'highcharts';

@Component({
  selector: 'ds-statistics-graph',
  templateUrl: './statistics-graph.component.html',
  styleUrls: ['./statistics-graph.component.scss']
})
export class StatisticsGraphComponent implements OnInit {
  /**
   * The usage report to display a statistics table for
   */
  @Input()
  report: UsageReport;

  /**
   * Boolean indicating whether the usage report has data
   */
  hasData: boolean;

  /**
   * The table headers
   */
  headers: string[];

  optionsGraphique: any = { };

  xAxis: any = {};

  constructor( protected dsoService: DSpaceObjectDataService,
               protected nameService: DSONameService) { }

   ngOnInit(): void {
    this.hasData = this.report.points.length > 0;
    if (this.hasData) {
      this.headers = Object.keys(this.report.points[0].values);

      this.xAxis.tickmarkPlacement = 'on';
      this.xAxis.title = {
        enabled: false
      };
          let i = 0;
          const arraySeriesViews= [];
          const arraySeriesTel= [];
          this.optionsGraphique.title = { text: null };
          this.optionsGraphique.credits = {enabled: false };
          this.optionsGraphique.yAxis = { min: 0, title: { text: null, align: 'high'} };
          this.optionsGraphique.plotOptions = { bar: { dataLabels: { enabled: true } } };
          this.xAxis.categories = [];

            for (const point of this.report.points) {
              // console.log(point.label);
              this.xAxis.categories[i] = point.label;
              /* tslint:disable:no-string-literal */
              arraySeriesViews.push(point.values['views']);
              arraySeriesTel.push(0);
              i++;
            }
            this.optionsGraphique.series = [
              { name:'Visualisations',data: arraySeriesViews }
              // ,{ name:'Téléchargements',data: arraySeriesTel }
              ];
            this.optionsGraphique.Chart = { type: 'area', height: '300' };

            this.optionsGraphique.xAxis = this.xAxis;

            // console.log(this.optionsGraphique);

            Highcharts.chart(this.report.reportType, this.optionsGraphique);

    }

  }

  /**
   * Get the row label to display for a statistics point.
   * @param point the statistics point to get the label for
   */
  getLabel(point: Point): Observable<string> {
    switch (this.report.reportType) {
      case 'TotalVisits':
        return this.dsoService.findById(point.id).pipe(
          getFirstSucceededRemoteData(),
          getRemoteDataPayload(),
          map((item) => this.nameService.getName(item)),
        );
      case 'TopCities':
      case 'topCountries':
      default:
        return of(point.label);
    }
  }

}
