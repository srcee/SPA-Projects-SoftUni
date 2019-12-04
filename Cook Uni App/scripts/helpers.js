export function getSessionInfo(ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.names = sessionStorage.getItem('names');
};
export function getMemberInfo(ctx) {
    if (ctx.members.find(x => x.username === ctx.username) !== undefined) {
        return true;
    }
    return false
};
export function createLoadPartials(partials, template) {
    this.loadPartials(partials)
        .partial(`../templates/${template}`);
};
export function setAuthInfo(userInfo) {
    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
    sessionStorage.setItem('names', `${userInfo.firstName} ${userInfo.lastName}`);
    sessionStorage.setItem('userId', userInfo._id);
};