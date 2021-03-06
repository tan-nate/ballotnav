import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from 'components/use-auth'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { useToast } from 'components/use-toast'
import { Button, TextField, Grid } from '@material-ui/core'

const validationSchema = Yup.object({
  email: Yup.string().email().required('Required'),
  password: Yup.string().required('Required'),
});

function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const {
    handleSubmit,
    handleChange,
    errors,
    touched,
    handleBlur,
    values,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit(values, { setSubmitting }) {
      login(values).catch((error) => {
        toast({
          severity: 'error',
          autoHideDuration: 3000,
          message: (() => {
            if (error.emailNotFound) return 'email not found'
            if (error.passwordInvalid) return 'password invalid'
            return 'server error'
          })()
        })
        setSubmitting(false)
      })
    },
  })

  return (
    <div style={{ padding: 100, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', fontSize: 30, marginBottom: 20 }}>
        Login
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          id="email"
          label="Email"
          name="email"
          variant="outlined"
          margin="normal"
          fullWidth
          autoComplete="email"
          autoFocus
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.email ? errors.email : ''}
          error={touched.email && Boolean(errors.email)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.password ? errors.password : ''}
          error={touched.password && Boolean(errors.password)}
        />
        <Button
          style={{ marginTop: 20, marginBottom: 20 }}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          margin="normal"
          disabled={isSubmitting}
        >
          Sign In
        </Button>
        <Grid container justify="center">
          <Link to="/register">Need an account? Register here.</Link>
        </Grid>
      </form>
    </div>
  )
}

export default Login
