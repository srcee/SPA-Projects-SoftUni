import * as ctrl from './controllers.js'

const app = Sammy('body', function() {

    this.use('Handlebars', 'hbs');
    //home page
    this.get('#/', ctrl.loadHome)
    //login and logout
    this.get('#/login', ctrl.getLogin);
    this.post('#/login', ctrl.postLogin);
    this.get('#/logout', ctrl.getLogout);
    //register
    this.get('#/register', ctrl.getRegister);
    this.post('#/register', ctrl.postRegister);
    //create cause
    this.get('#/create', ctrl.getCreate);
    this.post('#/create', ctrl.postCreate);
    //show dashboard with all causes
    this.get('#/dashboard', ctrl.getDashboard)
    //cause details
    this.get('#/details/:causeId', ctrl.getDetails);
    //donate for cause
    this.post('#/edit/:causeId', ctrl.postDonate);
    //close cause
    this.get('#/delete/:causeId', ctrl.postClose);

});

app.run('#/');