angular.module('starter', ['ionic', 'ngCordova','starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('app.tasks', {
      url: '/tasks',
      views: {
        'tasks': {
          templateUrl: 'templates/tasks.html',
          controller: 'TasksController'
        }
      }
    })
    .state('app.task-detail', {
      url: '/tasks/:taskId',
      views: {
        'tasks': {
          templateUrl: 'templates/tasks-detail.html',
          controller: 'TasksDetailController'
        }
      }
    })

  .state('app.new-task', {
    url: '/new-task',
    views: {
      'new-task': {
        templateUrl: 'templates/new-task.html',
        controller: 'AdminTasksController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tasks');

});
