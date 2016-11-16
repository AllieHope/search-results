/**
* Main AngularJS Web Application
*/
var app = angular.module('snappCarApp', [
'ngRoute'
]);

/**
* Helper functions
*/

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}

$.fn.stars = function() {
    return this.each(function(i,e){$(e).html($('<span/>').width($(e).text()*16));});
};

/**
* Configure the Routes
*/
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        // results page
        .when("/", {templateUrl: "partials/results.html", controller: "ResultsCtrl"});
}]);


/**
 * Controls the Search Results
 */
app.controller('ResultsCtrl', function ($scope) {
    var rawResults, currPage;
    if(!$scope.currPage) {
        $scope.currPage = 1;
    }
    currPage = $scope.currPage;
    
    function renderResults(page){
        var resultsURL = 'https://api.snappcar.nl/assessment/search/page/'+page;
        var xhr = createCORSRequest('GET', resultsURL);
        if (!xhr) {
            throw new Error('Error CORS not supported');
        }
        xhr.onload = function(){
            var responseText = xhr.responseText;
            rawResults = JSON.parse(responseText);
            $scope.results = rawResults.results;
            $(document).scrollTop(0);
            $scope.$apply();
            $('.stars').stars();
        };
        xhr.send();
        if(page === 1){
            $("li.previous > a").hide();
            $("li.next > a").show();
        }
        else {
            $("li.previous > a").show();
            $("li.next > a").hide();
        }
    }

    $("li.next > a").bind("click", function(){
        $scope.currPage++;
        renderResults($scope.currPage);
    });
    $("li.previous > a").bind("click", function(){
        $scope.currPage--;
        renderResults($scope.currPage);
    });
    
    renderResults($scope.currPage);

});

