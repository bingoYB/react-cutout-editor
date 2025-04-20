import styled from 'styled-components';
import { EditorContextProvider } from './components/Context';
import { EditorCore, type ImageEditorProps } from './components/Editor';
import { ToolControlPanel } from './components/Tools';
import { EditorMode } from './types';

const Container = styled.div.attrs({
  className: 'cutor-editor',
})`
  height: 100%;
  width: 100%;

  .cutor-editor-container {
    height: calc(100% - 84px);
  }

  .cutor-editor-tools {
    margin-top: 24px;
    justify-content: center;
  }
`;
export default function CutoutEditor(
  props: ImageEditorProps & {
    height: number | string;
  }
) {
  return (
    <Container style={{ height: props.height }}>
      <EditorContextProvider
        initialState={{
          mode: EditorMode.FrameSelect,
        }}>
        <EditorCore {...props} />
        <ToolControlPanel className="cutor-editor-tools" />
      </EditorContextProvider>
    </Container>
  );
}
