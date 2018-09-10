require("module-alias/register");
let express = require("express"),
    DashboardController  = require("@controllers/user/DashboardController");

dashboardRouter = express.Router();
// Routes
dashboardRouter.get('/authorize/:email',DashboardController.reroute);
dashboardRouter.get('/home',DashboardController.index);
//exporting the dashboard module
module.exports = dashboardRouter;