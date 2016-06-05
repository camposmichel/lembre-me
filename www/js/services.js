angular.module('starter.services', [])

// .factory('Tasks', function() {
//   var tasks = [{
//       id: 0,
//       title: 'TESTE 1',
//       startDate: new Date(),
//       endDate: new Date(),
//       location: 'Unicarioca - Rio Comprido',
//       notes: 'DETALHE PARA UM CARALHOW',
//       fineshed: false,
//       priority: 2,
//       category: 'Casa'
//   }];

//   return {
//     all: function() {
//       return tasks;
//     },
//     add: function(newTask) {
//       tasks.length > 0 ? newTask.id = parseInt(tasks[tasks.length - 1].id) + 1 : newTask.id = 0;
//       newTask.fineshed = false;
//       tasks.push(newTask);
//     },
//     remove: function(chat) {
//       tasks.splice(tasks.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < tasks.length; i++) {
//         if (tasks[i].id === parseInt(chatId)) {
//           return tasks[i];
//         }
//       }
//       return null;
//     }
//   };
// });
.service('Tasks', function() {
  this.get = function(taskId, tasks){
    for (var i = 0; i < tasks.length; i++) {
      if(parseInt(tasks[i].id) === parseInt(taskId)) {
        return tasks[i];
      }
    }
  };
});