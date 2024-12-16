import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Task } from '../../types';
import { AnimatedContainer, Content, Title } from './TaskItem.styles';

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
      layout={LinearTransition.springify()}
      entering={FadeIn}
      exiting={FadeOut}
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

export default TaskItem;
