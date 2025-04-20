import styled, { css } from 'styled-components';

export const Container = styled.div<{ className?: string }>`
  display: flex;
  gap: 0.5rem;
  ${props => props.className}
`;

export const ToolBar = styled.div<{ className?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6b7280;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: white;
  width: fit-content;
  ${props => props.className}
`;

export const ToolButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  border: none;
  background-color: transparent;
  cursor: pointer;
  color: white;
  line-height: 0;

  &:hover {
    background-color: #9ca3af;
  }

  &:focus {
    outline: none;
  }

  ${props =>
    props.$isActive &&
    css`
      background-color: #9ca3af;
    `}
`;

export const Divider = styled.div`
  height: 1rem;
  width: 1px;
  background-color: #9ca3af;
  margin: 0 0.25rem;
`;

export const BrushSizeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6b7280;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: white;
`;

export const BrushSizeLabel = styled.span`
  font-size: 0.75rem;
  white-space: nowrap;
`;

export const BrushSizeInput = styled.input`
  width: 100%;
  height: 0.375rem;
  background-color: #9ca3af;
  border-radius: 0.5rem;
  appearance: none;
  cursor: pointer;
`;

export const BrushSizeValue = styled.span`
  font-size: 0.75rem;
  min-width: 1.5rem;
  text-align: center;
`;

export const ZoomContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6b7280;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: white;
  width: fit-content;
`;

export const ZoomValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 2.5rem;
  text-align: center;
`;

export const IconWrapper = styled.div`
  svg {
    height: 20px;
    width: 20px;
  }
`;
