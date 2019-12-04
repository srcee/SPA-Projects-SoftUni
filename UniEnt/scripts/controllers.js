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
        get('appdata', 'events', 'Kinvey')
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
            alert(err)
        }
    } else {
        alert('Passwords does not match.')
    }
};
// user profile
export function getUserProfile(ctx) {
    let newCtx = isLogged(ctx);
    get('appdata', 'events', 'Kinvey')
    .then(data => {
        newCtx.myEvents = data.filter(ev => ev.organizer === newCtx.username);
        newCtx.numberOfEvents = newCtx.myEvents.length;
        createLoadPartials('user/userProfile.hbs', newCtx);
    })
};
// event details
export function getDetails(ctx) {
    const id = ctx.params.eventId;
    let newCtx = isLogged(ctx);
    get('appdata', `events/${id}`, 'Kinvey')
        .then((data) => {
            newCtx.event = data;
            newCtx.isAuthor = newCtx.username === data.organizer;
            createLoadPartials('eventDetails/details.hbs', ctx);
        })
        .catch(console.error)
};
// create event
export function getCreate(ctx) {
    let newCtx = isLogged(ctx);
    createLoadPartials('operations/create.hbs', newCtx);
};
export function postCreate(ctx) {
    post('appdata', 'events', {
        ...ctx.params,
        organizer: JSON.parse(getData('userInfo')).username,
        peopleInterestedIn: 0
    })
        .then(() => {
            ctx.redirect('#/');
        })
};
// edit, join, delete event\
export function getEdit(ctx) {
    const id = ctx.params.eventId;
    let newCtx = isLogged(ctx)
    try {
        get('appdata', `events/${id}`, 'Kinvey')
            .then(data => {
                newCtx.event = data;
                createLoadPartials('operations/edit.hbs', newCtx);
            })
    } catch (err) {
        console.log(err)
    }
};
export function postEdit(ctx) {
    const {
        dateTime,
        eventId,
        description,
        imageURL,
        name,
        organizer,
        peopleInterestedIn
    } = ctx.params;
    try {
        put('appdata', `events/${eventId}`, {
            dateTime,
            description,
            imageURL,
            name,
            organizer,
            peopleInterestedIn
        })
            .then(() => ctx.redirect(`#/details/${eventId}`))
    } catch (err) {
        console.log(err)
    }
};
export function postDelete(ctx) {
    try {
        const id = ctx.params.eventId;
        del('appdata', `events/${id}`)
            .then(() => ctx.redirect('#/'));
    } catch (err) {
        console.log(err);
    }
};
export function joinEvent(ctx) {
    const { eventId } = ctx.params;
    try {
        get('appdata', `events/${eventId}`)
            .then((data) => {
                const id = ctx.params.eventId;
                ctx.event = data;
                const {
                    dateTime,
                    description,
                    imageURL,
                    name,
                    organizer,
                    peopleInterestedIn
                } = ctx.event;
                put('appdata', `events/${eventId}`, {
                    peopleInterestedIn: Number(peopleInterestedIn) + 1,
                    dateTime,
                    description,
                    imageURL,
                    name,
                    organizer
                })
                    .then(() => ctx.redirect(`#/details/${eventId}`))
            })
    } catch (err) {
        console.log(err)
    }
};
