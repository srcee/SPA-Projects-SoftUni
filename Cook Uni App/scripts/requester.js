const baseUrl = 'https://baas.kinvey.com'
const appKey = 'kid_B16Xhd0hr';
const appSecret = '6a062bf82ec44104b48589c6f1ef5636';

function createAuthotization(type) {
    return type === 'Basic'
        ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
        : `Kinvey ${sessionStorage.getItem('authtoken')}`
}

function makeHeaders(type, httpMethod, data) {
    const headers = {
        method: httpMethod,
        headers: {
            'Authorization': createAuthotization(type),
            'Content-type': 'application/json'
        }
    }

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        headers.body = JSON.stringify(data);
    }
    return headers;
}
function handleError(e) {
    if (!e.ok) {
        throw new Error(e.statusText)
    }

    return e;
}

function serializeData(x) {
    if(x.status === 204) {
        return x;
    }
    return x.json();
}
function fetchData(kinveyModule, endpoint, headers) {
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`;

    return fetch(url, headers)
        .then(handleError)
        .then(serializeData)
}

export function get(kinveyModule, endpoint, type) {
    const headers = makeHeaders(type, 'GET');
    return fetchData(kinveyModule, endpoint, headers);
}

export function post(kinveyModule, endpoint, data, type) {
    const headers = makeHeaders(type, 'POST', data);
    return fetchData(kinveyModule, endpoint, headers);

}

export function put(kinveyModule, endpoint, data, type) {
    const headers = makeHeaders(type, 'PUT', data);
    return fetchData(kinveyModule, endpoint, headers);
}

export function del(kinveyModule, endpoint, type) {
    const headers = makeHeaders(type, 'DELETE');
    return fetchData(kinveyModule, endpoint, headers);
}