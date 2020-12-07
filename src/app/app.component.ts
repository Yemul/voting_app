import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import * as io from "socket.io-client";
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  vote: number;
  socket: SocketIOClient.Socket;
  poll: any
  components: any[] = []

  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  
  ngOnInit() {
    this.poll = [];
    this.listenToEvents();
  }

  setupPieChart(data) {
    this.pieChartLabels = data.options.map((option) => option.text);
    this.pieChartData = data.options.map((option) => option.count);
    console.log(this.pieChartLabels);
    console.log(this.pieChartData);
  }

  listenToEvents() {
    this.socket.on("votes", data => {
      this.poll = data;
      this.components = data.options;
      this.setupPieChart(data);
    })

    this.socket.on("thank", msg => {
      alert(msg);
    })
  }

  onSelect(vote: number) {
    this.vote = vote;
  }

  castVote() {
    this.socket.emit("newVote", this.vote);
    this.vote = -1;  
  }

}
