angular.module('starter.services', [])

// .factory('Tasks', function() {
//   var tasks = [{
//       id: 0,
//       title: 'Prova de Desenvolvimento Web',
//       startDate: new Date(),
//       endDate: new Date(),
//       location: 'Unicarioca - Rio Comprido',
//       notes: 'DETALHE PARA UM CARALHOW',
//       finished: false,
//       priority: 2,
//       category: 'Casa'
//   },
//   {
//       id: 1,
//       title: 'Comprar pão quando voltar para casa',
//       startDate: new Date(),
//       endDate: new Date(),
//       location: 'Ilha do Governador',
//       notes: 'DETALHE PARA UM CARALHOW',
//       finished: false,
//       priority: 1,
//       category: 'Casa'
//   },
//   {
//       id: 2,
//       title: 'Ligar para o banco',
//       startDate: new Date(),
//       endDate: new Date(),
//       notes: 'DETALHE PARA UM CARALHOW',
//       finished: false,
//       priority: 3,
//       category: 'Casa'
//   },
//   {
//       id: 3,
//       title: 'Terminar o projeto',
//       startDate: new Date(),
//       endDate: new Date(),
//       location: 'Av. Rio Branco - Centro',
//       notes: 'DETALHE PARA UM CARALHOW',
//       finished: false,
//       priority: 3,
//       category: 'Casa'
//   }];

//   return {
//     all: function() {
//       return tasks;
//     },
//     add: function(newTask) {
//       tasks.length > 0 ? newTask.id = parseInt(tasks[tasks.length - 1].id) + 1 : newTask.id = 0;
//       newTask.finished = false;
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