const router = require('express').Router();
const ExtendSimController = require('../../controllers/ExtendSimController');

router.route('/getserverscenariofolders').post(ExtendSimController.getserverscenariofolders);
router.route('/getserverextendmodelsrootdirectory').post(ExtendSimController.getserverextendmodelsrootdirectory);
router.route('/getserverscenariofolderdirectory').post(ExtendSimController.getserverscenariofolderdirectory);
router.route('/getserverscenariofolderdirectories').post(ExtendSimController.getserverscenariofolderdirectories);
router.route('/getmodeldatabases').post(ExtendSimController.getmodeldatabases);
router.route('/getmodeldatabasetables').post(ExtendSimController.getmodeldatabasetables);
router.route('/getmodeldatabasetablefields').post(ExtendSimController.getmodeldatabasetablefields);
router.route('/getmodelinfo').post(ExtendSimController.getmodelinfo);
router.route('/getdialogvariabledata').post(ExtendSimController.getdialogvariabledata);
router.route('/getUserModelPaths').post(ExtendSimController.getUserModelPaths);
router.route('/createScenarioFolder').post(ExtendSimController.createScenarioFolder);
router.route('/copyModelToScenarioFolder').post(ExtendSimController.copyModelToScenarioFolder);
router.route('/getfile').post(ExtendSimController.getfile);
router.route('/uploadmodelfile').post(ExtendSimController.uploadmodelfile);
router.route('/sendfile').post(ExtendSimController.sendfile);
router.route('/sendmodelpathname').post(ExtendSimController.sendmodelpathname);
router.route('/sendmodelfile').post(ExtendSimController.sendmodelfile);
router.route('/senddatastream').post(ExtendSimController.senddatastream);
router.route('/senddialogvariabledata').post(ExtendSimController.senddialogvariabledata);
router.route('/submitsimulationscenariotoblock').post(ExtendSimController.submitsimulationscenariotoblock);
router.route('/submitsimulationscenario').post(ExtendSimController.submitsimulationscenario);
router.route('/checkmodelrunstatus').post(ExtendSimController.checkmodelrunstatus);
router.route('/getscenariorundetails').post(ExtendSimController.getscenariorundetails);
router.route('/getdatabasetablecontentsstream').post(ExtendSimController.getdatabasetablecontentsstream);
router.route('/removescenariofolder').post(ExtendSimController.removescenariofolder);
module.exports = router;
