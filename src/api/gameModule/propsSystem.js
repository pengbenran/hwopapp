import request from '@/utils/request';
var propAPI = 'https://propmgrapi.xq5.com';
var txCloudAPI = 'https://qcloudcosapi.xq5.com';
export function getpropList(params) {
  return request({
    url: `${propAPI}/v1/prop/config/list`,
    method: 'POST',
    data: params
  });
}
export function propConfigDelete(params) {
  return request({
    url: `${propAPI}/v1/prop/config/delete`,
    method: 'POST',
    data: params
  });
}
// 将图片文件上传至腾讯云
export function updataImgAPI(params) {
  return request({
    url: `${txCloudAPI}/file/upload`,
    method: 'POST',
    data: params
  });
}
// 修改道具信息
export function propConfigUpdate(params) {
  return request({
    url: `${propAPI}/v1/prop/config/update`,
    method: 'POST',
    data: params
  });
}
// 新增道具信息
export function propConfigAdd(params) {
  return request({
    url: `${propAPI}/v1/prop/config/add`,
    method: 'POST',
    data: params
  });
}
