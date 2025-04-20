import styled from 'styled-components';

export const EditorContainer = styled.div.attrs({
  className: 'cutor-editor-container',
})`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const EditorPanel = styled.div.attrs({
  className: 'cutor-editor-panel',
})`
  background-color: #d1d5db;
  padding: 0.75rem;
  width: 50%;
  max-width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

export const ImageContainer = styled.div.attrs({
  className: 'cutor-editor-image-container',
})<{ width: number; height: number; $isViewMode: boolean }>`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  cursor: ${props => (props.$isViewMode ? 'move' : 'default')};
`;
