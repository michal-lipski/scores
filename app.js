var app = angular.module('plunker', ['ngRoute', 'mongolabResourceHttp'], function($routeProvider) {

  $routeProvider
    .when('/list', {templateUrl:'list.html', controller:'ScoresListCtrl', resolve:{
      scores:function(Score){return Score.all();}
    }})
    
    .when('/edit/:id', {templateUrl:'form.html', controller:'ScoresFormCtrl', resolve:{
      score:function(Score, $route){return Score.getById($route.current.params.id);} 
    }})
    
    .when('/new', {templateUrl:'form.html', controller:'ScoresFormCtrl', resolve:{
      score:function(Score){return new Score();}
    }})
    
    .otherwise({redirectTo:'/list'});
  })

  .constant('MONGOLAB_CONFIG',{API_KEY:'fAFYHFX-zzbdaproNOZHu4tvqLVTq8Lw', DB_NAME:'scoring'})
  
  .factory('Score', function ($mongolabResourceHttp) {
    return $mongolabResourceHttp('scores');
  })
  
  .controller('ScoresListCtrl', function($scope, $location, scores) {
    
    $scope.scores = scores;
  })

  .controller('ScoresFormCtrl', function($scope, $location, score) {
  
    var scoreCopy = angular.copy(score);
    var changeSuccess = function() {
      $location.path('/list');
    };
    
    var changeError = function() {
      throw new Error('Sth went wrong...');
    };
    
    $scope.score = score;
    
    $scope.save = function(){
      $scope.score.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    
    $scope.remove = function() {
      $scope.score.$remove(changeSuccess, changeError);
    };
    
    $scope.hasChanges = function(){
      return !angular.equals($scope.score, scoreCopy);
    };
});
