require("module-alias/register");
let express = require("express"),
    CreateAdPolicy = require("@policies/CreateAdPolicy"),
    DashboardController  = require("@controllers/user/DashboardController");

dashboardRouter = express.Router();
// Routes
dashboardRouter.get('/authorize/:email',DashboardController.reroute);
dashboardRouter.get('/home',DashboardController.index);
dashboardRouter.post('/create-ad',
    CreateAdPolicy.validate,
    DashboardController.createAds)
//exporting the dashboard module
module.exports = dashboardRouter;