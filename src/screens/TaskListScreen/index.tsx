import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Button } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import TaskItem from '../../components/Tasks/TaskItem';
import { useTasks } from '../../contexts/TaskContext';
import { RootStackParamList } from '../../types';
import useNetworkStatus from '../../hooks/useNetworkStatus';

type TaskDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetails'>;

const TaskListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, toggleTask, deleteTask, clearTasks } = useTasks();
  
  const isOnline = useNetworkStatus();
  const navigation = useNavigation<TaskDetailsNavigationProp>();
  
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Uncompleted tasks should come first
      if (!a.completed && b.completed) return -1;
      if (a.completed && !b.completed) return 1;
  
      // For tasks with the same completion status, sort by updatedAt (descending)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [tasks]);

  return (
    <Container>
      {!isOnline && (
        <OfflineBanner>
          <OfflineText>{t('tasks.offlineMessage')}</OfflineText>
        </OfflineBanner>
      )}
      <Button
        title={t('tasks.addTask')}
        onPress={() => navigation.navigate('TaskDetails', { task: undefined })}
      />
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onEdit={() => navigation.navigate('TaskDetails', { task: item })}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
      />
      <ClearTaskButton
        title={t('tasks.cleanTasks')}
        onPress={() => clearTasks()}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const OfflineBanner = styled.View`
  background-color: #ffcccb;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OfflineText = styled.Text`
  color: #d32f2f;
  font-size: 14px;
`;
const ClearTaskButton = styled.Button`
margin-top: 10px;
background-color: #f44336;
color: white;
padding: 10px;
border-radius: 5px;
`;


export default TaskListScreen;
