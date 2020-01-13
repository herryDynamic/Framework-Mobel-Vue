<!--
 * @Description:作答
 * @Version: 1.0
 * @Autor: 苏超凡
 * @Date: 2019-09-18 10:25:04
 * @LastEditors  : sueRimn
 * @LastEditTime : 2020-01-02 17:54:52
 -->
<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="titlecolorreply"
      title="作答"
      left-arrow
      @click-left="btnback"
    />
    <!-- 题目详情的显示 -->
    <div class="brainDetail">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="selectcontent"
          :title="selectcontent"
        >
          <!-- 此处修改一下接收值即可 -->
          <answerTemplate
            :txt-node-p="brainTxtNode"
            :link-node-p="brainLinkNode"
            :picture-node-p="brainPictureNode"
          />
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>

    <div id="app">
      <!-- style="text-align:center;" -->
      <!-- 倒计时控件 -->
      <van-col v-if="time !== null">
        <van-count-down
          v-show="showTime"
          ref="countDown"
          :time="time"
          :auto-start="true"
          style="position:relitive;margin-left:520%;"
          @finish="finish()"
        />
      </van-col>
    </div>
    <!-- 作答页面框里面的内容 -->
    <replyTemplage
      :txt-node-p="txtNode"
      :link-node-p="linkNode"
      :picture-node-p="pictureNode"
      @listenToChildTxt="listenToChildTxt"
      @listenToChildLink="listenToChildLink"
      @listenToChildPicture="listenToChildPicture"
      @listenToTemplateLink="listenToTemplateLink"
    />
    <!-- 底部提交和图片超链接等 -->
    <div>
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '100px',background:'#eeeeee'}"
        :overlay="false"
      >
        <!-- 弹出层:提交-->
        <div style="text-align:center;margin-top: 0%;background-color:rgb(224, 233, 234)">
          <van-button
            class="van-button-danger"
            round
            size="normal"
            style="width:100%"
            type="primary"
            @click="btnCreat"
          >
            提交
          </van-button>
        </div>

        <!-- 下面四个图片功能 -->
        <div style="text-align:center;margin-top:7.5px">
          <div class="filereply">
            <!-- 上传作答图片 -->
            <localPicture @listenToChildEvent="receiveLocalPicture" />

            <!-- 相机图片 -->
            <camera @listenToChildEvent="receiveCamera" />

            <!-- 上传文件 -->
            <uploadFiles @listenToChildEvent="receiveUploadFiles" />

            <!-- 超链接显示图片  -->
            <img
              :src="srcLink"
              style="margin-top:3px;margin-left:55px;"
              @click="showModelTrue()"
            >
            <!-- 超链接内容 -->
            <hyperlinks
              :show-model="showmodel"
              :hyper-link-text="hyperlinktext"
              :hyper-link-address="hyperlinkaddress"
              @listenToChildEvent="receiveHyperlinks"
            />
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import escape from '../../api/escape.js'
import answerTemplate from '../../components/answerTemplate' // 引入只读答题
import replyTemplage from '../../components/replyTemplate' // 引入答题模板
import localPicture from '../../components/reply/LocalPicture' // 引入上传图片
import camera from '../../components/reply/Camera' // 引入相机图片
import uploadFiles from '../../components/reply/UploadFiles' // 引入上传文件
import hyperlinks from '../../components/reply/Hyperlinks'
import Vue from 'vue'
import { Icon } from 'vant'
Vue.use(Icon)
export default {
  name: 'Txtcontent',
  components: {
    answerTemplate,
    replyTemplage,
    localPicture,
    camera,
    uploadFiles,
    hyperlinks
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 注释文本框接受数据
      annotationArrayList: [],
      // 文本框接受数据
      testArrayList: [],
      // 题目详情处的题目
      selectcontent: this.selectcontent,
      // 题目详情出的内容
      brainstormContent: '',

      // 一张题目图片路径
      fileList: this.fileList,
      // 题目内容
      content: '',
      // 风暴id
      brainStormId: '',
      // 图片
      file: this.file,
      // 用户名
      // name: storage.get('UserInfo').userName,
      // 上传图片List，包括多张上传图片的路径
      photoList: '',
      // 题目详情展示
      showphoto: false,
      // 题目图片列表
      ThemePhotoList: [],
      // 作答要上传的图片
      photo1: '',
      showphoto1: false,
      // 活动名称
      activeNames: ['1'],
      // 作答图片回显列表
      imgList: '',
      // 倒计时10秒
      countDown: 1 * 60 * 1000,
      // 倒计时控件显示与否（默认显示）
      showTime: true,
      // 倒计时绑定的时间
      time: null,
      // 弹出框是否显示
      show: true,
      // 按钮隐藏
      showbutton: false,
      // 折叠层显示情况
      showcontent: false,
      // 超链接框的显示情况
      showmodel: false,
      // 接受url
      accpturl: '',
      // div输入框
      innerText: this.vue,
      isLocked: false,
      // 超链接文本
      hyperlinktext: '',
      // 超链接地址
      hyperlinkaddress: '',
      // 超链接显示
      showhref: false,
      // 超链接文本框显示内容
      contenttxt: '',
      // 定义数组，用于接收：图片描述
      imgNode: [],
      // 地址
      address: '',
      // 超链接数组
      list: [],
      // 大文本框的作答内容
      divtext: '',
      // 注释框的内容
      descValue: '',
      // ===================guoqian
      srcLink: require('../../images/超链接.png'), // 显示超链接图片

      linkIndex: '', // 临时存储当前linkId--修改使用
      // 头脑风暴详情的内容接收
      brainTxtNode: '这里传入数据即可', // 头脑风暴详情的文本数据
      brainPictureNode: [], // 头脑风暴详情的存储图片数据
      brainLinkNode: [], // 头脑风暴详情的存储超链接
      // 回答的内容接收
      txtNode: '', // 存储输入数据
      pictureNode: [], // 存储图片数据
      linkNode: [], // 存储超链接
      // allNode: [], // 存储所有内容
      allNode: '' // 向后端存储，存储所有内容
    }
  },
  watch: {},
  // 页面加载数据
  mounted() {
    this.receiveData()
  },
  methods: {
    // 接收数据方法
    receiveData() {
      // 发送后端请求存储数据库
      // const brainstormId = localStorage.getItem("brainstormId");
      console.log(brainstormId)
     
    },

    // 返回上一级
    btnback() {
      this.$router.go(-1)
    },

    // 提交作答内容
    btnCreat() {
      this.txtNode = escape.htmlEncode(this.txtNode) // 存库前转义字符

    },

    // 超链接弹出框显示
    showModelTrue() {
      this.showmodel = true // 显示书写超链接弹出框
    },

    // ---------------------文本框数据同步---------
    listenToChildTxt(txt) {
      this.txtNode = txt
    },
    listenToChildLink(link) {
      this.linkNode = link
    },
    listenToChildPicture(picture) {
      this.pictureNode = picture
    },
    // ---------------------文本框数据同步---------

    // 接收页面传递过来的图片，当前子组件里面传递过来的假数据
    receiveLocalPicture(imgUrl) {
      this.pictureNode.push({
        imgURL: imgUrl, // 接收图片子页面图片数据
        imgDesc: ''
      })
    },

    // 接收照相机
    receiveCamera(imgUrl) {
      this.pictureNode.push({
        imgURL: imgUrl, // 接收照相机子页面图片数据
        imgDesc: ''
      })
    },

    // 接收文件
    receiveUploadFiles(imgUrl) {
      this.pictureNode.push({
        imgURL: imgUrl, // 接收文本子页面图片数据
        imgDesc: ''
      })
    },

    // 接收父组件传递的超链接和地址，如果没有则不显示，有值则显示
    receiveHyperlinks(showmodel, hyperlinktext, hyperlinkaddress) {
      const vm = this
      this.showmodel = showmodel
      this.hyperlinktext = hyperlinktext
      this.hyperlinkaddress = hyperlinkaddress

      if (hyperlinktext !== undefined && hyperlinkaddress !== undefined) {
        if (vm.linkIndex !== '') {
          vm.linkNode[vm.linkIndex].linkText = vm.hyperlinktext // 存入已有的超链接文本
          vm.linkNode[vm.linkIndex].linkURL = vm.hyperlinkaddress // 存入已有的超链接文本

          vm.linkIndex = '' // 将当前的需要更改的id保存下来方便修改，使用完清空
        } else {
          this.linkNode.push({
            linkText: vm.hyperlinktext, // 点击下面图片按钮存入新的超链接内容
            linkURL: vm.hyperlinkaddress // 点击下面图片按钮存入新的超链接地址
          })
        }
      }
    },

    // 接收replyTemplate传递的link数据
    listenToTemplateLink(
      tempShowModel,
      tempIndex,
      tempLinkTextT,
      tempLinkURLT
    ) {
      this.showmodel = tempShowModel // 显示书写超链接弹出框
      this.linkIndex = tempIndex // 将当前的需要更改的id保存下来方便修改
      this.hyperlinktext = tempLinkTextT // 将当前连接抬头传递给子组件
      this.hyperlinkaddress = tempLinkURLT // 将当前连接地址传递给子组件
    },


  }
}
</script>
<style scoped>
/* 题目详情 */
.brainDetail {
  margin-top: 1%;
  /* margin: 5px; */
}
.brainDetail >>> .van-dropdown-menu__title {
  /* padding: 5px 16px; */
  font-size: 16px;
  font-style: left;
  width: 92%;
  padding:3px;

}

/* 照相机大小 */
.camera {
  width: 9%;
}
/* 加入班课导航栏背景颜色 */
.titlecolorreply {
  background-color: rgb(69, 129, 142);
  color: cornsilk;
}
/* 加入班课导航栏和返回图标字体颜色 */
.van-nav-bar,
.van-icon {
  color: white;
}
/* 提交按钮样式 */
.van-button-danger {
  background-color: #45818e;
  border: 1px solid rgb(127, 180, 201);
  width: 96%;
}

/* 题目详情中照片的样式 */
.photo {
  float: left;
}

.filereply >>> .van-icon {
  color: #b6b7b8;
}
</style>
