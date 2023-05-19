// 控件tag名
const ControlTagName: { [key: string]: string } = {
  ID: "ID",
  form: "Form",
  amountField: "AmountField",
  groupField: "GroupField",
  dateField: "DateField",
  emailField: "EmailField",
  numberField: "NumberField",
  phoneField: "PhoneField",
  selectField: "SelectField",
  textField: "TextField",
  picField: "PicField",
  fileField: "FileField",
  regionField: "RegionField",
  positionField: "PositionField",
  formulaField: "FormulaField",
  checkField: "CheckField",
  gradeField: "GradeField",
  textCombination: "TextCombinationField",
  autoNumber: "AutoNumberField",
  richText: "RichTextField",
  identityField: "IdentityField",
  departField: "DepartField",
  signature: "SignatureField",
  memberField: "MemberField",
  joinFormField: "JoinFormField",
  childTable: "ChildTableField",
  caseCard: "CaseCard",
  otherForm: "OtherFormField",
  summaryField: "SummaryField",
  systemMemberField: "SystemMemberField",
  formGrid: "FormGrid",
  noteField: "NoteField",
  capitalAmount: "CapitalAmount",
  embeddedWeb: "EmbeddedField",
};
interface IfForm {
  parentId?: string;
  id: string;
  tag: string;
  icon: string;
  note: string;
  title: string;
  state: number;
  verifyResult: boolean;
  joinForm: Array<string>;
  saved?: boolean;
  groupId?: string;
  system?: boolean;
  visible?: boolean;
  children: Array<IfFormGrid>;
  formTitle: string | null;
  version?: string;
  getChildren?: Function;
  childrenCount?: number;
  getAllChildren?: Function;
  getDataItemById?: Function;
}
export interface Menu {
  id: string;
  name: string;
  icon: string;
  type: number;
  page: string;
  visible: boolean;
  children: Menu[];
  parent?: Menu | null | number;
  index?: number;
  key: string;
}

export interface TaskParam {
  menuId: string;
  viewId: string;
  buttonId: string;
  selectedAll: boolean;
  selectedIds: Array<string>;
  userCondition: Criterion;
  value?: Record<string, unknown>;
}
export type Criterion = {
  criterias?: Array<Condition>;
  operator?: string;
  start?: number;
  end?: number;
};
export interface Button  {
  system: boolean;
  label: string;
  icon: string;
  type: "primary" | "text" | "dashed" | "ghost" | "default" | "danger" | "link" | undefined;
  color: string;
  mulit: boolean;
  quicklyButton: boolean;
  enableType: number;
  enableCondition?: Condition;
  needConfirm: boolean;
  // confirmTip?: Confirm;
  template: string;
  flowId: string;
  note: string;
  loading: boolean;
  onTap?: () => any;
}
export interface Page  {
  title: string;

  icon: string;

  form: string;

  version: number;

  groupId: string;

  note: string;

  deatilFlowId: string;

  buttons: Array<Button>;

  criterion: Condition | null;
}

export enum Operator {
  Equals = "EQUALS",
  NotEqual = "NOT_EQUAL",
  GreaterThan = "GREATER_THAN",
  LessThan = "LESS_THAN",
  GreaterOrEqual = "GREATER_OR_EQUAL",
  LessOrEqual = "LESS_OR_EQUAL",
  Contains = "CONTAINS",
  NotContains = "NOT_CONTAINS",

  StartsWith = "STARTS_WITH",
  EndsWith = "EDNS_WITH",

  NotStartWith = "NOT_START_WITH",
  NotEndWith = "NOT_END_WITH",

  IsNull = "IS_NULL",
  NotNull = "NOT_NULL",

  InSet = "IN_SET",
  NotInSet = "NOT_IN_SET",

  Between = "BETWEEN",
  NotBetween = "NOT_BETWEEN",

  And = "AND",
  Or = "OR"
}

