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




      e.stopPropagation();
      e.preventDefault();

    }

    render() {



      return (
       <span className='controller-unit' onClick={this.handleClick}>
         <i className='iconfont icon-jiantouarrow476-copy'></i>
       </span>
      );
    }
  }

  export default ControllerUnit;
