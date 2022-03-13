import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  let json=sessionStorage.getItem("antd-pro-authority");
  let user=!json? {} : JSON.parse(json);
  return Promise.resolve(user);
}

