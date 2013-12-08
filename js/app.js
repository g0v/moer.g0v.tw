angular.module('envDashboardApp', [
  'ngRoute',
  'envControllers'
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
