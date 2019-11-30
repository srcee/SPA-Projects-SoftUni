export function getSessionInfo(ctx) {
    ctx.userId = sessionStorage.getItem('userId');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
};
export function getMemberInfo(ctx) {
    if (ctx.members.find(x => x.username === ctx.username) !== undefined) {
        return true;
    }
    return false
};

export function createLoadPartials(partials, template) {
    this.loadPartials(partials)
        .then(function () { this.partial(`../templates/${template}`) })
}