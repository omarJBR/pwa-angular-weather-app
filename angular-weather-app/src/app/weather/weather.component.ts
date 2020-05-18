import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import * as L from 'leaflet';
declare var jQuery: any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent implements OnInit {
  apidata: any = {};
  errorMsg: any;
  country: any;
  lat: any;
  lon: any;
  date: any = [];
  daily_temps: any = [];
  daily_times: any = [];
  hourly_temps: any = [];
  hourly_times: any = [];
  meet: any;
  feet: number;
  zone: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.lat = this.route.snapshot.params.lat;
    this.lon = this.route.snapshot.params.lon;
    this.get_weather_data(this.lat, this.lon);
  }

  // For highcharts
  public daily_highchart_options: any = {
    chart: {
      type: 'area',
      backgroundColor: 'none',
      height: 250,
      color: 'white'
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: ""
      }
    },
    plotOptions: {
      area: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: false
      }
    },
    tooltip: {
      valueSuffix: " °C"
    },
    series: [
      {
        name: '',
        data: []
      }
    ]
  };
  public hourly_highchart_options: any = {
    chart: {
      type: 'area',
      backgroundColor: 'none',
      height: 250,
      color: 'white'
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: ""
      }
    },
    plotOptions: {
      area: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: false
      }
    },
    tooltip: {
      valueSuffix: " °C"
    },
    series: [
      {
        name: '',
        data: []
      }
    ]
  };
  show_daily() {
    (function ($) {
      $("#daily-container").css("display", "block")
      $("#hourly-container").css("display", "none")
      $(".hourly-btn").removeClass(" active-summary");
      $(".daily-btn").addClass(" active-summary");
    })(jQuery);
  }
  show_hourly() {
    (function ($) {
      $("#daily-container").css("display", "none")
      $("#hourly-container").css("display", "block")
      $(".hourly-btn").addClass(" active-summary")
      $(".daily-btn").removeClass(" active-summary")
    })(jQuery);
  }

  // For elevation data
  get_elevation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      this.get_elevation_data(this.lat, this.lon);
    }
    );
  }
  get_elevation_data(lat: any, lon: any) {
    this.apiService.get_elevation_data(lat, lon).subscribe((data) => {
      (function ($) {
        $('.get-elevation-btn').attr({ 'disabled': 'disabled', 'title': 'reload page' });
        $('.get-elevation-btn').css({ 'cursor': 'not-allowed', 'opacity': '0.5' });
        $('.load-circle,.loading-data').css('display', 'block');
        document.body.scrollTop = 1200;
        document.documentElement.scrollTop = 1200;
      })(jQuery);
      setTimeout(() => {
        (function ($) {
          $('.load-circle,.loading-data').css('display', 'none');
        })(jQuery);
        this.apidata = data;
        this.meet = Math.round(this.apidata.elevations[0].elevation);
        this.feet = ((this.apidata.elevations[0].elevation) * 3.28);
      }, 2000);
    },
      (error) => this.errorMsg = error
    );
  }
  feet_to_meter() {
    var meters = this.meet;
    (function ($) {
      $('.altitude-value').hide();
      $('.meter-value').removeAttr("title");
      $('.feet-value').attr("title", "Click here to feet value.")
      $('.feet-or-meter-value').html("" + meters + " Meter");
      $('.meter-value').css('color', 'silver');
      $('.feet-value').css('color', '#c0c0c087');
    })(jQuery);
  }
  meter_to_feet() {
    var feets = Math.round(this.feet);
    (function ($) {
      $('.altitude-value').hide();
      $('.feet-value').removeAttr("title");
      $('.meter-value').attr("title", "Click here to meter value.")
      $('.feet-or-meter-value').html("" + feets + " Feet");
      $('.feet-value').css('color', 'silver');
      $('.meter-value').css('color', '#c0c0c087');
    })(jQuery);
  }

  // For temperature data at user's loaction
  get_current_position() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      window.location.replace("/" + this.lat + "/" + this.lon + "")
    }
    );
  }

  // For user's location at the map
  get_map_location() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      (function ($) {
        $('.get-map-btn').attr({ 'disabled': 'disabled', 'title': 'reload page' });
        $('.get-map-btn').css({ 'cursor': 'not-allowed', 'opacity': '0.5' });
        $('.map-load-circle,.map-loading-data').css('display', 'block');
        document.body.scrollTop = 2200;
        document.documentElement.scrollTop = 2200;
      })(jQuery);
      setTimeout(() => {
        (function ($) {
          $('.map-load-circle,.map-loading-data').css('display', 'none');
          $('#map').css('display', 'block');
          document.body.scrollTop = 2200;
          document.documentElement.scrollTop = 2200;
        })(jQuery);
        var map = L.map('map', { drawControl: true }).setView([this.lat, this.lon], 13);
        L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map)
        L.marker([this.lat, this.lon]).bindPopup("<b>You are here.").addTo(map).openPopup();
      }, 2000);
    }
    );
  }


  get_weather_data(lat = 31.963158, lon = 35.930359) {
    this.apiService.get_weather_data(lat, lon).subscribe((data) => {
      this.apidata = data;
      this.zone = this.apidata.timezone;
      // For name of days
      for (let i = 0; i < 6; i++) {
        this.date.push(new Date(this.apidata.daily.data[i].time * 1000).toDateString().slice(0, 10))
      }
      // For hourly and daily highcahrts
      for (var i = 0; i <= 23; i = i + 3) {
        this.daily_temps.push(Math.round((this.apidata.hourly.data[i].temperature - 32) * (5 / 9)));
        this.daily_times.push(new Date(this.apidata.hourly.data[i].time * 1000).toTimeString().slice(0, 2));
      }
      for (i = 0; i <= 23; i++) {
        this.hourly_temps.push(Math.round((this.apidata.hourly.data[i].temperature - 32) * (5 / 9)));
        this.hourly_times.push(new Date(this.apidata.hourly.data[i].time * 1000).toTimeString().slice(0, 2));
      }
      // Highcharts 
      this.daily_highchart_options.xAxis['categories'] = this.daily_times;
      this.daily_highchart_options.series[0]['data'] = this.daily_temps;
      this.hourly_highchart_options.xAxis['categories'] = this.hourly_times;
      this.hourly_highchart_options.series[0]['data'] = this.hourly_temps;
      Highcharts.chart('daily-container', this.daily_highchart_options);
      Highcharts.chart('hourly-container', this.hourly_highchart_options);
      (function ($) {
        $(".highcharts-yaxis-grid,.highcharts-yaxis-labels,.highcharts-legend-item,.highcharts-credits,.highcharts-axis-line").css("display", "none")
        $(".highcharts-text-outline,.highcharts-graph").css("stroke", "none")
        $(".highcharts-area").css("fill", "#c0c0c087")
        $(".highcharts-point").css("fill", "#e2dfdf")
        $("text").css("fill", "white")
      })(jQuery);
      if (lat == 31.963158) {
        this.country = 'Amman';
      } else if (lat == 29.531919) {
        this.country = 'Aqaba';
      } else if (lat == 32.551445) {
        this.country = 'Irbid';
      } else if (lat == 32.332687) {
        this.country = 'Ajloun';
      } else if (lat == 32.280818) {
        this.country = 'Jerash';
      } else if (lat == 32.342891) {
        this.country = 'Al Mafraq';
      } else {
        this.country = "" + this.zone + "";
      }
      (function ($) {
        $('.change-summary,.elevation-and-map').css('display', 'block');
      })(jQuery);
    },
      (error) => this.errorMsg = error
    );
  }
}
