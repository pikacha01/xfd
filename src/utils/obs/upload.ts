// 引入policy编码计算方法
import { FileInfo } from "@/constants/form";
import getPolicyEncode from "./GetPolicy"
// 引入签名计算方法
import getSignature from "./GetSignature"
/**
 * 
 * @param {*} file 上传的文件
 * @param {*} obs obs信息
 * @param {*} UploadRef 文件上传控件
 * @returns 
 */
const OBSupload = function (file, obs, UploadRef?): Promise<FileInfo> | undefined {
    
  if (!file) {
        uni.showToast({
            title: 'Invalid filePath',
            icon: "none"
        });
    } else {
        const date = new Date();
        return new Promise((resolve) => {
          const { size, path, name } = file;
            let fileType = "", fileName = "";
            if (name) {
                fileName = name;
                fileType = name.split(".")[1]
            } else if (path.includes("http://tmp/")) {
                fileName = path.split("http://tmp/")[1]
                fileType = fileName.split(".")[1]
            } else {
                fileName = date.getTime() + "";
                fileType = "jpeg"
            }

            const fileKey = `publicFrom-${date.getTime()}-${fileName}`;// 指定上传到OBS桶中的对象名 
            const OBSPolicy = {                   // 设定policy内容，policy规则定义可参考步骤3中的超链接签名计算规则文档
                "expiration": new Date(date.getTime() + 1800000).toISOString(),
                "conditions": [
                    { "bucket": obs.bucket },  // 桶名要和配置文件中endpoint中的桶名保持一致
                    { 'key': fileKey }
                ]
            }
            const policyEncoded = getPolicyEncode(OBSPolicy);         // 计算base64编码后的policy
            const signature = getSignature(policyEncoded, obs.sk);     // 计算signature
            const uploadTask = uni.uploadFile({
                url: `https://zhuyiyun.${obs.endPoint}`,
                filePath: path,
                name: 'file',
                formData: {
                    // 从配置文件中获取到的AK信息、计算得到的编码后policy及signature信息
                    'AccessKeyID': obs.ak,
                    'policy': policyEncoded,
                    'signature': signature,
                    'key': fileKey,
                },
                success: (res) => {
                    
                    if (res.statusCode == 204) {
                        resolve({
                            fileType,
                            size,
                            fileName,
                            url: obs.url + "/" + fileKey
                        })
                    } else {
                        uni.showToast({
                            title: '上传失败',
                            icon: "error"
                        });
                    }
                }
            })

            uploadTask.onProgressUpdate(res => {
                if (UploadRef) {
                    UploadRef.value.upload()
                }
                
                // _self.percent = res.progress;  //获取上传进度百分比
                // console.log('已经上传的数据长度' + res.totalBytesSent);
                // console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
            });

        })
    }
}

export default OBSupload