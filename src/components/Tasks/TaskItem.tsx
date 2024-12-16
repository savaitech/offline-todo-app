import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Animated, {
  LinearTransition,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { Task } from '../../types';

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const taskStatusIcon = task.completed ? 'checkmark-circle' : 'ellipse-outline';
  const taskStatusColor = task.completed ? '#4CAF50' : '#888';

  const syncStatusIcon = task.syncedAt ? 'cloud-done' : 'cloud-offline';
  const syncStatusColor = task.syncedAt ? '#1E90FF' : '#888';

  return (
    <AnimatedContainer
      layout={LinearTransition.springify().damping(15).stiffness(50)}
      entering={FadeInDown.duration(0)}
      exiting={FadeOutUp.duration(0)}
    >
      <Content>
        <TouchableOpacity onPress={onToggle}>
          <Ionicons name={taskStatusIcon} size={24} color={taskStatusColor} />
        </TouchableOpacity>

        <Title completed={task.completed} numberOfLines={1} ellipsizeMode="tail">
          {task.todo}
        </Title>
      </Content>

      <Ionicons name={syncStatusIcon} size={24} color={syncStatusColor} />
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash" size={24} color="#FF5C5C" />
      </TouchableOpacity>
    </AnimatedContainer>
  );
};

// Styled Components
const AnimatedContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-vertical: 5px;
  background-color: #fff;
  border-radius: 8px;
  elevation: 1;
`;

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const Title = styled.Text<{ completed: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ completed }) => (completed ? '#888' : '#333')};
  text-decoration-line: ${({ completed }) => (completed ? 'line-through' : 'none')};
  flex-shrink: 1;
`;

export default TaskItem;
