import  *  as  ctrl  from "./controllers.js";

(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');
        this.get('#/', ctrl.loadHome);
        this.get('#/home', ctrl.loadHome);

        this.get('#/about', ctrl.getAboutController);
        this.get('#/login', ctrl.getLoginController);
        this.get('#/logout', ctrl.getLogoutController)
        this.get('#/register', ctrl.getRegisterController);
        this.post('#/register', ctrl.postRegisterController);
        this.post('#/login', ctrl.postLoginController);
        this.get('#/catalog', ctrl.getCatalogController)
        this.get('#/create', ctrl.getCreateController)
        this.post('#/create', ctrl.postCreateController);
        this.get('#/catalog/:teamId', ctrl.getTeamInfoController);
        this.get('#/join/:teamId', ctrl.getJoinController);
        this.get('#/leave/:teamId', ctrl.getLeaveController)        
    });
    app.run();
})()