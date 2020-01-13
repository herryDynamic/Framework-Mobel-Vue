<!--
 * @描述: 计算器
 * @版本: V2.0
 * @作者: 白爱民
 * @Date: 2019年12月11日20:16:26
 * @最后修改人: herry
 * @LastEditTime: 2019年12月11日20:16:31
 * @说明：可扩充乘除
 -->
<template>
  <div class="about">
    <h1>这是个计算器你信吗</h1>
    <van-cell-group type="text">
      <van-field
        oninput="value=value.replace(/[^\d+(+)+(-)+(*)]/g, '').replace(/^0{1,}/g,'')"
        v-model="inputValue"
        placeholder="请输入数字"
      />
    </van-cell-group>
    <van-cell-group type="text" v-show="indexShow2">
      <van-field
        oninput="value=value.replace(/[^\d+(+)+(-)+(*)]/g, '').replace(/^0{1,}/g,'')"
        v-model="inputValue2"
        placeholder="请输入数字"
      />
    </van-cell-group>
    <van-cell-group type="text" v-show="indexShow3">
      <van-field
        oninput="value=value.replace(/[^\d+(+)+(-)+(*)]/g, '').replace(/^0{1,}/g,'')"
        v-model="inputValue3"
        placeholder="请输入数字"
      />
    </van-cell-group>
    <van-cell-group type="text" v-show="indexShow4">
      <van-field
        oninput="value=value.replace(/[^\d+(+)+(-)+(*)]/g, '').replace(/^0{1,}/g,'')"
        v-model="inputValue4"
        placeholder="请输入数字"
      />
    </van-cell-group>

    <div style="margin-top:20%">
      <van-grid clickable :column-num="4" :gutter="10">
        <van-grid-item @click="onclick(i)" v-for="(num,i) in dataNum" :key="i" :text="dataNum[i]" />
      </van-grid>
    </div>
  </div>
</template>

