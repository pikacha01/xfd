import http from '../http'
import md5 from "js-md5"
import JsEncrypt from "jsencrypt-plus";
import { AxiosPromise } from "axios";
import {
  AreaItem,
  Page, IfObsKey,
  IfValidate, Menu,
  Place, PositionMess, RecordSet, TaskParam, TaskResult,
} from '@/constants/form';

// 获取地区
function getAreaData(fid: number): AxiosPromise<{ datas: Array<AreaItem> }> {
  return http.get(`/roger/areaList/${fid}/${0}/${120}`)
}

// obs获取公钥私钥
function getObsKey(): AxiosPromise<IfObsKey> {
  return http.get("/bepo/obs/get_config");
}

// function refreshToken(refreshToken: string): Promise<{
//   access_token: string;
//   refresh_token: string;
// }> {
//   return http.post("/robin/api/login-refresh", { token: refreshToken });
// }

/**
 * 获取Token
 */
function getToken(data: string, phone: string, password: string): Promise<{
  status: number,
  msg: string,
  data: {
    empty: boolean
    map: {
      access_token: string;
      token_type: string;
      refresh_token: string
    }
  }
}> {
  const rsaObj = new JsEncrypt();
  rsaObj.setPublicKey(data);
  const mPass = rsaObj.encrypt(md5(password));
  return http.post('/robin/api/login', {
    username: phone,
    password: mPass
  })
}

// 修改密码
function changePassword(data: string, phone: string, password: string,code:string): Promise<{
  status: number,
  msg: string,
}> {
  const rsaObj = new JsEncrypt();
  rsaObj.setPublicKey(data);
  const mPass = rsaObj.encrypt(md5(password));
  return http.post('/robin/api/setPassword', {
    username: phone,
    password: mPass,
    code: code
  })
}

// 获取公钥
function getRsaPublicKey(): Promise<{ status: number, data: string }> {
  return http.get("/robin/api/getRsaPublicKey")
}

/**
 * 获取应用列表
 * @param companyId 组织ID
 */
export function getMenus(companyId: string, appId: string): AxiosPromise<Menu[]> {
  return http.get(`/nami/menuTree/${companyId}/${appId}`);
}

/**
 * 列表页面查询
 *
 * @param companyId
 * @param param
 * @returns
 */
export function fetchPagedList(companyId: string, param: TaskParam): Promise<RecordSet> {
  return http.post(`/zoro/pagedList/${companyId}`, param);
}

/**
 * 启动按钮流程
 *
 * @param companyId
 * @param flowId
 * @param param
 * @returns
 */
export function startButtonFlow(companyId: string, param: TaskParam): Promise<TaskResult> {
  return http.post(`/zoro/start-button/${companyId}`, param);
}

/**
 * 获取工作表权限视图
 *
 * @param companyId 公司
 * @param formId 工作表
 */
export function loadPowerViews(
  companyId: string,
  appId: string,
  menuId: string
): AxiosPromise<Page[]> {
  return http.get(`/nami/role/role_view_list/${companyId}/${appId}/${menuId}`);
}


/**
 * 获取经纬度静态图片地址
 * @param mess 参数
 */
export function getStaticPic(mess: {
  location: string;
  size: string;
  zoom: string;
}): Promise<{ status: number; data: string }> {
  return http.post("/sabot/lbs/getStaticMap", mess);
}

/**
 * 经纬度获取周边建筑
 * @param positionMess 经纬度及分页信息
 */
function getPlace(positionMess: PositionMess): Promise<Array<Place>> {
  return http.post(`/sabot/lbs/getAround`, positionMess);
}

// 校验值是否唯一
function getUniqueData(
  companyId: string,
  formId: string,
  field: string,
  mess: Record<string, any>
): Promise<IfValidate> {
  return http.post(
    `/zoro/validate-public/${companyId}/${formId}/${field}`,
    mess
  );
}

export function refreshTokenApi(
  id: string
): Promise<{ access_token: string; refresh_token: string }> {
  return http.post('/robin/api/login-refresh', { token: id })
}

export default {
  getToken,
  // refreshToken,
  getMenus,
  getRsaPublicKey,
  getAreaData,
  getObsKey,
  getPlace,
  getUniqueData,
  changePassword
}
