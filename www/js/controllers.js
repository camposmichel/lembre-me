angular.module('starter.controllers', [])

.controller('TasksController', function($scope, Tasks, $state, $ionicListDelegate, $cordovaCalendar, $location, $ionicModal, $ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // $scope.tasks = Tasks.all();
  var today = new Date();
  $cordovaCalendar.findEvent({
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0, 0, 0)
  }).then(function(result) {
    // console.log(JSON.stringify(result));
    $scope.tasks = result;
  }, function(err) {
    console.log('LIST - ERROR: ' + JSON.stringify(err));
  });

  $ionicModal.fromTemplateUrl('templates/modals/new-task.modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalNewtask = modal;
  });

  $scope.reloadList = function(){
    $state.go($state.current, {}, {reload: true});
  };

  $scope.removeTask = function(task) {
    console.log('REMOVE: ' + JSON.stringify(task));

    // var teste1 = new Date(task.startDate);
    // var teste2 = new Date(task.endDate);
    // var teste3 = new Date(2016, 5, 2, 12, 40, 25);
    // var teste4 = new Date(2016, 5, 2, 12, 40, 25);

    // console.log(task.startDate + ' - ' + typeof(task.startDate));
    // console.log(task.endDate + ' - ' + typeof(task.endDate));
    // console.log(teste1 + ' - ' + typeof(teste1));
    // console.log(teste2 + ' - ' + typeof(teste2));
    // console.log(teste3 + ' - ' + typeof(teste3));
    // console.log(teste4 + ' - ' + typeof(teste4));

    $cordovaCalendar.deleteEvent({
      newTitle: task.title,
      location: task.location,
      notes: task.message,
      startDate: new Date(2016, 5, 2, 15, 40, 0),
      endDate: new Date(2016, 5, 2, 16, 40, 0)
    }).then(function(result) {
      console.log('REMOVE: ' + JSON.stringify(result));
      $state.reload();
    }, function(err) {
      console.log('REMOVE - ERROR: ' + JSON.stringify(err));
    });
    // alert('em dev...');
  };

  $scope.testeBolado = function(){
    // var today = new Date();
    $cordovaCalendar.createEvent({
      title: 'UNICO',
      location: 'UNICO',
      notes: 'UNICO',
      startDate: new Date(),
      endDate: new Date()
    }).then(function(result) {
      console.log(JSON.stringify(result));
      $state.go($state.current, {}, {reload: true});
    }, function(err) {
      console.log('err: ' + JSON.stringify(err));
    });
  };

  $scope.findTask = function(){
    // endDate é mandatório
    $cordovaCalendar.findEvent({
      endDate: new Date(2016, 5, 3, 11, 0, 0, 0, 0)
    }).then(function(result) {
      console.log(JSON.stringify(result));
    }, function(err) {
      console.log('err: ' + JSON.stringify(err));
    });
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
          console.log(e);
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-stable buttonPriorityMedium',
        onTap: function(e) {
          console.log(e);
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-assertive',
        onTap: function(e) {
          console.log(e);
        }
      }]
    });
  };

  // Modal functions
  $scope.newTask = {};
  $scope.dateToFormat = {
    startDate: new Date(),
    startHour: 00,
    startMinute: 00,
    endDate: new Date(),
    endHour: 00,
    endMinute: 00
  };

  $scope.saveNewTask = function(){
    console.log(JSON.stringify($scope.newTask));
    console.log(JSON.stringify($scope.dateToFormat));
    $cordovaCalendar.createEvent({
      title: $scope.newTask.title,
      location: $scope.newTask.location,
      notes: $scope.newTask.notes,
      startDate: new Date(2016, 5, 2, 15, 40, 0),
      endDate: new Date(2016, 5, 2, 16, 40, 0)
    }).then(function(result) {
      console.log('SAVE: ' + JSON.stringify(result));
      $scope.modalNewtask.hide();
      $state.reload();
    }, function(err) {
      console.log('SAVE - ERROR: ' + JSON.stringify(err));
    });
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
          console.log(e);
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

.controller('AdminTasksController', function() {});
