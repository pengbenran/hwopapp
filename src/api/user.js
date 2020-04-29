import request from '@/utils/request';
var loginBaseIp = 'http://login.xq5.com';
export function login(data) {
  return request({
    url: `${loginBaseIp}/api/v1/zonst/login`,
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  });
}