export interface Condition {
  criterias?: Condition[];
  fieldName?: string;
  dataType?: string;
  formate?: string;
  operator?: Operator;
  value?: Content[];
  evalue?: Content[];
}

export interface RecordSet {
  start: number;
  end: number;
  total: number;
  datas: Array<{ id: string } & { [key: string]: unknown }>;
}

export interface TaskResult {
  processId: string;
  stepId: string;
  state: number;
  dataType: number;
  data?: any;
}

interface AreaItem {
  fid: number;
  id: number;
  levelId: number;
  name: string;
}

interface IfFormGrid {
  id: string;
  col: number;
  tag: string;
  label: string;
  state: number;
  system: boolean;
  readonly: boolean;
  visible?: boolean;
  verifyResult: boolean;
  children: Array<IfDataItem>;
  columNum?: number;
  hoverable?: boolean;
  getChildren: any;
  childrenCount?: number;
}

interface IfDataItem {
  id: string;
  tag: string;
  col: number;
  note: string;
  label: string;
  type?: number | boolean;
  state: number;
  unique: boolean;
  system: boolean;
  verifyResult: boolean;
  length?: number;
  errorMsg: Array<{ field: string; msg: string }>;
  readonly: boolean;
  required: boolean;
  precision?: number;
  unit?: string;
  primary?: boolean;
  visible?: boolean;
  fieldType?: string;
  placeholder?: string;
  persistence?: boolean;
  defaultValue?: string | Date | Array<string> | number;
  display?: number;
}
interface FormFiled {
  col: number
  deleted: boolean
  errorMsg: any
  formId: string
  height: number
  left: number
  persistence: boolean
  primary: boolean
  readonly: boolean
  refFieldId: string
  required: boolean
  system: boolean
  tag: "RefField" | "ShowPicField" | "ShowRichTextField" | "ShowFileField"
  top: number
  unique: boolean
  verifyResult: boolean
  visible: boolean
  width: number
  id?: string
}

interface PublicForm {
  title: string;
  children: Array<FormFiled>;
  exceed: boolean;
  enable: boolean;
  secret: string;
  submitTitle: string;
  prompt: string;
  beginTime: string;
  createTime: string;
  creator: string
  endTime: string;
  groupId: string;
  id: string;
  refForm: string
  submitFlow: string
  tag: string
  updateTime: string
  updator: string,
  // 开启收集微信信息
  collectWX: boolean;
  // 收集微信信息类型 1:需要授权2:不需要授权
  collectType: 1 | 2
}
//微信用户信息
interface wxInfo {
  access_token?: string;
  openid?: string;
  refresh_token?: string
  //snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
  //snsapi_userinfo（弹出授权页面，可通过 openid 拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
  scope?: "snsapi_base" | "snsapi_userinfo";
  data?: wxData
}
interface wxData {
  city?: string
  country?: string;
  headimgurl?: string
  nickname?: string
  openid?: string
  privilege?: Array<any>
  province?: string
  // 1时是男性，值为2时是女性，值为0时是未知
  sex?: 1 | 2 | 0
}

// obs 公钥私钥
type IfObsKey = {
  ak: string;
  endPoint: string;
  sk: string;
  url: string;
  bucket: string
};
const fileCate = {
  pic: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "tif",
    "tga",
    "bmp",
    "dds",
    "svg",
    "eps",
    "hdr",
    "raw",
    "exr",
    "psd",
    "afphoto",
    "afdesign",
    "webp"
  ],
  word: ["doc", "docx"],
  ppt: ["ppt", "pptx"],
  excel: ["xls", "xlsx"],
  video: ["mp4", "webm", "ogg", "rmvb", "avi"],
  audio: ["wav", "mp3", "ogg", "acc", "webm"],
  pdf: ["pdf"],
};
type IfValidate = {
  id: string;
  info: string;
  success: true;
};

