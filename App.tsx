import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { TaskProvider } from './src/contexts/TaskContext';

export default function App() {

  return (
    <TaskProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </TaskProvider>
  );
}
