/**
 * Created by jenniferparker on 6/15/14.
 */

(function() {

    var scotchTodo = angular.module("scotchTodo", []);

    var mainController = function($scope, $http) {
        $scope.formData = {};

        //when landing on the page, get all todos and show them
        $http.get('/api/todos')
            .success(function(data){
                $scope.todos = data;
            })
            .error(function(data){
            });

        //when submitting the add form, send the text to the node API
        $scope.createTodo = function() {
            $http.post('/api/todos', $scope.formData)
                .success(function(data){
                    $scope.formData = {};
                    $scope.todos = data;
                })
                .error(function(data){
                });
        };

        $scope.deleteTodo = function(id){

            var todo_id = id.substring(1);
            var url = '/api/todos/' + todo_id;

          $http.delete(url)
              .success(function(data){
                  $scope.todos = data;
                  console.log(data);

              })
              .error(function(data){
                  console.log(data);
              });
        };

    };

    scotchTodo.controller("mainController", ["$scope", "$http", mainController]);
}());