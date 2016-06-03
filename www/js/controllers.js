angular.module('starter.controllers', [])

.controller('TasksController', function($scope, $rootScope, Tasks, $state, $ionicListDelegate, $cordovaCalendar, $location, $ionicModal, $ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var today = new Date();

  function findTasks(){
    var oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    $cordovaCalendar.findEvent({
      startDate: new Date(
        oneWeekAgo.getFullYear(),
        oneWeekAgo.getMonth(),
        oneWeekAgo.getDate(),
        00, 01, 0, 0, 0),
      endDate: new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
        23, 59, 0, 0, 0)
    }).then(function(result) {
      $rootScope.tasks = result;
    }, function(err) {
      console.log('LogError - findTasks(): ' + JSON.stringify(err));
    });
  }

  // findTasks();
  $rootScope.tasks = Tasks.all();

  $ionicModal.fromTemplateUrl('templates/modals/new-task.modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalNewtask = modal;
  });

  $scope.reloadList = function(){
    findTasks();
    $state.go($state.current, {}, {reload: true});
  };

  $scope.removeTask = function(task, i) {
    var startDate = new Date(task.startDate),
        endDate = new Date(task.endDate);

    $cordovaCalendar.deleteEvent({
      newTitle: task.title,
      location: task.location,
      notes: task.message,
      startDate: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(), 0),
      endDate: new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes(), 0)
    }).then(function(result) {
      if(result){
        $rootScope.tasks.splice(i, 1);
      } else {
        alert('Ops, houve um problema ao remover. Tente novamente.');
      }
    }, function(err) {
      console.log('LogError - removeTask(): ' + JSON.stringify(err));
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
          task.priority = 1;
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-stable buttonPriorityMedium',
        onTap: function(e) {
          task.priority = 2;
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-assertive',
        onTap: function(e) {
          task.priority = 3;
        }
      }]
    });
    $ionicListDelegate.closeOptionButtons();
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
    $cordovaCalendar.createEvent({
      title: $scope.newTask.title,
      location: $scope.newTask.location,
      notes: $scope.newTask.notes,
      startDate: new Date(
        $scope.dateToFormat.startDate.getFullYear(),
        $scope.dateToFormat.startDate.getMonth(),
        $scope.dateToFormat.startDate.getDate(),
        $scope.dateToFormat.startHour,
        $scope.dateToFormat.startMinute, 0),
      endDate: new Date(
        $scope.dateToFormat.endDate.getFullYear(),
        $scope.dateToFormat.endDate.getMonth(),
        $scope.dateToFormat.endDate.getDate(),
        $scope.dateToFormat.endHour,
        $scope.dateToFormat.endMinute, 0)
    }).then(function(result) {
      $scope.modalNewtask.hide();
      $scope.reloadList();
    }, function(err) {
      console.log('LogError - saveNewTask(): ' + JSON.stringify(err));
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

.controller('TasksDetailController', function($scope, $rootScope, $stateParams, Tasks, $location, $ionicPopup) {
  // $scope.task = Tasks.get($stateParams.taskId, $rootScope.tasks);
  $scope.task = Tasks.get($stateParams.taskId);

  $scope.finishTask = function(task){
    task.fineshed = !task.fineshed;
    $location.path('/app/tasks');
  };

  $scope.confirmRemoveTask = function() {
    var confirm = $ionicPopup.confirm({
      title: 'Você realmente gostaria de deletar está tarefa?'
    });

    confirm.then(function(res) {
      if (res) {
        console.log('Sim');
      } else {
        console.log('Não');
      }
    });
  };

})

.controller('AdminTasksController', function() {});
