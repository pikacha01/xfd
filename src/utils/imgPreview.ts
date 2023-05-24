export function previewImg(url: string, urlList: {url:string}[]) {
  const imgList: string[] = []
  urlList.forEach((item) => {
    imgList.push(item.url)
  })
  uni.previewImage({
    urls: imgList,
    current: url
  })
}