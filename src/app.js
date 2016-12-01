var app = angular.module('sumo', []);

app.controller('AppController', ['$scope', function ($scope) {
	$scope.selectedTeam = '';
	$scope.selectedEmployee = '';

	$scope.data = [
		{team: 'Engineering', employees: ['Lawana Fan', 'Larry Rainer', 'Rahul Malik', 'Leah Shumway']},
		{team: 'Executive', employees: ['Rohan Gupta', 'Ronda Dean', 'Robby Maharaj']},
		{team: 'Finance', employees: ['Caleb Brown', 'Carol Smithson', 'Carl Sorensen']},
		{team: 'Sales', employees: ['Ankit Jain', 'Anjali Maulingkar']}
	];

	$scope.teams = $scope.data.map(function (team) {
		return team.team;
	});

	var employees = [];
	$scope.employeesInTeam = function (teamName) {
		employees.length = 0;
		var team = $scope.data.filter(function (team) {
			return team.team === teamName;
		})[0];

		if (team && team.employees) {
			employees.push.apply(employees, team.employees);
		}

		return employees;
	};

	$scope.cancel = function () {
		if ($scope.dialog.$dirty) {
			return confirm('Are you sure you want to close this form?');
		}
	};

	$scope.submitForm = function () {
		if ($scope.dialog.$valid) {
			// post this data somewhere
			var data = {
				employee: $scope.selectedEmployee,
				team: $scope.selectedTeam,
				sendWelcomeEmail: $scope.sendWelcomeEmail
			};
			console.log(data);

			return alert('Submitted');
		}
	};
}]);