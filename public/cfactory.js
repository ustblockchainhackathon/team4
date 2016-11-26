app.factory("cfactory",['$http', function($http) {
	var url = 'https://localhost';

	var interfaz = {

		getCandidates : function() {
			return $http.get(url).then(function(response) {
				return response.data;
			});
		},
	}
	return interfaz;
}]);