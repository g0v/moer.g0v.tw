var incineratorCtrl = angular.module('moerControllers', [])
  .controller("IncineratorCtrl", ['$scope', '$http', function($scope, $http) {
    $scope.data = [];
    $scope.substance = 'NOx';
    $scope.reportDate = '2013-09';

    $http.get("data/incinerator-air-polution.json")
    .success(function(data) {
      var incinerators = {},
          reportDates = {};
      data.forEach(function (d) {
        incinerators[d.IncineratorName.trim()] = 1;
        reportDates[d.ReportDate] = 1;
      });
      $scope.data = data;
      $scope.incinerators = Object.keys(incinerators);
      $scope.reportDates = Object.keys(reportDates);
    })
    .error(function(data, status) {
      if (status == 404) {
        $scope.error = "Not found";
      } else {
        $scope.error = "Error: " + status;
      }
    });
  }])
  .directive('epaVisual', function() {

    var margin = {
      top: 20,
      bottom: 0,
      left: 0,
      right: 0
    };

    var limits = {
      NOx: 180,
      SOx: 80,
      COx: 120,
      HCl: 40,
      Dust: 81,
      Opacity: 10
    };

    var width = 640,
        barHeight = 25;

    var x = d3.scale.linear()
      .range([0, width]);

    var canvas = d3.select("epa-visual")
      .append("svg")
        .attr("class", "chart")
        .attr("width", width);

    var chart = canvas.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var limitLine = chart.append("line")
        .attr("class", "limit-line")
        .attr("y1", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    var limitMeasure = canvas.append("text")
        .attr("dx", "-1em")
        .attr("dy", ".9em");

    function drawPollutionBarChart(data, substance = "NOx") {

      x.domain([0, limits[substance] * 1.2]);

      var barSelection = chart.selectAll("g")
        .data(data);

      limitLine.attr("x1", x(limits[substance]))
          .attr("x2", x(limits[substance]))
          .attr("y2", barHeight * data.length);

      limitMeasure.text(limits[substance])
          .attr("transform", "translate(" + x(limits[substance]) + ",0)");

      barSelection.select("rect")
          .attr("width", function(d) { return x(+d[substance]); });
      barSelection.select("text.substance-value")
          .attr("x", function(d) { return x(+d[substance]) + 4; })
          .text(function(d) { return d[substance]; });

      barSelection.select("text.incinerator-name")
          .text(function(d) { return d.IncineratorName + " (" + d.ReportDate + ")"; });

      var bar = barSelection
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

      bar.append("rect")
          .attr("class", "bar")
          .attr("width", function(d) { return x(+d[substance]); })
          .attr("height", barHeight - 1);

      bar.append("text")
          .attr("class", "substance-value")
          .attr("x", function(d) { return x(+d[substance]) + 4; })
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d[substance]; });

      bar.append("text")
          .attr("class", "incinerator-name")
          .attr("x", 0)
          .attr("y", barHeight / 2)
          .attr("dx", ".2em")
          .attr("dy", ".35em")
          .text(function(d) { return d.IncineratorName + " (" + d.ReportDate + ")"; });

      barSelection
        .exit()
          .remove();
    }

    return {
      restrict: "E",
      scope: {
        data: '=',
        substance: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('data', function(newVal, oldVal) {
          if (!newVal) return;
          canvas.attr("height", barHeight * newVal.length + margin.top + margin.bottom);
          drawPollutionBarChart(newVal, scope.substance);
        });
        scope.$watch('substance', function(newVal, oldVal) {
          if (!newVal) return;
          scope.substance = newVal;
          drawPollutionBarChart(scope.data, newVal);
        });
      }
    };
  });
