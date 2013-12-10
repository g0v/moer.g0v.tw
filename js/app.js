angular.module('envDashboardApp', [
  'ngRoute',
  'envControllers'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/incinerator', {
        templateUrl: 'partials/incinerator.html',
        controller: 'IncineratorCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
