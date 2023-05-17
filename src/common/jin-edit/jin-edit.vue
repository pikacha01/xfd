<template>
  <view class="container" :style="{ height: height }">
    <!-- 操作工具 -->
    <view class="tool-view" :style="style">
      <!-- 文字相关操作 -->
      <view class="font-more tool">
        <jin-icon
          class="single"
          type="&#xe6e7;"
          title="加粗"
          @click="setBold"
          :color="showBold ? activeColor : '#666666'"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6fe;"
          title="斜体"
          @click="setItalic"
          :color="showItalic ? activeColor : '#666666'"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6f8;"
          title="分割线"
          @click="setIns"
          :color="showIns ? activeColor : '#666666'"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6e3;"
          title="标题"
          @click="setHeader"
          :color="showHeader ? activeColor : '#666666'"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6f1;"
          title="居中"
          @click="setCenter"
          :color="showCenter ? activeColor : '#666666'"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6ed;"
          title="居右"
          @click="setRight"
          :color="showRight ? activeColor : '#666666'"
        ></jin-icon>
      </view>

      <view class="tool">
        <jin-icon
          class="single"
          type="&#xe6f3;"
          title="插入图片"
          @click="insertImage"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6f9;"
          title="文字样式"
          :color="showTextColor ? activeColor : '#666666'"
          @click="showColorModel('color')"
        ></jin-icon>
        <uni-icons
          type="color-filled"
          title="背景色"
          size="28"
          :color="showBgColor ? activeColor : '#666666'"
          @click="showColorModel('backgroundColor')"
        ></uni-icons>
        <jin-icon
          class="single"
          type="&#xe6eb;"
          title="分割线"
          @click="insertDivider"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe6e8;"
          title="撤销"
          @click="undo"
        ></jin-icon>
        <jin-icon
          class="single"
          type="&#xe705;"
          title="重做"
          @click="redo"
        ></jin-icon>
        <jin-icon
          class="single"
          fontSize="40rpx"
          type="&#xeb8a;"
          color="#007aff"
          title="完成"
          @click="send"
        ></jin-icon>
      </view>

      <view class="setting-layer" v-if="showSettingLayer">
        <uni-icons
          type="smallcircle-filled"
          :color="color"
          @click="setColor(color)"
          size="28"
          v-for="color in showColor"
          :key="color"
        ></uni-icons>
      </view>
    </view>
    <!-- 
      @ready="onEditorReady"

     -->
    <editor
      class="ql-container"
      :placeholder="placeholder"
      :show-img-size="true"
      :show-img-toolbar="true"
      :read-only="disable"
      :show-img-resize="true"
      id="editor"
      @statuschange="statuschange"
      @focus="editFocus"
      @blur="editBlur"
      ref="editot"
    ></editor>
  </view>
</template>