/** 数据块类型 */
export enum CONTENTTYPE {
  PARAM = "1",
  OPERATOR = "2",
  INPUT = "3",
  USER = "4",
  PLACE = "-1"
}
export interface FileInfo {
  url: string;
  size: string;
  fileName: string;
  fileType: string;
}

export enum NUM {
  SINGLE = 0,
  ODD = 1
}
// 获取建筑的参数
export type PositionMess = {
  companyId?: string;
  formId?: string;
  widgetId?: string;
  keywords?: string;
  page_num?: number;
  page_size?: number;
  location?: string;
  moveLocation?: string;
};

// 周边建筑信息
export type Place = {
  address: string;
  cityname: string;
  adname: string;
  location: string;
  name: string;
};

// 公式控件计算日期单位
enum DATEUNIT {
  YEAR = 1,
  MONTH = 1 << 1,
  DAY = 1 << 2,
  HOUR = 1 << 3,
  MINUTE = 1 << 4
}
// 计算方式
enum METHOD {
  // 求和，两个日期间的时长
  ADDANDBETWWEN = 1,
  // 相减
  CUT = 1 << 13,
  // 平均值，日期加减时间
  AVERAGEANDDATESUB = 1 << 1,
  // 最小值，距离今天时间
  MINANDTOTADAY = 1 << 2,
  // 最大值
  MAX = 1 << 3,
  // 最小值
  MIN = 1 << 14,
  // 乘积
  PRODUCT = 1 << 4,
  // 自定义
  CUSTOM = 1 << 5,
  // 计数
  COUNT = 1 << 6,
  // 绝对值
  ABS = 1 << 7,
  // 求整
  INT = 1 << 8,
  // 求余
  MOD = 1 << 9,
  // 四舍五入
  ROUND = 1 << 10,
  // 向上舍入
  ROUNDUP = 1 << 11,
  // 向下舍入
  ROUNDDOWN = 1 << 12
}
export class Content {
  constructor(public id: string, public type: string, public visible: boolean = true) { }
}
export interface IfCompany {
  avatar: string;
  createTime?: string;
  expireTime?: string;
  status: number;
  id: string;
  name: string;
}
// 
export interface formTree {
  application: string;
  children: any[];
  icon: string;
  id: string;
  index: number;
  name: string;
  page: string;
  type: number;
  visible: boolean;
}


// 步骤参数
export interface newClientStep {
  data: {
    initData: any,
    inputForm: IfForm,
    viewId: number,
    appId: number,
  }
  processId: string,
  stepId: string,
  state: number,
}

interface IDInfo {
  fileName: string,
  fileType: string,
  size: number,
  url: string,
}

// 身份证上传步骤参数
export interface IDUpload {
  JoinFormField_89: null,
  PicField_43: IDInfo[],
  PicField_44: IDInfo[],
  TextField_87: string
}

// 地区选择 
export interface addressInfo {
  fid: number,
  id: number,
  levelId:number,
  name:string
}

export interface FormCompnentData {
  placeholder: string,
  col: number;
  color: boolean;
  cssStyle: null | string;
  dataType: string;
  defaultValue: string;
  deleted: boolean;
  errorMsg: any[];
  height: number;
  id: string;
  items?: {
    label: string;
    value: string;
    color: string;
    checked: boolean;
  }[];
  label: string;
  layout: string;
  left: number;
  note: string;
  persistence: boolean;
  primary: boolean;
  readonly: boolean;
  required: boolean;
  summaryGeneratorList: null;
  system: boolean;
  tag: string;
  top: number;
  type: number;
  unique: boolean;
  verifyResult: boolean;
  visible: boolean;
  width: number;
}

export {
  ControlTagName,
  fileCate,
  IfValidate,
  PublicForm,
  IfDataItem,
  DATEUNIT,
  METHOD,
  IfForm,
  IfFormGrid,
  AreaItem,
  IfObsKey,
  FormFiled,
  wxInfo
}
