angular.module('starter.controllers', [])

.controller('TasksController', function($scope, $rootScope, Tasks, $state, $ionicListDelegate, $cordovaCalendar, $location, $ionicModal, $ionicPopup, $cordovaSQLite) {
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  if(!db) console.log('LogError - DATABASE NOT FOUND');

  $scope.categorySelected = 'Todas';

  function saveTasksOnDB(task){
    $cordovaSQLite.execute(db,
      'INSERT INTO tasks (id, finished, priority, category) VALUES (?,?,?,?)',
      [task.id, task.finished, task.priority, task.category])
    .then(function(result) {
      console.log('saveTasksOnDB: ' + JSON.stringify(result));
    }, function(error) {
      console.error('LogError - saveTasksOnDB(): ' + error);
    });
  }

  function processList(list){
    if (list.length) {
      $cordovaSQLite.execute(db, 'SELECT * FROM tasks').then(function(result) {
        if (result.rows.length) {
          for (var x = 0; x < list.length; x++) {
            for (var y = 0; y < result.rows.length; y++) {
              if (parseInt(list[x].id) === parseInt(result.rows.item(y).id)) {
                list[x].priority = result.rows.item(y).priority;
                list[x].finished = result.rows.item(y).finished === 'true';
                list[x].category = result.rows.item(y).category;
                break;
              } else if (y === result.rows.length-1) {
                list[x].priority = 1;
                list[x].finished = false;
                list[x].category = '';
                saveTasksOnDB(list[x]);
              }
            }
          }
        } else {
          for (var i = 0; i < list.length; i++) {
            if (!list[i].priority) list[i].priority = 1;
            if (!list[i].finished) list[i].finished = false;
            if (!list[i].category) list[i].category = '';
            saveTasksOnDB(list[i]);
          }
        }
        return list;
      }, function(err) {
        console.log('LogError - getSavedTasks(): ' + err);
      });
    } else {
      return [];
    }
  }

  function findTasks(categoryId){
    console.log('------------------------------------------------ findTasks()');
    var today = new Date();
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
    }).then(function(list) {
      $cordovaSQLite.execute(db, 'SELECT * FROM tasks').then(function(result) {
        if (result.rows.length) {
          for (var x = 0; x < list.length; x++) {
            for (var y = 0; y < result.rows.length; y++) {
              // console.log(list[x].id + ' - ' + result.rows.item(y).id);
              if (parseInt(list[x].id) === parseInt(result.rows.item(y).id)) {
                list[x].priority = parseInt(result.rows.item(y).priority);
                list[x].finished = result.rows.item(y).finished === 'true';
                list[x].category = result.rows.item(y).category;
                break;
              } else if (y === result.rows.length-1) {
                list[x].priority = 1;
                list[x].finished = false;
                list[x].category = categoryId;
                saveTasksOnDB(list[x]);
              }
            }
          }
        } else {
          for (var i = 0; i < list.length; i++) {
            if (!list[i].priority) list[i].priority = 1;
            if (!list[i].finished) list[i].finished = false;
            if (!list[i].category) list[i].category = '';
            saveTasksOnDB(list[i]);
          }
        }

        $rootScope.tasks = list;
        if($rootScope.copyTasks) $rootScope.copyTasks = list;
        // console.log(JSON.stringify($rootScope.tasks));
      }, function(err) {
        console.log('LogError - findTasks() 1: ' + err);
      });
      // ---------------
      // A função processList() deve ser usada para retonar a lista de tarefas atualizada
      // Porém esta demorando para retornar o valor do banco e por isso rootScope é declarado undefined
      // Pesquisar sobre callbacks em angular e funções sincronas.
      // Temporariamente toda a funcionalidade de processList ficara dentro do retorno de findTask()
      // ---------------
      // $rootScope.tasks = processList(result);
      // console.log('rootScope: ' + JSON.stringify($rootScope.tasks));
    }, function(err) {
      console.log('LogError - findTasks() 2: ' + err);
    });
  }

// ================================================================================================================
  findTasks();
  // $rootScope.tasks = Tasks.all();
