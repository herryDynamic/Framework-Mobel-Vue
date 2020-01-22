<!--
*@描述:复选框
*@版本:V1.0
*@作者:白爱民
*@Date:2019年12月11日20:16:26
*@最后修改人:herry
*@LastEditTime:2019年12月11日20:16:31
*@说明：-->
<template>
  <div>
      <div class="allDiv">
        <div class="divStyle" v-for="(item, index) in list" :key="index">
          <!-- <hr class="HorizontalTop"> -->
          <label @click="checkResumeDetails(index)" :id="'label' + index" class="labelStyle">{{item.name}}</label>
          <input :id="'input' +  index" @change="checkboxChange(index)" name="inputName" class="icon-span "
            type="checkbox" />
          <br />
        </div>
      </div>
  </div>
</template>

<script>
export default {
   // inject:['reload'], // 注入页面刷新
    data() {
      return {
        list: [], // 定义接受简历的数组
        result: [], // 复选框数组
        canSelectList: [], // 存放已挑选的简历
        noapproval: false, // 内容为空图片
        userId: "", //用户Id
        resumeId: "", // 简历ID
        recruitId: "", //接收recruitmentDetails界面传过来的值

        // reload: this.reload  // 需要刷新的地方
      };
    },

    //页面初始化时显示的内容
    created() {
      this.receiveData(); //接收recruitmentDetails界面传过来的值
      this.selectAllResumeVue(); // 获取所有已通过审批的简历
    },

    // 组件销毁完毕后
    destroyed() {
      localStorage.removeItem('recruitId') //删除掉local数据
      localStorage.removeItem('userId') //删除掉local数据

    },
  mounted() {},
  methods: {
 //点击返回按钮，跳到招聘详情页面-刘梦娇-2020-1-14 20:12:52
      goRecruitmentDetails() {
        this.recruitId = localStorage.getItem('recruitId')
        this.userId = localStorage.getItem('userId'); // 将获取的值存储到session

        this.$router.push({
          name: "recruitmentDetails",
          params: {
            recruitId: this.recruitId,
            userId: this.userId
          }
        });
      },
      //接收recruitmentDetails界面传过来的值
      receiveData() {
        // 如果当前local中有recruitId值，则不再赋值，解决刷新没有数据问题

        const recruitIdValue = localStorage.getItem('recruitId'); // 将获取的值存储到session
        const userIdValue = localStorage.getItem('userId')
        if (recruitIdValue == null || userIdValue == null) {
          this.userId = this.$route.params.userId;
          this.recruitId = this.$route.params.recruitId;
          if (this.recruitId == undefined) {
            this.recruitId = this.$store.state.recruitId;
          }
          localStorage.setItem('userId', this.userId); // 将获取的值存储到session
          localStorage.setItem('recruitId', this.recruitId); // 将获取的值存储到session
        }
      },

      // 获取所有已通过审批的简历-刘梦娇-2020-1-14 20:12:14
      selectAllResumeVue() {
        var vm = this;
        selectAllResume().then(Response => {
          if (Response.data.data.length === 0) {
            this.noapproval = true;
          } else {
            for (let index = 0; index < Response.data.data.length; index++) {
              this.list.push(Response.data.data[index]);
              console.log("我是list", this.list);

            }
          }
        });
      },

      // 复选框选中事件-刘梦娇-2020-1-14 20:12:40
      // toggle(index) {
      //   this.$refs.checkboxes[index].toggle();
      //   if (this.$refs.checkboxes[index].checked == false) {
      //     //将选择的简历名称、简历ID存放到canselectlist数组中
      //     this.canSelectList.push(this.list[index]);
      //     console.log(this.canSelectList[index].resumeId);
      //   } else {
      //     //移除用户取消选择的简历
      //     this.canSelectList = this.canSelectList.filter(
      //       t => t != this.$refs.checkboxes[index].name
      //     );
      //   }
      // },

      // 复选框选择后存储，选过的取消，没有选过的添加
      checkboxChange(index) {
        // 查找当前传入值是否再数组中存在，存在为0，不存在为-1
        const a = this.canSelectList.findIndex(obj => obj == index);
        if (a >= 0) {
          this.delete(index)
        } else {
          this.canSelectList.push(index); // 存添加到数组
        }

      },

      // 根据传入值找到当前数组中的位置，然后删除当前的位置
      delete(i) {
        var index = this.canSelectList.indexOf(i); // 查找位置
        this.canSelectList.splice(index, 1) // 删除当前位置一位，后面自动往前补齐
      },

      // 点击文字，显示简历详情--何静芳--2020年1月22日09:24:03
      checkResumeDetails(index) {
        const userIdC = localStorage.getItem('userId')
        const recruitldC = localStorage.getItem('recruitId')
        const resumeIdC = this.list[index].resumeId
        this.$router.push({
          name: 'resumeDetails',
          params: {
            resumeId: resumeIdC,
            recruitId: recruitldC,
            userId: userIdC
          }
        })
      },

      // 推送按钮事件-刘梦娇-2020-1-14 20:12:05
      pushResumeTips() {
        if (this.canSelectList.length == 0) {
          this.$toast("您还没有选择简历哦！");
        } else {
          //弹出提示框
          Dialog.confirm({
              message: "确定要挑选这些简历吗？"
            })
            .then(() => {
              //将简历和招聘绑定
              this.pushResumeSucceed();
              // on confirm
            })
            .catch(() => {});
        }
      },

      //推送弹出框中的确认事件-刘梦娇-2020-1-14 20:11:42
      pushResumeSucceed() {
        //简历和招聘绑定
        for (let index = 0; index < this.canSelectList.length; index++) {
          this.resumeId = this.list[this.canSelectList[index]].resumeId

          // 删除当前的下标内容，但是此下标内容为undefined，但是浏览器显示不了
          delete this.list[this.canSelectList[index]];

        }

        // 清空当前所有为undefined的下标
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i] == undefined) {
            // 删除当前下标
            this.list.splice(i, 1)
            i--;
          }
        }
        this.$toast("简历推送成功！");

        // 清空所有被选择的数据
        for (let index = 0; index < this.list.length; index++) {
          console.dir(document.getElementById("input" + index))
          document.getElementById("input" + index)["checked"] = false;

        }

        //将可选择简历数组置空
        this.canSelectList = [];
        // this.reload(); // 调用刷新的地方
      },

    }
  }
};
</script>
<style scoped>
 .labelStyle {
    display: inline-block;
    font-size: 18px;
    color: #3796FA;
    margin-left: 10px;
    margin-top: 0px;
    margin-bottom: 13px;
  }

  .inputStyle {
    float: right;
    -webkit-appearance: radio;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    /* // 0表示透明 */
    /* opacity: 1;   */
    margin-top: 6px;
    transform: rotate(-45deg)
  }

  .HorizontalTop {
    margin-top: 6px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #EBF1FB;
    height: 1px;
    border: none;
  }

  .divStyle {
    margin-top: 10px;
  }

  .allDiv {
    border: 1px solid #A9A9A9;
    border-radius: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }


  /* //对号样式 */
  .icon-span {
    display: inline-block;
    background-color: #fff;
    border-radius: 4px;
    border: 2px solid #7f7f7f;
    position: relative;
    width: 18px;
    height: 18px;
    vertical-align: middle;
    border-radius: 40%;
    /* -webkit-appearance: radio; */
    float: right;
    margin-right: 22px;
    width: 24px;
    height: 24px;
    margin-top: -2px;
  }

  .icon-span::after {
    /* -webkit-appearance: radio; */
    border: 2px solid transparent;
    border-left: 0;
    border-top: 0;
    content: " ";
    top: 2px;
    left: 5px;
    position: absolute;
    width: 4px;
    height: 8px;
    -webkit-transform: rotate(45deg) scale(0);
    transform: rotate(45deg) scale(0);
    -webkit-transition: -webkit-transform .2s;
    transition: -webkit-transform .2s;
    transition: transform .2s;
    transition: transform .2s, -webkit-transform .2s;
  }

  .icon-span-select {}

  .icon-span-select::after {
    border-color: #fff;
    -webkit-transform: rotate(45deg) scale(1);
    transform: rotate(45deg) scale(1);
  }
</style>
