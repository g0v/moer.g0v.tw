angular.module('moerDashboardApp', [
  'ngRoute',
  'moerControllers'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/incinerator', {
        templateUrl: 'partials/incinerator-air.html',
        controller: 'IncineratorAirChartCtrl'
      })
      .otherwise({
        redirectTo: '/incinerator'
      });
  }]);
