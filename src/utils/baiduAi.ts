import OBSupload from "@/utils/obs/upload";
import user from "@/api/modules/user";
import { IfObsKey } from "@/constants/form";
export function OcrIdCard(direction: string) {
  return new Promise(function (resolve, reject) {
    //识别身份证
    uni.chooseImage({  //选择身份证图片/拍照
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera','album'],
      success: function (res) {   //调用照片选择成功的回调函数
        //图片编码部分核心代码
        uni.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64', //编码格式
          success(ans) {
            uni.showLoading({ title: '识别中' })
            //ans.data:保存了图片转码之后的数据
            // 请求获取token
            uni.request({
            //url中的&client_id=client-i&client_secret=client—s中的参数client-i和client—s需要申请百度身份证识别的账号和密码，具体申请流程参考上面
              url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=xQM1uRGGwUj7sKkW8RGxXwDo&client_secret=mcgtzHzfGpQQFZifyUHQHIcrovqb2ZQS',
              data: {},//请求参数，此处没有参数，则置空
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(rep) {
                //@ts-ignore
                let access_token = rep.data.access_token;
                //带着token与转码后的图片编码请求百度OCR接口，对身份证信息进行识别
                uni.request({
                  url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + access_token,
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    image: ans.data,  //ans.data：图片编码
                    id_card_side: direction
                  },
                  async success(_res) {
                    const temp:any = []
                    temp.push(_res.data)
                    //@ts-ignore
                    await user.getObsKey().then(async (data: IfObsKey) => {
                    console.log(res.tempFiles[0],data)
                    //@ts-ignore
                    const fileObj = await OBSupload(res.tempFiles[0], data);
                      console.log(fileObj)
                      temp.push(fileObj);
                    });
                    resolve(temp)
                    uni.hideLoading();
                  }, fail(_res) {
                    uni.hideLoading();
                    uni.showToast({
                      title: '请求出错',
                      icon:'none'
                    })
                    reject(_res)
                  }
                })
              },fail(rep) {
                uni.hideLoading();
                uni.showToast({
                  title: '请求出错',
                  icon:'none'
                })
                reject(rep)
              }

            });
          },fail(res) {
            uni.hideLoading();
            uni.showToast({
              title: '所选图片编码失败，请重试',
              icon:'none'
            })
            reject(res)
          }
        })

      },fail(res) {
        uni.hideLoading();
        uni.showToast({
          title: '图片选择失败，请重试',
          icon:'none'
        })
        reject(res)
      }
    })
  })
}