<script>
import { Field } from "vant";
export default {
  data() {
    return {
      indexShow2: false, // 第二行显示
      indexShow3: false, // 第二行显示
      indexShow4: false, // 第二行显示

      inputValue: "", // input当前显示值
      inputStorage: "", // input输入值存储
      inputValue2: "", // 第二行input当前显示值
      inputStorage2: "", // 第二行input输入值存储
      inputValue3: "", // 第三行input当前显示值
      inputStorage3: "", // 第三行input输入值存储
      inputValue4: "", // 第四行input当前显示值
      inputStorage4: "", // 第四行input输入值存储

      // 数字加减乘除数组
      dataNum: [
        "+",
        "-",
        "*",
        "/",
        "1",
        "2",
        "3",
        "< X",
        "4",
        "5",
        "6",
        "=",
        "7",
        "8",
        "9",
        "0"
      ],
      outValue: "0", // 第二行一直显示结果值/存储当前的值；
      calculator: "" // 解析拿到的值

      //   temporaryVariables1: "", // 存储临时计算拼接值1
      //   temporaryVariables2: "", // 存储临时计算拼接值2
      //   temporaryOperator: ""    // 存储临时运算符
      // temporaryVariablesSingle: "", // 临时存储在输入加减前的值单个值
    };
  },
  mounted() {},
  methods: {
    // 点击事件
    onclick(index) {
      this.parsing(index); // 解析当前的值
      this.judge(); // 判断进行运算
    },

    // 解析当前拿到的值
    parsing(index) {
      switch (index) {
        case 4:
          this.calculator = "1";
          break;
        case 5:
          this.calculator = "2";
          break;
        case 6:
          this.calculator = "3";
          break;
        case 8:
          this.calculator = "4";
          break;
        case 9:
          this.calculator = "5";
          break;
        case 10:
          this.calculator = "6";
          break;
        case 12:
          this.calculator = "7";
          break;
        case 13:
          this.calculator = "8";
          break;
        case 14:
          this.calculator = "9";
          break;
        case 15:
          this.calculator = "0";
          break;
        case 0:
          this.calculator = "+";
          break;
        case 1:
          this.calculator = "-";
          break;
        case 2:
          this.calculator = "*";
          break;
        case 3:
          this.calculator = "/";
          break;
        case 11:
          this.calculator = "=";
          break;
        case 7:
          this.calculator = "X";
          this.Clear();
          break;
        default:
          break;
      }
    },

    // 显示第一行当前的值
    showOn() {
      if ((this.inputValue = "")) {
        this.inputValue = this.inputStorage; // 之前存储先赋给要显示的
        this.inputValue += this.calculator; // 要显示的值再次加上当前点击的值
        this.inputStorage = this.inputValue; // 同步要存储的值
      } else {
        this.indexShow3 = true;
        this.inputValue3 = this.inputStorage; // 之前存储先赋给要显示的
        this.inputValue3 += this.calculator; // 要显示的值再次加上当前点击的值
        this.inputStorage3 = this.inputValue; // 同步要存储的值
      }
    },

    // 计算当前的值
    calculation() {
      this.temporaryOperator += this.calculator; // 存储当前计算值
    },

    // 判断是哪个运算符
    judge() {
      switch (this.calculator) {
        case "=":
          this.equal();
          break;
        case "X":
          this.Clear();
          break;
        case "+":
          this.showInputNext2();
          break;
        case "-":
          this.showInputNext2();
          break;
        default:
          this.showOn(); // 显示当前的值
          //   this.calculation(); // 计算当前的值
          break;
      }
    },

    // 显示第二个输入窗口
    showInputNext2() {
      this.indexShow2 = true; // 第二个空显示
      this.inputValue2 = this.calculator; // 显示运算符
    },

    // 等于
    equal() {
      if (this.inputValue2 == "+") {
        this.add(this.inputValue, this.inputValue3);
      } else if (this.temporaryOperator == "-") {
        this.subtraction(this.inputValue, this.inputValue3);
      }
      //   this.inputValue = this.temporaryVariables1;
      //   this.inputStorage = "";
    },

    // 加法计算
    add(addOne, addTwo) {
      this.outValue = Number(addOne) + Number(addTwo); // 显示当前的值
      //   this.temporaryVariables1 = this.outValue; // 第一个用于存储
      //   this.outValue = this.inputValue; // 保留结果/第二行显示结果
      //   this.temporaryVariables2 = ""; // 第二个清空用来再次保留
      this.indexShow4 = true;
      this.inputValue4 = this.outValue;
    },
    // 减法计算
    subtraction(subOne, subTwo) {
      this.outValue = Number(subOne) - Number(subTwo); // 显示当前的值

      this.indexShow4 = true;
      this.inputValue4 = this.outValue;
      //   this.temporaryVariables1 = this.outValue; // 第一个用于存储
      //   this.temporaryVariables2 = ""; // 第二个清空用来再次保留

      //   this.outValue = this.inputValue; // 保留结果/第二行显示结果
    },

    // showInputNext4() {
    //   this.indexShow4 = true;
    //   this.inputValue4 = 1;
    // },

    // 清除显示的数据
    Clear() {
      this.inputValue = "";
      this.inputStorage = "";
      this.outValue = "0";
      this.temporaryVariables = "";

      this.inputValue2 = ""; // 第二行input当前显示值
      this.inputStorage2 = ""; // 第二行input输入值存储
      this.inputValue3 = ""; // 第三行input当前显示值
      this.inputStorage3 = ""; // 第三行input输入值存储
      this.inputValue4 = ""; // 第四行input当前显示值
      this.inputStorage4 = ""; // 第四行input输入值存储

      this.calculator = ""; // 解析拿到的值
      this.temporaryVariables1 = ""; // 存储临时计算拼接值1
      this.temporaryVariables2 = ""; // 存储临时计算拼接值2
      this.temporaryOperator = ""; // 存储临时运算符

      this.indexShow2 = false; // 第二行显示
      this.indexShow3 = false; // 第二行显示
      this.indexShow4 = false; // 第二行显示
    }
  }
};
</script>
<style scoped>
div.inputAll {
  position: relative;
}

div.inputOne {
  position: absolute;
  top: 10%;
  /* border-bottom:1px solid gray; */
}

div.inputTwo {
  position: absolute;
  top: 15%;
}

div.inputLine {
  border-bottom: 1px solid gray;
  top: 12.5%;
  position: absolute;
}
</style>
