import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useLoginUser } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '../../store/userAtom';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const loginMutation = useLoginUser();
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    loginMutation.mutate(credentials, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setSuccess(true); 
        setTimeout(() => navigate('/'), 1500);
      },
      onError: (error) => {
        console.error('Login failed:', error);
        setError('Login failed. Please check your credentials.');
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">Login</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Username"
        name="username"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        onChange={handleChange}
        required
      />

      <Button type="submit" variant="contained" fullWidth disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
