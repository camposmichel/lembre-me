angular.module('starter.controllers', [])

.controller('TasksController', function($scope, Tasks, $ionicListDelegate, $cordovaCalendar, $location) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.tasks = Tasks.all();
  $scope.remove = function(chat) {
    Tasks.remove(chat);
  };

  $scope.fineshed = function(task){
    task.fineshed = !task.fineshed;
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.listCalendars = function() {
    $cordovaCalendar.listCalendars().then(function(result) {
      alert(JSON.stringify(result));
    }, function(err) {
      alert('err' + JSON.stringify(err));
    });
  };

  $scope.testemichel = function(){
    alert('OK');
  };

  $scope.goToTask = function(taskId){
    $location.path('/app/tasks/' + taskId);
  };
})

.controller('TasksDetailController', function($scope, $stateParams, Tasks) {
  $scope.task = Tasks.get($stateParams.chatId);
})

.controller('AdminTasksController', function($scope, Tasks, $location) {

  $scope.setDateToToday = function(){
    $scope.newTask = { startDate: new Date(), endDate: new Date() };
  };

  $scope.addNewTask = function(){
    var dataTask = angular.copy($scope.newTask);
    Tasks.add(dataTask);

    $scope.newTask.title = '';
    $scope.newTask.details = '';
    $scope.setDateToToday();

    $location.path('/app/tasks');
  };
});
