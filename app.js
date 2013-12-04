
var epaIncineratorApp = angular.module("epaIncineratorApp", []);

epaIncineratorApp.controller("ChartCtrl", function($scope, $http) {
  $scope.data = [];
  $scope.substance = 'NOx';

  $http.get("incinerator-air-polution.json")
  .success(function(data) {
    $scope.data = data;
  })
  .error(function(data, status) {
    if (status == 404) {
      $scope.error = "Not found";
    } else {
      $scope.error = "Error: " + status;
    }
  });
});

epaIncineratorApp.directive('epaVisual', function() {

  var width = 960,
      barHeight = 25;

  var x = d3.scale.linear()
    .range([0, width]);

  var chart = d3.select("epa-visual")
    .append("svg")
    .attr("class", "chart")
    .attr("width", width);

  function drawBarChart(data, substance = "NOx") {

    var scales = {
      "NOx": 200,
      "SOx": 20
    };

    x.domain([0, scales[substance]]);

    var barSelection = chart.selectAll("g")
      .data(data);

    barSelection.select("rect")
      .attr("width", function(d) { return x(+d[substance]); });
    barSelection.select("text.substance-value")
      .attr("x", function(d) { return x(+d[substance]) - d[substance].length * 9; })
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
      .attr("x", function(d) { return x(+d[substance]) - d[substance].length * 9; })
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

    barSelection.exit()
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
        var data = newVal;
        if (!data) {
          return;
        }
        chart.attr("height", barHeight * data.length);
        drawBarChart(data, scope.substance);
      });
      scope.$watch('substance', function(newVal, oldVal) {
        if (!newVal) {
          return;
        }
        scope.substance = newVal;
        drawBarChart(scope.data, newVal);
      });
    }
  };
});
