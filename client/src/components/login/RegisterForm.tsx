import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Alert, IconButton, InputAdornment, Avatar, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import { registerValidationSchema } from '../../types/validations/UserValidation';
import { useCurrentUser, useRegisterUser } from '../../hooks/useAuth';
import styles from '../../styles/RegisterForm.module.scss';
import { useNavigate } from 'react-router-dom';


const RegisterForm: React.FC = () => {
  const registerMutation = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  
  
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      profilePicture: null as File | null,
      isActive: true,
      joinDate: new Date(),
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values, { resetForm, setSubmitting, setErrors }) => {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value as string | Blob);
        }
      });

      console.log("user", data);
      registerMutation.mutate(data, {
        onSuccess: () => {
          alert('Registration successful! Redirecting to login...');
          resetForm();
          setPreview(null);
          setIsImageUploaded(false);
          setSubmitting(false);
          navigate('/');
        },
        onError: (err) => {
          console.error('Registration failed:', err);
          setErrors({ email: 'Registration failed. Please try again.' });
          setSubmitting(false);
        },
      });
    },
  });


  return (
    <Box component="form" onSubmit={formik.handleSubmit} className={styles.formContainer}>
      <Typography variant="h5" gutterBottom className={styles.title}>
        Register
      </Typography>

      {formik.errors.email && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formik.errors.email}
        </Alert>
      )}

      <Box className={styles.flexContainer}>
        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />

        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
      </Box>

      <TextField
        label="Username"
        name="username"
        fullWidth
        margin="normal"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
      />

      <Box className={styles.flexContainer}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          label="Phone"
          name="phone"
          fullWidth
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />
      </Box>

      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

<TextField
        select
        label="Role"
        name="role"
        fullWidth
        margin="normal"
        value={formik.values.role}
        onChange={formik.handleChange}
      >
        <MenuItem value="user">user</MenuItem>
        {currentUser && currentUser.user?.role === 'admin' && (

          <MenuItem value="admin">admin</MenuItem>
        )}
      </TextField>

      <Box className={styles.flexContainer}>
        {preview && (
          <Box className={styles.avatarContainer}>
            <Avatar src={preview} className={styles.avatar} />
          </Box>
        )}
        <Button
          variant="contained"
          component="label"
          className={`${styles.uploadButton} ${isImageUploaded ? styles.uploaded : ''}`}
        >
          {isImageUploaded ? 'Change Profile Image' : 'Upload Profile Picture'}
          <input
            type="file"
            name="profilePicture"
            hidden
            onChange={(event) => {
              if (event.currentTarget.files && event.currentTarget.files[0]) {
                const file = event.currentTarget.files[0];
                formik.setFieldValue('profilePicture', file);
                setPreview(URL.createObjectURL(file));
                setIsImageUploaded(true);
              }
            }}
            accept="image/*"
          />
        </Button>
      </Box>

      <Button type="submit" variant="contained" fullWidth className={styles.submitButton} disabled={formik.isSubmitting}>
        Register
      </Button>

    </Box>
  );
};

export default RegisterForm;

