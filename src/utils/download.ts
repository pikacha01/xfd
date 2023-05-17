import Axios from "axios";

/**
 * 下载图片
 * @param url 图片地址
 */
export async function getImage(url: string) {
    const handleUrl = url.replace(/(http|https):\/\//, " ");
    // const str1 = url.slice(url.indexOf("//") + 99);
    const { data } = await Axios({
        method: "GET",
        url: `/upload/${handleUrl.slice(handleUrl.indexOf("/") + 1)}`,
        responseType: "blob"
    });

    return data;
}