// ================================================================================================================

  function updateOneFieldTask(id, field, data){
    $cordovaSQLite.execute(db,
      'UPDATE tasks SET '+ field +' = ? WHERE id = ?',
      [data, id])
    .then(function(result) {}, function(error) {
      console.error('updateOneFieldTask(): ' + error);
    });
  }

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
        $scope.reloadList();
      } else {
        alert('Ops, houve um problema ao remover. Tente novamente.');
      }
    }, function(err) {
      console.log('LogError - removeTask(): ' + err);
    });
  };

  $scope.finished = function(task){
    task.finished = !task.finished;
    updateOneFieldTask(task.id, 'finished', task.finished);
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.goToTask = function(taskId, index){
    $location.path('/app/tasks/' + taskId + '/' + index);
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
          updateOneFieldTask(task.id, 'priority', 1);
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-stable buttonPriorityMedium',
        onTap: function(e) {
          task.priority = 2;
          updateOneFieldTask(task.id, 'priority', 2);
        }
      },{
        text: '<i class="icon ion-arrow-graph-up-right"></i>',
        type: 'button-assertive',
        onTap: function(e) {
          task.priority = 3;
          updateOneFieldTask(task.id, 'priority', 3);
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

  $scope.openModalNewTask = function() {
    $cordovaSQLite.execute(db, 'SELECT * FROM category').then(function(result) {
      var arr = [];
      if (result.rows.length) {
        for (var a = 0; a < result.rows.length; a++) {
          arr.push({
            id: result.rows.item(a).id,
            title: result.rows.item(a).title
          });
        }
      }
      $scope.categoryList = arr;
      $scope.modalNewtask.show();
    }, function(err) {
      console.log('LogError - openModalNewTask(): ' + err);
    });
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
      // INSERIR REFERENCIA NO BANCO ==============================================
      $scope.modalNewtask.hide();
      findTasks($scope.newTask.category);
      $state.go($state.current, {}, {reload: true});
      // ==========================================================================
    }, function(err) {
      console.log('LogError - saveNewTask(): ' + err);
    });
  };

  function getCategoryList(){
    $cordovaSQLite.execute(db, 'SELECT * FROM category').then(function(result) {
      var arr = [];
      if (result.rows.length) {
        for (var a = 0; a < result.rows.length; a++) {
          arr.push({
            id: result.rows.item(a).id,
            title: result.rows.item(a).title
          });
        }
      }
      console.log('retornando...');
      return arr;
    }, function(err) {
      console.log('LogError - getCategoryList(): ' + err);
    });
  }

  function showPopupSelectCategory(){
    $scope.popupSelectCategory = $ionicPopup.show({
      templateUrl: 'templates/popups/select-category.popup.html',
      title: 'Selecione uma categoria',
      scope: $scope,
      buttons: [{
        text: '<i class="icon ion-plus"></i>',
        type: 'button-stable',
        onTap: function(e) {
          $scope.createCategory();
        }
      }]
    });
  }

  $scope.listCategory = function(){
    $cordovaSQLite.execute(db, 'SELECT * FROM category').then(function(result) {
      var arr = [];
      if (result.rows.length) {
        for (var a = 0; a < result.rows.length; a++) {
          arr.push({
            id: result.rows.item(a).id,
            title: result.rows.item(a).title
          });
        }
      }
      $scope.categoryList = arr;
      showPopupSelectCategory();
    }, function(err) {
      console.log('LogError - listCategory(): ' + err);
    });
  };

  $scope.createCategory = function() {
    $scope.newCategory = {};
    $ionicPopup.show({
      template: '<input type="text" ng-model="newCategory.name" placeholder="Ex.: Trabalho" autofocus>',
      title: 'Nome da nova categoria',
      subTitle: 'Use poucas palavras',
      scope: $scope,
      buttons: [{
        text: '<i class="icon ion-close"></i>'
      }, {
        text: '<i class="icon ion-checkmark"></i>',
        type: 'button-balanced',
        onTap: function(e) {
          if($scope.newCategory.name){
            $cordovaSQLite.execute(db,
              'INSERT INTO category (title) VALUES (?)', [$scope.newCategory.name])
            .then(function(result) {
              if(parseInt(result.rowsAffected) === 1){
                $scope.categoryList.push({
                  id: result.insertId,
                  title: $scope.newCategory.name
                });
              }
            }, function(err) {
              console.log('LogError - createCategory(): ' + err);
            });
          } else {
            e.preventDefault();
          }
        }
      }]
    });
  };

  $scope.confirmEditCategory = function(category){
    category.editNow = false;
    $cordovaSQLite.execute(db,
      'UPDATE category SET title = ? WHERE id = ?',
      [category.title, category.id])
    .then(function(result) {}, function(error) {
      console.error('LogError - confirmEditCategory(): ' + error);
    });
  }

  $scope.deleteCategory = function(category, i){
    category.deleteNow = false;
    $scope.categoryList.splice(i, 1);
    $cordovaSQLite.execute(db,
      'DELETE FROM category WHERE id = ?',
      [category.id])
    .then(function(result) {}, function(error) {
      console.error('LogError - deleteCategory(): ' + error);
    });
  };

  $scope.listAllTasksToCategory = function(category){
    if($rootScope.copyTasks) $rootScope.tasks = angular.copy($rootScope.copyTasks);
    else $rootScope.copyTasks = angular.copy($rootScope.tasks);

    if (category === null) {
      $scope.categorySelected = 'Todas';
      findTasks();
    } else {
      $scope.categorySelected = category.title;
      var arr = [];
      for (var a = 0; a < $rootScope.tasks.length; a++) {
        if(parseInt($rootScope.tasks[a].category) === parseInt(category.id)) {
          arr.push($rootScope.tasks[a]);
        }
      }

      $rootScope.tasks = arr;
    }

    $scope.popupSelectCategory.close();
  };

  // FUNCTIONS DEBUG
  $scope.logTasksToDebug = function(){
    $cordovaSQLite.execute(db, 'SELECT * FROM tasks').then(function(result) {
        if (result.rows.length) {
          for (var y = 0; y < result.rows.length; y++) {
            console.log(result.rows.item(y).id + ' - ' +
              result.rows.item(y).finished + ' - ' +
              result.rows.item(y).priority + ' - ' +
              result.rows.item(y).category + ' - ' +
              result.rows.item(y).globalCategory);
          }
        }
      }, function(err) {
        console.log('LogError - logTasksToDebug(): ' + err);
      });
  };

})

