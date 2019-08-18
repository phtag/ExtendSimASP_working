const router = require('express').Router();
const userRoutes = require('./users');
const ExtendSimRoutes = require('./ExtendSim');

router.use('/users', userRoutes);
router.use('/ExtendSim', ExtendSimRoutes);

module.exports = router;
