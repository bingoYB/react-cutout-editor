// 初始化React
import React from 'react';
// 初始化ReactDOM
import ReactDOM from 'react-dom/client';
// 初始化App
import Editor from '../src/index';
// 初始化ReactDOM
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const demoImg = new URL('./assets/demo2_mask.jpg', import.meta.url).href;
const maskImg = new URL('./assets/demo2.png', import.meta.url).href;
// 渲染App
root.render(
  React.createElement(Editor, {
    imgUrl: demoImg,
    maskImgUrl: maskImg,
    height: 700,
  })
);
