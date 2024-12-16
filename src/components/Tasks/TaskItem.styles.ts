
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

// Styled Components
export const AnimatedContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-vertical: 5px;
  background-color: #fff;
  border-radius: 8px;
  elevation: 3;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Title = styled.Text<{ completed: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ completed }) => (completed ? '#888' : '#333')};
  text-decoration-line: ${({ completed }) => (completed ? 'line-through' : 'none')};
  flex-shrink: 1;
`;
