import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListPage from '../pages/ListPage';
import AuthPage from '../pages/AuthPage';
import StateForm from '../components/state/StateForm';
import PersonalPage from '../pages/PersonalPage';
import UsersPage from '../pages/UsersPage.tsx';
import PermissionsPage from '../pages/PermissionsPage.tsx';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<AuthPage />} />
        
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
        <Route path="/state-form/:id?" element={<StateForm />} />
        
      <Route path="/home" element={<ListPage />} />
      <Route path="/personal" element={<PersonalPage />} />
      </Route>

      <Route path="*" element={<p>Not Found</p>} />
    </Routes>
  );
};

export default AppRoutes;
