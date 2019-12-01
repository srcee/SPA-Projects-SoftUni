import  *  as  ctrl  from "./controllers.js";

(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');
        //home and about
        this.get('#/', ctrl.loadHome);
        this.get('#/home', ctrl.loadHome);
        this.get('#/about', ctrl.getAboutController);
        //login and logout
        this.get('#/login', ctrl.getLoginController);
        this.post('#/login', ctrl.postLoginController);
        this.get('#/logout', ctrl.getLogoutController);
        //register
        this.get('#/register', ctrl.getRegisterController);
        this.post('#/register', ctrl.postRegisterController);
        //catalog and teams details
        this.get('#/catalog', ctrl.getCatalogController)
        this.get('#/create', ctrl.getCreateController)
        this.post('#/create', ctrl.postCreateController);
        this.get('#/catalog/:teamId', ctrl.getTeamInfoController);
        this.get('#/join/:teamId', ctrl.getJoinController);
        this.get('#/leave/:teamId', ctrl.getLeaveController)        
    });
    app.run();
})()
