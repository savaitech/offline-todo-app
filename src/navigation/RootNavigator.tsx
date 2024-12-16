import '../../locales/i18n'; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createStackNavigator } from '@react-navigation/stack';

import TaskListScreen from '../screens/TaskListScreen';
import TaskAddScreen from '../screens/TaskDetailsScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="TaskListScreen">
      <Stack.Screen 
        name="TaskListScreen" 
        component={TaskListScreen} 
        options={{ title: t('appName') }} 
      />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskAddScreen} 
        options={{ title: t('tasks.newTask')  }} 
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
