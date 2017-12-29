require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//引入图片组件
import ImgFigure from './ImgFigure.js';

//引入控制器组件
import ControllerUnit from './ControllerUnit.js';

//获取相关图片的数据
var imageDatas = require('../data/imageDatas.json');

//利用执行函数 将图片信息转化成图片URL路径信息
imageDatas = (function genImageUrl(imageDatasArr) {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName); //结合require处理图片的地址
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

// 获取区间内随机值
function getRangeRandom(low, high) {

  return Math.ceil(Math.random() * (high - low) + low);
}

// 获取0-30度之间任意正负值
function get30DegRandom() {
  return (Math.random() > 0.5 ? '':'-'+Math.ceil(Math.random()*30));
}



//舞台也就是画廊的背景 父容器
class AppComponent extends React.Component {
  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: { //水平方向图片的取值范围
      leftSecx: [0, 0],
      rightSecx: [0, 0],
      y: [0, 0]
    },
    vPosRange: {//垂直方向图片的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }

  // 翻转图片
  // @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  //@return {Function} 这是一个闭包函数 其内return一个真正待被执行的函数
  inverse(index){

    return function(){
      var imgsArranageArr = this.state.imgsArranageArr;

      imgsArranageArr[index].isInverse = !imgsArranageArr[index].isInverse;

      this.setState({
        imgsArranageArr:imgsArranageArr
      })

    }.bind(this);
  }


  // 重新布局所有图片
  // @param centerIndex 指定居中排布的图片
  rearrange(centerIndex) {
    var imgsArranageArr = this.state.imgsArranageArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecx,
      hPosRangeRightSecX = hPosRange.rightSecx,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],  //上侧布局图片
      topImgNum = Math.floor(Math.random() * 2),  //一个或者没有

      topImgSpliceIndex = 0,
      imgsArrangeCenter = imgsArranageArr.splice(centerIndex, 1);


    imgsArrangeCenter[0] = {
      pos:centerPos,  //首先居中 cengterIndex的图片
      rotate : 0,  //居中的图片centerIndex不需要旋转
      isCenter:true //图片居中
    }




    //取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArranageArr.length - topImgNum));
    imgsArrangeTopArr = imgsArranageArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (v, index) {
      imgsArrangeTopArr[index] = {
        pos : {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
        },
        rotate:get30DegRandom(),
        isCenter:false
      }

    })

    //布局左右两侧的图片
    for (var i = 0, k = imgsArranageArr.length / 2; i < imgsArranageArr.length; i++) {
      var hPosRangeLOrR = null;

      //前半部分左边 右半部分右边
      if (i < k) {
        hPosRangeLOrR = hPosRangeLeftSecX;
      } else {
        hPosRangeLOrR = hPosRangeRightSecX;
      }

      imgsArranageArr[i] ={
        pos : {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLOrR[0], hPosRangeLOrR[1]),
        },
        rotate:get30DegRandom(),
        isCenter:false
      }

    }


    //把截取出来的布局上侧以及中心的图片 放回去 还原整个图片数组
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArranageArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArranageArr.splice(centerIndex, 0, imgsArrangeCenter[0]);

    //类似于vue里面的vue.$set 更新state用于更新视图
    this.setState({
      imgsArranageArr: imgsArranageArr
    })
  }


  //利用rearrange函数 居中对应index的图片
  //@param index 需要被居中的图片对应的图片信息数组的index值
  //@return {Function}

  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }

  constructor(props) { //类似于vue Data数据 即getInitState
    super(props);
    this.inverse = this.inverse.bind(this);
    this.state = {
      imgsArranageArr: [
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   },
        // rotate:0, //选择角度
        // isInverse:false, //图片正反面
        // isCenter:false //图片是否居中
        // }
      ]
    }
  }

  //组件加载完之后 为每张图片计算其位置范围
  componentDidMount() {

    //首先拿到舞台的大小
    var stageDom = this.refs.stage,
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgageFigure的大小
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左侧图片的位置 水平范围
    this.Constant.hPosRange.leftSecx[0] = -halfImgW;
    this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;
    //计算右侧图片的位置 水平范围
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    //计算水平图片的位置 竖直范围
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上侧图片的位置 竖直范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    //计算上侧图片的位置 水平范围
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(2);

  }
  render() {
    var controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach(function (element, index) {
      if (!this.state.imgsArranageArr[index]) {
        this.state.imgsArranageArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate:0,
          isInverse:false, //图片正反面
          isCenter:false //图片是否居中
        }
      }

      imgFigures.push(<ImgFigure data={element} ref={'imgFigure' + index}
           inverse={this.inverse(index)} key={index} arrange={this.state.imgsArranageArr[index]} center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArranageArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }, this);

    return (
      <section className='stage' ref='stage'>
        <section className='img-src'>
          {imgFigures}
        </section>
        <nav className='controller-nav'>
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
