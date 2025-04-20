import { useRef } from 'react';
import './App.css';
import { EditorCore, EditorContextProvider, useEditorContext, ImageEditorRef, EditorMode, IPosition } from 'react-cutout-editor';
const demoImg = new URL('../assets/demo.webp', import.meta.url).href;
const maskImg = new URL('../assets/demo_mask.png', import.meta.url).href;
// 自定义工具栏组件
function CustomToolbar() {
  const { mode, setMode, lineWidth, setLineWidth, scale, setScale, reverse, toggleReverse } = useEditorContext();

  const editorRef = useRef<ImageEditorRef>(null);

  const isDraw = !reverse ? mode === EditorMode.DrawLine : mode === EditorMode.Erase;
  const isErase = reverse ? mode === EditorMode.DrawLine : mode === EditorMode.Erase;

  const setDraw = () => {
    setMode(reverse ? EditorMode.Erase : EditorMode.DrawLine);
  };

  const setErase = () => {
    setMode(reverse ? EditorMode.DrawLine : EditorMode.Erase);
  };

  return (
    <div className="toolbar">
      <div className="tool-group">
        <button className={isDraw ? 'active' : ''} onClick={setDraw}>
          画笔工具
        </button>
        <button className={isErase ? 'active' : ''} onClick={setErase}>
          橡皮擦
        </button>
        <button
          className={mode === EditorMode.FrameSelect ? 'active' : ''}
          onClick={() => {
            setMode(EditorMode.FrameSelect);
          }}>
          框选工具
        </button>
      </div>

      <div className="tool-group">
        <label>线条粗细：</label>
        <input type="range" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} min="1" max="100" />
        <span>{lineWidth}px</span>
      </div>

      <div className="tool-group">
        <button onClick={() => editorRef.current?.undo()}>撤销</button>
        <button onClick={() => editorRef.current?.redo()}>重做</button>
      </div>

      <div className="tool-group">
        <button onClick={() => setScale(scale + 0.1)}>放大</button>
        <button onClick={() => setScale(scale - 0.1)}>缩小</button>
        <span>{Math.round(scale * 100)}%</span>
      </div>

      <div className="tool-group">
        <button onClick={toggleReverse}>遮罩反转: {reverse ? '开' : '关'}</button>
      </div>
    </div>
  );
}

const App = () => {
  const onFrameSelected = (start: IPosition, end: IPosition) => {
    alert(`框选区域: ${start.x}, ${start.y}, ${end.x}, ${end.y}`);
  };

  return (
    <EditorContextProvider
      initialState={{
        mode: EditorMode.DrawLine,
        lineWidth: 20,
        scale: 1,
        reverse: false,
      }}>
      <div className="editor-container" style={{ height: '500px' }}>
        <CustomToolbar />
        <EditorCore imgUrl={demoImg} maskImgUrl={maskImg} onFrameSelected={onFrameSelected} />
      </div>
    </EditorContextProvider>
  );
};

export default App;
