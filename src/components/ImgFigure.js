import React from 'react';
import ReactDOM from 'react-dom';

//单个图片
class ImgFigure extends React.Component {

    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);  //新版的react绑定的事件里面拿不到当前的this对象 需要先绑定
    }

    //图片点击处理函数
    handleClick(e){

      if(this.props.arrange.isCenter){
        this.props.inverse();
      }else{
        this.props.center();
      }


      e.stopPropagation();
      e.preventDefault();

    }

    render() {
      var styleObj = {};

      //如果props属性中指定了这张图位置 则使用
      if (this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
      }

      //如果图片的旋转角度不为0 添加旋转角度
      if (this.props.arrange.rotate) {
          //兼容浏览器的css3写法
          // (['-moz-','-ms-','-webkit-','']).forEach(function(v){

          //   styleObj[v+'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';

          // }.bind(this))

          styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';

      }

      if (this.props.arrange.isCenter) {
        styleObj.zIndex = 11;
      }


      var imgFigureClassName = 'img-figure';
          imgFigureClassName += this.props.arrange.isInverse ? '  is-inverse' : '';

      return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
          <img src={this.props.data.imageUrl} alt={this.props.data.title}></img>
          <figcaption>
            <h2 className='img-title'>{this.props.data.title}</h2>
            <div className='img-back' onClick={this.handleClick}>
              <p>{this.props.data.desc}</p>
            </div>
          </figcaption>
        </figure>
      );
    }
  }

  export default ImgFigure;
