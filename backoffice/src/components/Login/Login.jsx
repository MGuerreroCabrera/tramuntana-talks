import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login, requestPasswordRecovery } from '../../services/authService'
import './Login.css'
import logoEmprenbit from '../../../../assets/logo-emprenbit.jpg'

const emailValidation = {
  required: 'El correo electrónico es obligatorio',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Introduce un correo electrónico válido',
  },
}

const Login = ({ onLoginSuccess, sessionMessage }) => {
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleLoginSubmit = async (values) => {
    setFormError('')
    setFormSuccess('')

    try {
      const session = await login(values)
      onLoginSuccess(session)
    } catch (error) {
      setFormError(error.message || 'No se pudo iniciar sesión')
    }
  }

  const handleRecoverySubmit = async ({ email }) => {
    setFormError('')
    setFormSuccess('')

    try {
      await requestPasswordRecovery(email)
      setFormSuccess('La cuenta existe. Ya se puede continuar con la recuperación de contraseña.')
      reset({ email: '' })
    } catch (error) {
      setFormError(error.message || 'No se pudo validar el correo electrónico')
    }
  }

  const handleToggleMode = () => {
    setIsRecoveryMode((currentMode) => !currentMode)
    setIsPasswordVisible(false)
    setFormError('')
    setFormSuccess('')
    reset()
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((currentValue) => !currentValue)
  }

  return (
    <main className="login-page">
      <section className="login-shell" aria-labelledby="login-title">
        <div className="login-brand-panel" aria-hidden="true">
          <div className="login-brand-content">
            <span className="login-kicker">Backoffice</span>
            <h2>Gestión clara para un evento que merece precisión.</h2>
            <p>Tramuntana Talks combina tecnología, emprendimiento y una experiencia mediterránea cuidada hasta el último detalle.</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-header">
            <img className="login-logo" src={logoEmprenbit} alt="Emprenbit" />
            <p className="login-eyebrow">Tramuntana Talks</p>
            <h1 id="login-title">{isRecoveryMode ? 'Recuperar contraseña' : 'Acceso backoffice'}</h1>
            <p>
              {isRecoveryMode
                ? 'Introduce tu correo para validar que la cuenta existe en el sistema.'
                : 'Accede con tus credenciales para gestionar el evento.'}
            </p>
          </div>

          {sessionMessage ? (
            <p className="login-alert login-alert--info" role="status" aria-live="polite">
              {sessionMessage}
            </p>
          ) : null}
          {formError ? (
            <p className="login-alert login-alert--error" role="alert">
              {formError}
            </p>
          ) : null}
          {formSuccess ? (
            <p className="login-alert login-alert--success" role="status" aria-live="polite">
              {formSuccess}
            </p>
          ) : null}

          <form
            className="login-form"
            onSubmit={handleSubmit(isRecoveryMode ? handleRecoverySubmit : handleLoginSubmit)}
            noValidate
          >
            <div className="form-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="mguerrero@fundaciobit.org"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', emailValidation)}
              />
              {errors.email ? (
                <span className="field-error" id="email-error">
                  {errors.email.message}
                </span>
              ) : null}
            </div>

            {!isRecoveryMode ? (
              <div className="form-field">
                <label htmlFor="password">Contraseña</label>
                <div className="password-field">
                  <input
                    id="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Introduce tu contraseña"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={isPasswordVisible}
                  >
                    {isPasswordVisible ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M3.28 2 2 3.27l4.02 4.02C3.66 8.82 2 11.1 2 12c0 1.6 5 7 10 7 1.55 0 3.01-.52 4.29-1.27L20.73 22 22 20.73 3.28 2Zm8.55 14.98C8 16.85 4.61 13.33 3.84 12c.5-.86 1.95-2.47 3.51-3.43l1.53 1.53A3.5 3.5 0 0 0 13.9 15.1l1.1 1.1c-.98.48-2.06.78-3.17.78ZM10.17 11.4l2.43 2.43a1.75 1.75 0 0 1-2.43-2.43ZM12 5c5 0 10 5.4 10 7 0 .75-1.1 2.4-2.82 3.88l-1.26-1.26c1.15-.9 2.02-1.95 2.24-2.62C19.39 10.67 16 7 12 7c-.86 0-1.72.17-2.53.47L8.08 6.08A8.75 8.75 0 0 1 12 5Zm.22 3.5a3.5 3.5 0 0 1 3.28 3.28l-3.28-3.28Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M12 5c5 0 10 5.4 10 7s-5 7-10 7S2 13.6 2 12s5-7 10-7Zm0 2c-4 0-7.39 3.67-8.16 5C4.61 13.33 8 17 12 17s7.39-3.67 8.16-5C19.39 10.67 16 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <span className="field-error" id="password-error">
                    {errors.password.message}
                  </span>
                ) : null}
              </div>
            ) : null}

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Procesando...'
                : isRecoveryMode
                  ? 'Validar correo'
                  : 'Iniciar sesión'}
            </button>
          </form>

          <button className="link-button" type="button" onClick={handleToggleMode}>
            {isRecoveryMode ? 'Volver al login' : '¿Olvidaste tu contraseña?'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default Login
