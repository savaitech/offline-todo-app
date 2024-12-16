import React, { useState } from 'react';
import { Button } from 'react-native';
import styled from 'styled-components/native';
import { useTasks } from '../../contexts/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const TaskAddScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const { addTask } = useTasks();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleAddTask = () => {
    if (title.trim()) {
      addTask(title);
      navigation.goBack();
    }
  };

  return (
    <Container>
      <StyledTextInput
        placeholder={t('tasks.newTask')}
        value={title}
        onChangeText={setTitle}
      />
      <StyledButton title={t('common.save')} onPress={handleAddTask} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const StyledTextInput = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const StyledButton = styled(Button)``;

export default TaskAddScreen;
