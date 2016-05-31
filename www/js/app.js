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

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

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
      url: '/tasks/:chatId',
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
