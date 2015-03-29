'use strict';

/**
 * When set to the element, it will set an class to active.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.directive('toggleCheckbox', function () {
  return {
    require: ['ngModel'],
    link: function (scope, element, attrs, ctrls) {
      var ngModelCtrl = ctrls[0];

      ngModelCtrl.$render = function () {
        element.toggleClass('active', angular.equals(ngModelCtrl.$modelValue, true));
      };

      element.bind('click', function () {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(!element.hasClass('active'));
          ngModelCtrl.$render();
        });
      });
    }
  };
});