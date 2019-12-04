export const appKey = "kid_B16Xhd0hr";
export const appSecret = "6a062bf82ec44104b48589c6f1ef5636";
export const baseUrl = "https://baas.kinvey.com";

function saveData(key, value) {
  localStorage.setItem(key+appKey, JSON.stringify(value));
}

export function getData(key){
  return localStorage.getItem(key+appKey);
}

export function saveUser(data){
  saveData("userInfo",data);
  saveData("authToken", data._kmd.authtoken);
}

export function removeUser(){
  localStorage.clear();
}

export function saveAndRedirect(ctx, path, userInfo) {
  saveUser(userInfo);
  ctx.redirect(path);
}