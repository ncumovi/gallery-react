require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';


//获取相关图片的数据
var imageDatas = require('../data/imageDatas.json');

//利用执行函数 将图片信息转化成图片URL路径信息
imageDatas = (function genImageUrl(imageDatasArr){
  for(var i=0;i<imageDatasArr.length;i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require('../images/'+singleImageData.fileName); //结合require处理图片的地址
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);




class AppComponent extends React.Component {
  render() {
    return (
     <section className='stage'>
       <section className='img-src'></section>
       <nav className='controller-nav'></nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
