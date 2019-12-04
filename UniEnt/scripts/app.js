import * as ctrl from './controllers.js'

const app = Sammy('body', function() {

    this.use('Handlebars', 'hbs');
    this.get('#/', ctrl.loadHome)

    this.get('#/login', ctrl.getLogin);
    this.post('#/login', ctrl.postLogin);
    this.get('#/register', ctrl.getRegister);
    this.post('#/register', ctrl.postRegister);
    this.get('#/logout', ctrl.getLogout);

    this.get('#/create', ctrl.getCreate);
    this.post('#/create', ctrl.postCreate);

    this.get('#/details/:eventId', ctrl.getDetails);
    this.get('#/edit/:eventId', ctrl.getEdit);
    this.post('#/edit/:eventId', ctrl.postEdit);
    this.get('#/delete/:eventId', ctrl.postDelete);
    this.get('#/join/:eventId', ctrl.joinEvent);
    this.get('#/userProfile', ctrl.getUserProfile)

});

app.run();