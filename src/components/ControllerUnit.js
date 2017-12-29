import React from 'react';
import ReactDOM from 'react-dom';

//控制组件
class ControllerUnit extends React.Component {

    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);  //新版的react绑定的事件里面拿不到当前的this对象 需要先绑定
    }

    //控制组件点击处理函数
    handleClick(e){
      //如果点击的是当前正在选中的按钮 则翻转图片 否则将对应的图片居中
      if(this.props.arrange.isCenter){
        this.props.inverse();
      }else{
        this.props.center();
      }



      e.stopPropagation();
      e.preventDefault();

    }

    render() {
      var controllerUnitClassName = 'controller-unit';

      //如果对应的是居中的图片 显示控制按钮的居中态
      if(this.props.arrange.isCenter){
        controllerUnitClassName += ' is-center';
        //如果同时对应的是翻转图片 显示控制按钮的翻转态
        if(this.props.arrange.isInverse){
          controllerUnitClassName += ' is-inverse';
        }
      }


      return (
       <span className={controllerUnitClassName} onClick={this.handleClick}>
         <i className='iconfont icon-jiantouarrow476-copy'></i>
       </span>
      );
    }
  }

  export default ControllerUnit;
