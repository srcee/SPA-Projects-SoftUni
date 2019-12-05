import { post, get, put, del } from "./requester.js";
import { getData, saveAndRedirect, removeUser } from "./storage.js";

function createLoadPartials(template, ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    })
        .partial(`../templates/${template}`);
};
function isLogged(ctx) {
    let x = getData('userInfo') !== null;
    if (x) {
        ctx.isLogged = x;
        ctx.username = JSON.parse(getData('userInfo')).username;
    }
    return ctx;
}

// home page
export function loadHome(ctx) {
    let newCtx = isLogged(ctx);
    if (newCtx.isLogged) {
        get('appdata', 'causes', 'Kinvey')
            .then(data => {
                newCtx.events = data;
                createLoadPartials('home/home.hbs', newCtx);
            })
    } else {
        createLoadPartials('home/home.hbs', newCtx);
    }
};

// login & logout
export function getLogin(ctx) {
    createLoadPartials('user/login.hbs', ctx);
};
export function postLogin(ctx) {
    const { username, password } = ctx.params;
    try {
        post('user', 'login', { username, password }, 'Basic')
            .then(userInfo => {
                saveAndRedirect(ctx, '#/', userInfo);
            })
            .catch(console.error)
    } catch (err) {
        console.log(err)
    }
};
export function getLogout(ctx) {
    try {
        post('user', '_logout', {}, 'Kinvey')
            .then(() => {
                removeUser();
                ctx.redirect('#/');
            })
    } catch (err) {
        console.log(err)
    }
};

// register
export function getRegister(ctx) {
    createLoadPartials('user/register.hbs', ctx);
};
export function postRegister(ctx) {
    const { username, password, rePassword } = ctx.params;
    if (password === rePassword) {
        try {
            post('user', '', { username, password }, 'Basic')
                .then((userInfo) => {
                    saveAndRedirect(ctx, '#/', userInfo)
                })
        } catch (err) {
            console.log(err);
        }
    } else {
        alert('Passwords does not match.')
    }
};
// cause details
export function getDetails(ctx) {
    let newCtx = isLogged(ctx);
    get('appdata', `causes/${ctx.params.causeId}`, 'Kinvey')
        .then((data) => {
            data.neededFunds = Number(data.neededFunds).toFixed(2);
            newCtx.cause = data;
            get('user', `${data._acl.creator}`)
                .then(data => {
                    newCtx.isAuthor = newCtx.username === data.username;
                    createLoadPartials('details/details.hbs', newCtx);
                })
        })
        .catch(console.error)
};
// create cause
export function getCreate(ctx) {
    let newCtx = isLogged(ctx);
    createLoadPartials('operations/create.hbs', newCtx);
};
export function postCreate(ctx) {
    post('appdata', 'causes', {
        ...ctx.params,
        donors: [],
        collectedFunds: 0
    })
        .then(() => {
            ctx.redirect('#/');
        })
};
// show dashboard with all causes
export function getDashboard(ctx) {
    let newCtx = isLogged(ctx);
    try {
        get('appdata', 'causes', 'Kinvey')
        .then(data => {
            newCtx.cause = data;
            createLoadPartials('dashboard/causes.hbs', newCtx);
        })
    } catch(err) {
        console.log(err)
    }
}
// donate for cause
export function postDonate(ctx) {
    const { currentDonation, causeId } = ctx.params;
    try {
        get('appdata', `causes/${causeId}`)
        .then(data => {
            ctx.username = JSON.parse(getData('userInfo')).username;
            data.collectedFunds = Number(currentDonation) + Number(data.collectedFunds);
            if(data.donors.findIndex(x => x === ctx.username) === -1) {
                data.donors.push(ctx.username);          
            }
            put('appdata', `causes/${causeId}`, { ...data })
                .then(() => ctx.redirect(`#/details/${causeId}`))
        })
    } catch (err) {
        console.log(err)
    }
};
// close cause
export function postClose(ctx) {
    try {
        del('appdata', `causes/${ctx.params.causeId}`)
            .then(() => ctx.redirect('#/'));
    } catch (err) {
        console.log(err);
    }
};
// TODO notifications