.controller('TasksDetailController', function($scope, $rootScope, $stateParams, Tasks, $location, $ionicPopup, $ionicModal, $cordovaCalendar, $cordovaSQLite) {
  $scope.task = Tasks.get($stateParams.taskId, $rootScope.tasks);
  // $scope.task = Tasks.get($stateParams.taskId);

  $ionicModal.fromTemplateUrl('templates/modals/copy-task.modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCopyTask = modal;
  });

  $scope.copyTask = angular.copy($scope.task);
  var startDate = new Date($scope.copyTask.startDate);
  var endDate = new Date($scope.copyTask.endDate);

  $scope.dateToFormat = {
    startDate: startDate,
    startHour: startDate.getHours(),
    startMinute: startDate.getMinutes(),
    endDate: endDate,
    endHour: endDate.getHours(),
    endMinute: endDate.getMinutes()
  };

  function updateOneFieldTask(id, field, data){
    $cordovaSQLite.execute(db,
      'UPDATE tasks SET '+ field +' = ? WHERE id = ?',
      [data, id])
    .then(function(result) {}, function(error) {
      console.error('updateOneFieldTask(): ' + error);
    });
  }

  $scope.finishTask = function(task){
    task.finished = !task.finished;
    updateOneFieldTask(task.id, 'finished', task.finished);
    $location.path('/app/tasks');
  };

  $scope.confirmRemoveTask = function() {
    var confirm = $ionicPopup.confirm({
      title: 'Você realmente gostaria de deletar está tarefa?',
      cancelText: '<i class="icon ion-close"></i>',
      okText: '<i class="icon ion-android-delete"></i>',
      okType: 'button-assertive'
    });

    confirm.then(function(res) {
      if (res) {
        var dataInicio = new Date($scope.task.startDate),
            dataFim = new Date($scope.task.endDate);

        $cordovaCalendar.deleteEvent({
          newTitle: $scope.task.title,
          location: $scope.task.location,
          notes: $scope.task.message,
          startDate: new Date(
            dataInicio.getFullYear(),
            dataInicio.getMonth(),
            dataInicio.getDate(),
            dataInicio.getHours(),
            dataInicio.getMinutes(), 0),
          endDate: new Date(
            dataFim.getFullYear(),
            dataFim.getMonth(),
            dataFim.getDate(),
            dataFim.getHours(),
            dataFim.getMinutes(), 0)
        }).then(function(result) {
          if (result) {
            $rootScope.tasks.splice($stateParams.indexList, 1);
            $location.path('/app/tasks');
          } else {
            alert('Ops, houve um problema ao deletar está tarefa. Tente novamente.');
          }
        }, function(err) {
          console.log('LogError - confirmRemoveTask(): ' + err);
        });
      }
    });
  };

  // Modal functions
  $scope.showModalCopyTask = function(type) {
    $scope.actionType = {
      title: type === 'edit' ? 'Editar Tarefa' : 'Copiar Tarefa',
      type: type
    };
    $scope.modalCopyTask.show();
  };
})

.controller('AdminTasksController', function() {});
