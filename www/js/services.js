angular.module('starter.services', [])

.factory('Tasks', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var tasks = [{
    id: 0,
    title: 'TESTE 1',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 1',
    fineshed: true,
    priority: 2
  }, {
    id: 1,
    title: 'TESTE 2',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 2',
    fineshed: false,
    priority: 3
  }, {
    id: 2,
    title: 'TESTE 3',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 3',
    fineshed: false,
    priority: 1
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }, {
    id: 3,
    title: 'TESTE 4',
    startDate: new Date(),
    endDate: new Date(),
    details: 'TESTE 4',
    fineshed: false,
    priority: 2
  }];

  return {
    all: function() {
      return tasks;
    },
    add: function(newTask) {
      tasks.length > 0 ? newTask.id = parseInt(tasks[tasks.length - 1].id) + 1 : newTask.id = 0;
      newTask.fineshed = false;
      tasks.push(newTask);
    },
    remove: function(chat) {
      tasks.splice(tasks.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(chatId)) {
          return tasks[i];
        }
      }
      return null;
    }
  };
});
