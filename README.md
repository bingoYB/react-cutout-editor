# React Cutout Editor

一个用于图片抠图编辑的 React 组件。支持手动涂抹区域、橡皮擦、缩放、拖拽等功能。

A React component for image cutout and editing. Supports manual brush selection, eraser, zoom, drag and other features.

在线体验地址: https://bingoyb.github.io/react-cutout-editor/custom-demo/

示例代码: https://github.com/bingoYB/react-cutout-editor/tree/dev/examples/custom-demo

[![npm version](https://img.shields.io/npm/v/react-cutout-editor.svg)](https://www.npmjs.com/package/react-cutout-editor)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-cutout-editor)](https://bundlephobia.com/package/react-cutout-editor)
[![Coverage Status](https://coveralls.io/repos/github/bingoYB/react-cutout-editor/badge.svg?branch=main)](https://coveralls.io/github/bingoYB/react-cutout-editor?branch=main)
[![React Version](https://img.shields.io/badge/react-%3E=16.8.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性 Features

- 🎨 支持手动涂抹选择区域 Manual brush selection
- ✨ 支持橡皮擦功能 Eraser tool
- 🔍 支持图片缩放和拖拽 Image zoom and drag
- 🎯 支持框选功能 Rectangle selection
- 📦 支持导入蒙版图片 Import mask image
- 💾 支持导出蒙版和处理后的图片 Export mask and processed image
- ↩️ 支持撤销和重做操作 Undo and redo operations
- 🎭 支持蒙版反转 Mask inversion

## 安装 Installation

```bash
npm install react-cutout-editor
```

## 使用示例 Usage Examples

### 基础用法 Basic Usage

```jsx
import { ImageEditor } from 'react-cutout-editor';

function App() {
  return <ImageEditor imgUrl="path/to/your/image.jpg" maskColor="#df4b26" maskOpacity={0.5} />;
}
```

### 高级用法 Advanced Usage

#### 导入蒙版图片 Import Mask Image

```jsx
import { ImageEditor } from 'react-cutout-editor';

function App() {
  return (
    <ImageEditor
      imgUrl="path/to/your/image.jpg"
      maskImgUrl="path/to/your/mask.png"
      maskColor="#df4b26"
      maskOpacity={0.5}
    />
  );
}
```

#### 自定义遮罩判断函数 Custom Mask Detection Function

```jsx
import { ImageEditor } from 'react-cutout-editor';

function App() {
  // 自定义判断像素是否为遮罩的函数
  // Custom function to determine if a pixel is part of the mask
  const customMaskFn = (r, g, b, a) => {
    // 判断是否为黑色像素
    // Check if pixel is black
    return r < 50 && g < 50 && b < 50;
  };

  return (
    <ImageEditor
      imgUrl="path/to/your/image.jpg"
      maskImgUrl="path/to/your/mask.png"
      isMaskFn={customMaskFn}
    />
  );
}
```

#### 框选区域回调 Selection Area Callback

```jsx
import { ImageEditor } from 'react-cutout-editor';

function App() {
  const handleFrameSelected = (start, end) => {
    console.log('Selection start position:', start);
    console.log('Selection end position:', end);
    // 处理选区数据
    // Process selection data
  };

  return (
    <ImageEditor
      imgUrl="path/to/your/image.jpg"
      onFrameSelected={handleFrameSelected}
    />
  );
}
```

#### 自定义编辑器功能区域 Custom Editor Controls
示例: https://bingoyb.github.io/react-cutout-editor/custom-demo/

```jsx
import { ImageEditor, EditorContextProvider, useEditorContext } from 'react-cutout-editor';

// 自定义工具栏组件
// Custom toolbar component
function CustomToolbar() {
  const { mode, setMode, lineWidth, setLineWidth, scale, setScale, undo, redo } = useEditorContext();

  return (
    <div>
      <button onClick={() => setMode('drawLine')}>画笔工具 Brush</button>
      <button onClick={() => setMode('erase')}>橡皮擦 Eraser</button>
      <input
        type="range"
        value={lineWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
        min="1"
        max="100"
      />
      <button onClick={undo}>撤销 Undo</button>
      <button onClick={redo}>重做 Redo</button>
      <button onClick={() => setScale(scale + 0.1)}>放大 Zoom In</button>
      <button onClick={() => setScale(scale - 0.1)}>缩小 Zoom Out</button>
    </div>
  );
}

// 使用 EditorContextProvider 包装应用
// Wrap application with EditorContextProvider
function App() {
  return (
    <EditorContextProvider initialState={{ mode: 'drawLine', lineWidth: 20, scale: 1 }}>
      <CustomToolbar />
      <ImageEditor imgUrl="path/to/your/image.jpg" />
    </EditorContextProvider>
  );
}
```

## ImageEditor API

| 属性 Property | 类型 Type | 默认值 Default | 描述 Description |
| ------------- | --------- | -------------- | ---------------- |
| imgUrl | string | - | 要处理的图片地址 Image URL to process |
| maskImgUrl | string | - | 蒙层初始化图片地址 Initial mask image URL |
| maskColor | string | '#df4b26' | 蒙层颜色 Mask color |
| maskOpacity | number | 0.5 | 蒙层透明度 Mask opacity |
| onFrameSelected | (start: IPosition, end: IPosition) => void | - | 框选区域时的回调函数 Callback when area is selected |
| isMaskFn | (r: number, g: number, b: number, a: number) => boolean | - | 自定义判断 mask 图片是否是遮罩部分的函数 Custom function to determine if a pixel is part of the mask |
| classname | string | - | 自定义容器类名 Custom container class name |
| height | number|string | - | 容器高度 Container height |

## Context API

### EditorContextProvider

提供编辑器状态管理的上下文环境。
Provides context environment for editor state management.

```typescript
interface EditorState {
  mode: 'drawLine' | 'erase' | 'view' | 'frameSelect';
  lineWidth: number;
  scale: number;
  maskReverse?: boolean;
  processReverse?: boolean;
}

interface EditorContextProviderProps {
  children: ReactNode;
  initialState?: Partial<EditorState>;
}
```

### useEditorContext

用于获取和控制编辑器状态的 Hook。
Hook for accessing and controlling editor state.

```typescript
interface EditorContextValue {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  maskReverse?: boolean;
  toggleMaskReverse: () => void;
  processReverse?: boolean;
  toggleProcessReverse: () => void;
  scale: number;
  setScale: (scale: number) => void;
  undo: () => void;
  redo: () => void;
}
```

## 类型定义 Type Definitions

```typescript
interface IPosition {
  x: number;
  y: number;
}
```

## License

MIT
