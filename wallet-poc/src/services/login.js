import {accountNameDict} from "../../server/config/accounts"

export async function fakeAccountLogin(params) {
  let name = (params['userName']||"").trim().toLowerCase();
  let currentUser={name, userid:-1, ... accountNameDict[name]};
  console.log(name + " ****** " + accountNameDict[name]);

  sessionStorage.setItem("antd-pro-authority", JSON.stringify(currentUser));
  return Promise.resolve({
    "status":"ok",
    currentAuthority: currentUser,
    type:""
  })
}

export async function fakeAccountLogout(params) {
  sessionStorage.removeItem('antd-pro-authority');
  return Promise.resolve("success");
}
