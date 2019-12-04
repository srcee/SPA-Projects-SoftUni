import * as ctrl from './controllers.js'

const app = Sammy('#rooter', function() {
    this.use('Handlebars', 'hbs');

    //home
    this.get('/', ctrl.loadHome);
    this.get('/home', ctrl.loadHome);
    // login & logout
    this.get('/login', ctrl.getLogin);
    this.post('/login', ctrl.postLogin);
    this.get('/logout', ctrl.getLogout);
    // register
    this.get('/register', ctrl.getRegister);
    this.post('/register', ctrl.postRegister);
    // food details
    this.get('/details/:foodId', ctrl.getDetails);
    // share recipe
    this.get('/share', ctrl.getShare);
    this.post('/share', ctrl.postShare);
    // edit, like, delete recipe
    this.get('/edit/:foodId', ctrl.getEdit);
    this.post('/edit/:foodId', ctrl.postEdit);
    this.get('/likes/:foodId', ctrl.putLike)
    this.get('/archive/:foodId', ctrl.postDelete);


})
app.run()

