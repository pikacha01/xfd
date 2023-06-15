// 客户资料
export interface clienData {
  AutoNumberField_55: string;
  DateField_4: string;
  DateField_6: string;
  DateField_12: string;
  DateField_16: string;
  GroupField_13: string;
  GroupField_69: string;
  GroupField_70: string;
  IdentityField_15: string;
  MemberField_3: number;
  MemberField_5: number;
  MemberField_7: number;
  MemberField_48?: string[];
  PhoneField_9: string;
  PicField_43: {
    fileName: string;
    fileType: string;
    size: number;
    url: string;
  }[];
  PicField_44: {
    fileName: string;
    fileType: string;
    size: number;
    url: string;
  }[];
  RegionField_20: number[];
  TextField_1: string;
  TextField_21: string;
  id: number;
  owner: string;
  label: string;
}

export interface tabsList {
  id: number;
  title: string;
}

// 客户拥有者
export interface clientOwner {
  id: number;
  name: string;
  phone: string;
  type: number;
  username: string;
}
// 档案状态
interface clientStatus {
  label: string;
  value: string;
  color: string;
  checked: boolean;
}
// 具体工作表信息
export interface clientForm {
  col: number;
  dataType: string;
  deleted: boolean;
  errorMsg: any[]; 
  icon: string;
  id: string;
  label: string;
  left: number;
  length: number;
  multiRow: boolean;
  pattern: string;
  persistence: boolean;
  placeholder: string;
  primary: boolean;
  readonly: boolean;
  required: boolean;
  system: boolean;
  tag: string;
  top: number;
  unique: boolean;
  verifyResult: boolean;
  visible: boolean;
  width: number;
  items?: clientStatus[];
  children?: clientForm[]
}
export interface clientFormInfoInfo {
  createTime: string;
  creator: number;
  formTitle: string;
  groupId: number;
  icon: string;
  id: number;
  joinForm: any[]; 
  note: string;
  summaryJoinFormList: any[];
  title: string;
  updateTime: string;
  updator: number;
  version: number;
  children: clientForm[]
}

// obs
export interface obs {
  endPoint: string,
  ak: string,
  sk: string,
  url: string,
  bucket: string
}

// 用户信息
export interface userInfo {
  DateField_4: null;
  DateField_12: string | null;
  DateField_16: string | null;
  DateField_17: null;
  GroupField_13: null | string;
  IdentityField_15: string | null;
  JoinFormField_89: null;
  MemberField_3: null;
  MemberField_5: null;
  MemberField_48: string | null;
  PhoneField_9: string;
  PositionField_67: {
    address: string;
    location: string;
    pName: string;
    staticPic: string;
    type: number;
  }  | null ;
  RegionField_20: number[]  | null;
  SelectField_58: null | string[];
  TextField_1: string  | null;
  TextField_21: string  | null;
  TextField_76: string  | null;
  TextField_84: string  | null;
  TextField_87: string  | null;
  TextField_88: null;
  id: null;
}

// SN码列表
export interface SNList {
  group: null,
  start: number,
  end: number,
  total: number,
  data: {
    MemberField_3: number,
    MemberField_5: number,
    id: number,
    TextField_1: string,
    DateField_4:string
  } []
}

// SN码添加
export interface NewSNAdd {
  data: {
    initData: {
      JoinField_9: number[]
    }
  },
  processId: string,
  stepId: string
}