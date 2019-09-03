<!-- 
	 自定义车牌输入虚拟键盘,
	 适用场景:需要输入车牌的输入框 
	 输入框获取焦点时调openKeyboard打开
-->

<template>
  <span>
      <el-input v-model="inputVal"  :style="widthStyle" :placeholder="placeholder" maxlength="8" @focus="handFocus" @blur="handBlur" ref="mark" v-popover:popover clearable>
      </el-input>
      <el-popover placement="bottom" width="420" ref="popover" trigger="focus" >
        <div class="box-right un-select" id="softKeyBoard" @mousedown.prevent="preventHandFocus()">
          <div class="key-row " v-for="(item, index) in array" :key="index" @click="handFocus()">
            <span class="key-col" @mousedown.prevent="keyButton(val)" v-for="(val,index) in item" :key="index">{{val}}</span>
          </div>
          <div class="key-row">
            <span class="key-col key-col-margin" @mousedown.prevent="keyButton('警')">警</span>
            <span class="key-col key-col-margin" @mousedown.prevent="keyButton('使')">使</span>
            <span class="key-col key-col-margin" @mousedown.prevent="keyButton('领')">领</span>
            <span class="key-col key-col-margin" @mousedown.prevent="keyButton('挂')">挂</span>
            <span class="key-col key-col-margin" @mousedown.prevent="keyButton('临')">临</span>
            <span class="key-col key-col-margin" @mousedown.prevent="keyButton('Z')">Z</span>
            <span class="key-col key-col-button" @mousedown.prevent="clear" >清空</span>
            <span class="key-col key-col-button" @mousedown.prevent="back">退格</span>
          </div>
        </div>
      </el-popover>
  </span>
</template>

<script>
  export default {
    name:'Keyboard',
     props: {
        //输入框placeholder属性默认值
        placeholder: {
          type: String,
          default: '请输入车牌'
        }, 
        //输入的车牌值
        value: {
          type: [String, Number],
          default: ''
        },
        // 输入框宽度  
        width: {
          type: String,
          default: '150'
        },                            
     },
    data () {
      return {
        inputVal:this.value,  //输入框绑定值
        widthStyle: {
          width: `${this.width}px`, 
        },        
        //虚拟键盘键值
        array:[
            ['京','津','冀','晋','蒙','1','2','3','4','5',],
            ['辽','吉','黑','沪','苏','6','7','8','9','0',],
            ['浙','皖','闽','赣','鲁','A','B','C','D','E',],
            ['云','豫','鄂','湘','粤','桂','F','G','H','J',],
            ['新','琼','渝','川','贵','云','K','L','M','N',],
            ['藏','陕','甘','宁','青','P','Q','R','S','T',],
            ['新','港','澳','台','学','U','V','W','X','Y',],
            // ['警','使','领','挂','临','Z',],
        ]
      }
    },
    watch:{
      inputVal(){
          //当输入框值改变返回给父组件
          this.$emit('input', this.inputVal)  
      },
      value(newVal,oldVal){
          this.inputVal = newVal
      },      
			width(newVal,oldVal){
				this.widthStyle = {
				   width: `${this.newVal}px`,  
				 }
			},      
    },
    methods: {
      // 阻止失去焦点
      preventHandFocus(){
          document.getElementById("softKeyBoard").onmousedown=function(e){
              if ( e && e.preventDefault )
                  e.preventDefault();
              //IE阻止默认事件
              else
                  window.event.returnValue = false;
              return false;
          }
      },
      //打开虚拟键盘并让输入框获取焦点
      openKeyboard(e){
          e.currentTarget.parentElement.parentElement.previousElementSibling.focus()
      },
			/**
			 * 虚拟键盘按钮点击事件
			 * @param {string} val 键值
			 */
      keyButton(val){

              let inputs = this.$refs['mark'].$el.getElementsByTagName('input')[0]

              if(inputs.value.length < 8){
                  var rangeStart = inputs.selectionStart;
                  var rangeEnd = inputs.selectionEnd;
                  var tempStr1 = inputs.value.substring(0, rangeStart);
                  var tempStr2 = inputs.value.substring(rangeEnd);
                  var newStart = rangeStart + val.length;
                  inputs.value = tempStr1 + val + tempStr2;
                  inputs.selectionStart = newStart;
                  inputs.selectionEnd = newStart;
                  this.inputVal = tempStr1 + val + tempStr2
              }
       },
      // 退格
      back(){
          let inputs = this.$refs['mark'].$el.getElementsByTagName('input')[0]
          // console.log(inputs.value)
          var rangeStart = inputs.selectionStart;
          var rangeEnd = inputs.selectionEnd;
          var tempStr1 = inputs.value.substring(0, rangeStart);
          var tempStr2 = inputs.value.substring(rangeEnd);
          var tempStr1Length = tempStr1.substr(0, tempStr1.length - 1)
          var newStart =   tempStr1Length.length;
          inputs.value = tempStr1Length  + tempStr2;
          inputs.selectionStart = newStart;
          inputs.selectionEnd = newStart;
          this.inputVal = tempStr1Length  + tempStr2
      },
      // 清空
      clear(){
        this.inputVal = ''
      },
      //获取焦点
      handFocus(){
          var list =document.querySelectorAll(".key-row");
              list.onmousedown=function(e){
                  if ( e && e.preventDefault )
                      e.preventDefault();
                  //IE阻止默认事件
                  else
                      window.event.returnValue = false;
                  return false;
              }

          this.$emit('focus')
      },
      //失去焦点
      handBlur(){
          // console.log(this.inputVal)
        this.$emit('carNumVerification',this.inputVal)
      }
    },


  }
</script>

<style scoped lang="scss">
  .key-keyboard{
    cursor: pointer;
    color: $color-orange;
    // font-size: 18px;
  }
  .box-right{
    background:$color-gray;
    padding: 5px;
    .key-row{
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 22px;
      .key-col{
        margin: 3px;
        display: inline-block;
        width: 32px;
        height: 32px;
        border: 1px solid #b1afaf;
        background: #fff;
        cursor: pointer;
        border-radius:3px;
      }
      .key-col:hover{
        border: 1px solid $color-blue;
        color: $color-blue;
      }
      .key-col-margin{
        margin: 3px 0px;
      }
      .key-col-button{
        margin: 3px 0px;
        width: 72px;
      }
    }
  }
</style>
