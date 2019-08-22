const router = require('express').Router();
const ExtendSimController = require('../../controllers/ExtendSimController');

router.route('/getserverextendmodelsrootdirectory').post(ExtendSimController.getserverextendmodelsrootdirectory);
router.route('/getmodeldatabases').post(ExtendSimController.getmodeldatabases);
router.route('/getmodeldatabasetables').post(ExtendSimController.getmodeldatabasetables);
router.route('/getmodeldatabasetablefields').post(ExtendSimController.getmodeldatabasetablefields);
router.route('/getmodelinfo').post(ExtendSimController.getmodelinfo);
router.route('/getUserModelPaths').post(ExtendSimController.getUserModelPaths);
router.route('/createScenarioFolder').post(ExtendSimController.createScenarioFolder);
router.route('/copyModelToScenarioFolder').post(ExtendSimController.copyModelToScenarioFolder);
router.route('/sendfile').post(ExtendSimController.sendfile);
router.route('/senddatastream').post(ExtendSimController.senddatastream);
router.route('/senddialogvariabledata').post(ExtendSimController.senddialogvariabledata);
router.route('/submitsimulationscenario').post(ExtendSimController.submitsimulationscenario);
router.route('/checkmodelrunstatus').post(ExtendSimController.checkmodelrunstatus);
router.route('/getdatabasetablecontentsstream').post(ExtendSimController.getdatabasetablecontentsstream);

module.exports = router;
