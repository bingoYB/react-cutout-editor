import { useEditorContext } from '../Context';
import { EditorMode } from '../../types';
import { Container, ToolBar, ToolButton, Divider, BrushSizeContainer, BrushSizeLabel, BrushSizeInput, BrushSizeValue, ZoomContainer, ZoomValue, IconWrapper } from './styles';

interface ToolControlPanelProps {
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  onDownload?: () => void;
  className?: string;
}

export function ToolControlPanel({ step = 5, className = '' }: ToolControlPanelProps) {
  const { mode, setMode, lineWidth, setLineWidth, scale, reverse, setScale, undo, redo, toggleReverse, editorRef } = useEditorContext();
  const decreaseZoom = () => {
    setScale(scale - step / 100);
  };

  const increaseZoom = () => {
    setScale(scale + step / 100);
  };

  const downloadImg = () => {
    editorRef.current?.getProcessedImage().then(data => {
      if (!data.img) {
        return;
      }
      const link = document.createElement('a');
      link.href = data.img;
      link.download = 'image.png';
      link.click();
    });
  };

  const isDraw = !reverse ? mode === EditorMode.DrawLine : mode === EditorMode.Erase;
  const isErase = reverse ? mode === EditorMode.DrawLine : mode === EditorMode.Erase;

  const setDraw = () => {
    setMode(reverse ? EditorMode.Erase : EditorMode.DrawLine);
  };

  const setErase = () => {
    setMode(reverse ? EditorMode.DrawLine : EditorMode.Erase);
  };

  return (
    <Container className={className}>
      <ToolBar>
        <ToolButton $isActive={isDraw} onClick={setDraw} aria-label="Hand tool">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
            </svg>
          </IconWrapper>
        </ToolButton>

        <ToolButton $isActive={isErase} onClick={setErase} aria-label="Paint tool">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"></path>
              <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"></path>
              <path d="M14.5 17.5 4.5 15"></path>
            </svg>
          </IconWrapper>
        </ToolButton>

        <ToolButton $isActive={mode === EditorMode.Erase} onClick={() => setMode(EditorMode.Erase)} aria-label="Erase tool">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
              <path d="M22 21H7"></path>
              <path d="m5 11 9 9"></path>
            </svg>
          </IconWrapper>
        </ToolButton>

        <Divider />

        <ToolButton onClick={undo} aria-label="Undo">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M9 14 4 9l5-5"></path>
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"></path>
            </svg>
          </IconWrapper>
        </ToolButton>

        <ToolButton onClick={redo} aria-label="Redo">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="m15 14 5-5-5-5"></path>
              <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"></path>
            </svg>
          </IconWrapper>
        </ToolButton>

        <ToolButton onClick={toggleReverse} aria-label="Flip horizontally">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path>
              <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
              <path d="M12 20v2"></path>
              <path d="M12 14v2"></path>
              <path d="M12 8v2"></path>
              <path d="M12 2v2"></path>
            </svg>
          </IconWrapper>
        </ToolButton>

        <ToolButton onClick={downloadImg} aria-label="Download image">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </IconWrapper>
        </ToolButton>
      </ToolBar>

      {(mode === EditorMode.DrawLine || mode === EditorMode.Erase) && (
        <BrushSizeContainer>
          <BrushSizeLabel>画笔大小:</BrushSizeLabel>
          <BrushSizeInput type="range" min="1" max="100" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} aria-label="Brush size" />
          <BrushSizeValue>{lineWidth}</BrushSizeValue>
        </BrushSizeContainer>
      )}

      <ZoomContainer>
        <ToolButton onClick={decreaseZoom} aria-label="Zoom out">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </IconWrapper>
        </ToolButton>

        <ZoomValue>{Math.round(scale * 100)}%</ZoomValue>

        <ToolButton onClick={increaseZoom} aria-label="Zoom in">
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </IconWrapper>
        </ToolButton>
      </ZoomContainer>
    </Container>
  );
}
