'use strict';


angular.module('deckApp.serverGroup.configure.aws')
  .controller('gceServerGroupLoadBalancersCtrl', function(modalWizardService) {
    modalWizardService.getWizard().markClean('load-balancers');
    modalWizardService.getWizard().markComplete('load-balancers');

  });