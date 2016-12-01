app.directive('sumoInput', ['$compile', '$timeout', function ($compile, $timeout) {
	return {
		restrict: 'A',
		require: '^ngModel',
		scope: {
			ngModel: '=',
			options: '='
		},
		compile: function (element) {
			var el = document.createElement('ul');
			el.className = 'dropdown hidden';
			el.setAttribute('ng-show', 'filteredOptions.length');
			el.innerHTML = '<li ng-repeat="option in filteredOptions track by $index" ng-click="selectOption(option)" ng-mouseover="settings.hoveredOption = $index" ng-class="{hovered: settings.hoveredOption === $index}">{{option}}</li>';

			element.after(el);

			var siblingLink = $compile(el);
			var dropdown = angular.element(el);

			return function link(scope, element, attrs, ngModelCtrl) {
				siblingLink(scope);

				scope.settings = {
					hoveredOption: 0
				};

				element.on('focus', function () {
					showDropdown();
				}).on('blur', function (e) {
					$timeout(function () {
						hideDropdown();
					}, 200);
				}).on('keydown click', function (e) {
					showDropdown();
					if (e.keyCode === 13 && scope.filteredOptions.length) { // enter
						e.preventDefault();

						scope.selectOption(scope.filteredOptions[scope.settings.hoveredOption]);
						hideDropdown();
					}
					else if (e.keyCode === 27) { // esc
						e.preventDefault();

						hideDropdown();
					}
					else if (e.keyCode === 38) { // up
						if (scope.settings.hoveredOption > 0) {
							scope.settings.hoveredOption--;
						} else {
							scope.settings.hoveredOption = scope.filteredOptions.length - 1;
						}
					}
					else if (e.keyCode === 40) { // down
						if (scope.settings.hoveredOption < scope.filteredOptions.length - 1) {
							scope.settings.hoveredOption++;
						} else {
							scope.settings.hoveredOption = 0;
						}
					}
					scope.$apply();
				});

				scope.selectOption = function (option) {
					scope.ngModel = option;
				};

				function showDropdown() {
					dropdown.removeClass('hidden');
				}

				function hideDropdown() {
					dropdown.addClass('hidden');
				}

				function isValidOption() {
					return scope.options.indexOf(scope.ngModel) >= 0;
				}

				scope.$watch('ngModel', function (model) {
					scope.filteredOptions = scope.options.filter(function (option) {
						return option.toLowerCase().indexOf(model.toLowerCase()) === 0;
					});

					if (scope.filteredOptions.length === 0 || isValidOption()) {
						scope.filteredOptions = scope.options;
					}

					scope.settings.hoveredOption = 0;
				});

				scope.validate = function (overrideValidity) {
					var valid = isValidOption() || overrideValidity || false;
					ngModelCtrl.$setValidity(attrs.errorKey, valid);
					return valid;
				};

				angular.element(element[0].form).on('submit', function (event) {
					if (!scope.validate()) {
						event.preventDefault();
					}
					scope.$apply();
				});

				element.on('focus', function () {
					scope.validate(true);
				});
			};
		}
	};
}]);