<script>
import jinIcon from "./jin-icons.vue";
import user from "../../api/modules/user";
import OBSupload from "../../utils/obs/upload";
export default {
  props: {
    // 点击图片时显示图片大小控件
    showImgSize: {
      type: Boolean,
      default: false,
    },
    // 点击图片时显示工具栏控件
    showImgToolbar: {
      type: Boolean,
      default: false,
    },
    // 点击图片时显示修改尺寸控件
    showImgResize: {
      type: Boolean,
      default: false,
    },
    // 占位符
    placeholder: {
      type: String,
      default: "开始输入...",
    },
    // 图片上传的地址
    uploadFileUrl: {
      type: String,
      default: "#",
    },
    // 上传文件时的name
    fileKeyName: {
      type: String,
      default: "file",
    },
    // 上传图片时，http请求的header
    header: {
      type: Object,
    },
    // 初始化html
    html: {
      type: String,
      default: "",
    },
    // 整个控件的高度
    height: {
      type: String,
      default: "100vh",
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  data() {
    return {
      showMoreTool: false,
      showBold: false,
      showItalic: false,
      showIns: false,
      showHeader: false,
      showCenter: false,
      showRight: false,
      showBgColor: false,
      showTextColor: false,
      showSettingLayer: false,
      activeColor: "#F56C6C",
      style: {},
      showColor: [
        "#000",
        "#fff",
        "#eeece0",
        "#4d80bf",
        "#c24f4a",
        "#8baa4a",
        "#7b5ba1",
        "#46acc8",
        "#f9963b",
      ],
      colorType: "",
    };
  },
  components: {
    jinIcon,
  },
  mounted() {
    this.onEditorReady();
  },
  methods: {
    onEditorReady(e) {
      uni
        .createSelectorQuery()
        .in(this)
        .select(".ql-container")
        .fields(
          {
            size: true,
            context: true,
          },
          res => {
            this.editorCtx = res.context;
            this.editorCtx?.setContents({
              html: this.html,
            });
          }
        )
        .exec();
    },
    undo() {
      this.editorCtx.undo();
    },
    // 插入图片
    insertImage() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择
        success: async files => {
          
          uni.showLoading({
            title: "正在上传中...",
          });
          user.getObsKey().then(res => {
            files.tempFiles.map(async file => {
              
              const fileObj = await OBSupload(file, res);
              
              // 上传完成后处理
              this.editorCtx.insertImage({
                src: fileObj.url, // 此处需要将图片地址切换成服务器返回的真实图片地址
                alt: "图片",
                success: function (e) {},
              });

              uni.hideLoading();
            });
          });
        },
      });
    },
    /// 插入分割线
    insertDivider() {
      this.editorCtx.insertDivider();
    },
    redo() {
      this.editorCtx.redo();
    },
    showMore() {
      this.showMoreTool = !this.showMoreTool;
      this.editorCtx.setContents({
        html: this.html,
      });
    },
    setBold() {
      this.showBold = !this.showBold;
      this.editorCtx.format("bold");
    },
    setItalic() {
      this.showItalic = !this.showItalic;
      this.editorCtx.format("italic");
    },
    checkStatus(name, detail, obj) {
      if (detail.hasOwnProperty(name)) {
        this[obj] = true;
      } else {
        this[obj] = false;
      }
    },
    statuschange(e) {
      var detail = e.detail;
      this.checkStatus("bold", detail, "showBold");
      this.checkStatus("italic", detail, "showItalic");
      this.checkStatus("color", detail, "showTextColor");
      this.checkStatus("backgroundColor", detail, "showBgColor");
      this.checkStatus("ins", detail, "showIns");
      this.checkStatus("header", detail, "showHeader");
      if (detail.hasOwnProperty("align")) {
        if (detail.align == "center") {
          this.showCenter = true;
          this.showRight = false;
        } else if (detail.align == "right") {
          this.showCenter = false;
          this.showRight = true;
        } else {
          this.showCenter = false;
          this.showRight = false;
        }
      } else {
        this.showCenter = false;
        this.showRight = false;
      }
    },
    setIns() {
      this.showIns = !this.showIns;
      this.editorCtx.format("ins");
    },
    setHeader() {
      this.showHeader = !this.showHeader;
      this.editorCtx.format("header", this.showHeader ? "H2" : false);
    },
    setCenter() {
      this.showCenter = !this.showCenter;
      this.editorCtx.format("align", this.showCenter ? "center" : false);
    },
    setRight() {
      this.showRight = !this.showRight;
      this.editorCtx.format("align", this.showRight ? "right" : false);
    },
    showColorModel(type) {
      this.showSettingLayer = !this.showSettingLayer;
      this.colorType = type;
    },
    async editFocus(e) {},
    editBlur(e) {
      // this.$emit("editOk", e);
    },
    send(e) {
      this.editorCtx.getContents({
        success: res => {
          this.$emit("editOk", res.html);
        },
      });
    },
    getContext() {
      let html = "";
      this.editorCtx.getContents({
        success: res => {
          html = res.html;
        },
      });
    },
    setColor(color) {
      this.editorCtx.format(this.colorType, color);
      this.showSettingLayer = false;
    },
    clearContent() {
      this.editorCtx.clear();
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  /* padding-top: 30rpx; */
}

.ql-container {
  user-select: none;
  line-height: 150%;
  font-size: 24rpx;
  width: 100%;
  overflow: auto;
  background: #fff;
  // width: calc(100% - 60rpx);
  padding: 10px 20px;
  flex: 1;
  box-sizing: border-box;
  max-height: 75vh;
  min-height: 50vh;
  /* padding-bottom: 5rpx; */
}
.tool-view {
  background: #eee;
  width: 100%;
}
.tool {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}

.font-more {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  background: rgb(235, 235, 235);
  overflow: hidden;
  transition: all 0.15s;
}

.setting-layer {
  position: absolute;
  top: 10rpx;
  background: #fff;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8rpx;
}

.single {
  height: 80rpx;
  font-size: 32rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  line-height: 80rpx;
  flex-direction: row;
  color: #666;
}
.single .icon {
  margin-right: 20rpx;
}
.setting-layer-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
}
</style>
