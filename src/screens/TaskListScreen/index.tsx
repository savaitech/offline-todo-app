import React, { useMemo, useCallback } from 'react';
import { FlatList, Button, Text, View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import TaskItem from '../../components/Tasks/TaskItem';
import { useTasks } from '../../contexts/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useTranslation } from 'react-i18next';
import useNetworkStatus from '../../hooks/useNetworkStatus';

type TaskDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetails'>;

const TaskListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, toggleTask, deleteTask } = useTasks();
  
  const isOnline = useNetworkStatus();
  const navigation = useNavigation<TaskDetailsNavigationProp>();
  
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.completed ? 1 : -1));
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

const RetryButton = styled.TouchableOpacity`
  background-color: #d32f2f;
  padding: 5px 10px;
  border-radius: 5px;
`;

const RetryButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
`;

const PlaceholderContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding: 10px;
`;

export default TaskListScreen;
