import { getSessionInfo, getMemberInfo, createLoadPartials } from "./helpers.js";
import { post, get, put } from "./requester.js";

const partials = {
    header: './templates/common/header.hbs',
    footer: './templates/common/footer.hbs'
};
export function loadHome(ctx) {
    getSessionInfo(ctx);
    createLoadPartials.call(this, partials, 'home/home.hbs');
};
// get
export function getLoginController(ctx) {
    getSessionInfo(ctx);
    partials['loginForm'] = './templates/login/loginForm.hbs'

    createLoadPartials.call(this, partials, 'login/loginPage.hbs');
};
export function getAboutController(ctx) {
    getSessionInfo(ctx);

    createLoadPartials.call(this, partials, 'about/about.hbs');
};
export function getLogoutController(ctx) {
    sessionStorage.clear();
    ctx.redirect('#/home');
};
export function getRegisterController(ctx) {
    getSessionInfo(ctx);
    partials['registerForm'] = './templates/register/registerForm.hbs'

    createLoadPartials.call(this, partials, 'register/registerPage.hbs');
};
export function getCatalogController(ctx) {
    getSessionInfo(ctx);
    partials['team'] = './templates/catalog/team.hbs'
    get('appdata', 'teams', 'Kinvey')
        .then(data => {
            ctx.teams = data;
            createLoadPartials.call(this, partials, 'catalog/teamCatalog.hbs');
        });
}
export function getCreateController(ctx) {
    getSessionInfo(ctx);
    partials['createForm'] = './templates/create/createForm.hbs';

    createLoadPartials.call(this, partials, 'create/createPage.hbs');
};
export function getJoinController(ctx) {
    getSessionInfo(ctx);
    const id = ctx.params.teamId;
    get('appdata', `teams/${id}`, 'Kinvey')
        .then(teamInfo => {
            const newMember = { username: ctx.username }
            teamInfo.members.push(newMember);

            return put('appdata', `teams/${id}`, teamInfo, 'Kinvey');
        })
        .then(() => {
            ctx.redirect(`#/catalog/${id}`);
        });
};
export function getLeaveController(ctx) {
    getSessionInfo(ctx);
    const id = ctx.params.teamId;
    get('appdata', `teams/${id}`, 'Kinvey')
        .then(teamInfo => {
            const memberIdx = teamInfo.members
                .findIndex(x => x.username === ctx.username);

            teamInfo.members.splice(memberIdx, 1);

            return put('appdata', `teams/${id}`, teamInfo, 'Kinvey');
        })
        .then(() => {
            ctx.redirect(`#/catalog/${id}`);
        })
};
export function getTeamInfoController(ctx) {
    const id = ctx.params.teamId;
    get('appdata', `teams/${id}`, 'Kinvey')
        .then((data) => {
            getSessionInfo(ctx)
            ctx.teamId = data._id;
            ctx.members = data.members;
            ctx.name = data.name;
            ctx.comment = data.comment;
            ctx.isOnTeam = getMemberInfo(ctx);
            partials['teamMember'] = './templates/catalog/teamMember.hbs';
            partials['teamControls'] = './templates/catalog/teamControls.hbs';

            createLoadPartials.call(this, partials, 'catalog/details.hbs');
        })
        .catch(console.error)
};
// post
export function postRegisterController(ctx) {
    const { username, password, repeatPassword } = ctx.params;
    if (password === repeatPassword) {
        try {
            post('user', '', { username, password }, 'Basic')
                .then(() => ctx.redirect('#/login'))
        } catch (err) {
            alert(err)
        }
    } else {
        alert('Passwords does not match.')
    }
};
export function postLoginController(ctx) {
    const { username, password } = ctx.params;
    try {
        post('user', 'login', { username, password }, 'Basic')
            .then(userInfo => {
                sessionStorage.setItem('userId', userInfo._id)
                sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
                sessionStorage.setItem('username', userInfo.username);
                ctx.redirect('#/home');
            })
            .catch(console.error)
    } catch (err) {
        console.log(err)
    }
};
export function postCreateController(ctx) {
    const info = ctx.params;
    info.members = [{ username: sessionStorage.getItem('username') }];
    try {
        post('appdata', 'teams', info, 'Kinvey')
            .then(() => ctx.redirect('#/catalog'))
            .catch(console.log)
    } catch (err) {
        console.log(err);
    }
};
