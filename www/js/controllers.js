angular.module('starter.controllers', [])

.controller('TasksController', function($scope, Tasks, $ionicListDelegate, $cordovaCalendar, $location, $ionicModal, $ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $ionicModal.fromTemplateUrl('templates/modals/new-task.modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalNewtask = modal;
  });

  $scope.tasks = Tasks.all();

  $scope.reloadTasksList = function(){
    var today = new Date();
    $cordovaCalendar.listEventsInRange(
      today,
      today.setMonth(today.getMonth() + 1)
    ).then(function(result) {
      alert(JSON.stringify(result));
    }, function(err) {
      alert('err: ' + JSON.stringify(err));
    });
  };

  $scope.testeBolado = function(){
    var today = new Date();
    $cordovaCalendar.createEvent({
      title: 'Primeiro Evento',
      location: 'Trabalho',
      notes: 'Espero que funcione',
      startDate: today,
      endDate: today.setHours(0, 40, 0)
    }).then(function(result) {
      alert(JSON.stringify(result));
    }, function(err) {
      alert('err: ' + JSON.stringify(err));
    });
  };

  $scope.remove = function(chat) {
    Tasks.remove(chat);
  };

  $scope.fineshed = function(task){
    task.fineshed = !task.fineshed;
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.goToTask = function(taskId){
    $location.path('/app/tasks/' + taskId);
  };

  $scope.changePriority = function(task){
    $ionicPopup.show({
      title: 'Alterar prioridade',
      scope: $scope,
      buttons: [{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-energized',
        onTap: function(e) {
          console.log(JSON.stringify(e));
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-stable buttonPriorityMedium',
        onTap: function(e) {
          console.log(JSON.stringify(e));
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-assertive',
        onTap: function(e) {
          console.log(JSON.stringify(e));
        }
      }]
    });
  };
})

.controller('TasksDetailController', function($scope, $stateParams, Tasks, $location) {
  $scope.task = Tasks.get($stateParams.chatId);

  $scope.finishTask = function(task){
    task.fineshed = !task.fineshed;
    $location.path('/app/tasks');
  };
})

.controller('AdminTasksController', function($scope, Tasks, $location, $ionicPopup) {

  $scope.setDateToToday = function(){
    $scope.newTask = { startDate: new Date(), endDate: new Date() };
  };

  $scope.addNewTask = function(){
    var dataTask = angular.copy($scope.newTask);
    Tasks.add(dataTask);

    $scope.newTask.title = '';
    $scope.newTask.notes = '';
    $scope.setDateToToday();

    $location.path('/app/tasks');
  };

  $scope.testemichel = function(){
    alert('FUNFANDO');
  };

  $scope.createCategory = function() {
    $ionicPopup.show({
      template: '<input type="text" ng-model="teste" placeholder="Ex.: Trabalho">',
      title: 'Nome da nova categoria',
      subTitle: 'Use poucas palavras',
      scope: $scope,
      buttons: [{
        text: '<i class="icon ion-close"></i>'
      }, {
        text: '<i class="icon ion-checkmark"></i>',
        type: 'button-balanced',
        onTap: function(e) {
          console.log(JSON.stringify(e));
        }
      }]
    });
  };
});
