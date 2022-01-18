import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './authRoutes';
import { AppRoutes } from './appRoutes';

import { useAuth } from '../hooks/auth';

export function Routes(){
  const { user } = useAuth();
  return(
    <NavigationContainer>
      {user.id ? <AppRoutes/> : <AuthRoutes />}
    </NavigationContainer>
  );
}