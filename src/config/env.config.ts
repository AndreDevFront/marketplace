interface EnvironmentConfig {
  readonly API_BASE_URL: string
  readonly APP_NAME: string
  readonly APP_VERSION: string
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly IS_DEV: boolean
  readonly IS_PROD: boolean
  readonly IS_TEST: boolean
}

const getRequiredEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue

  if (!value) {
    throw new Error(`Environment variable ${key} is required but not defined`)
  }

  return value
}

const getOptionalEnvVar = (key: string, defaultValue: string): string => {
  return import.meta.env[key] || defaultValue
}

export const env: EnvironmentConfig = {
  API_BASE_URL: getRequiredEnvVar(
    'VITE_API_BASE_URL',
    'https://cards-marketplace-api-2fjj.onrender.com'
  ),
  APP_NAME: getOptionalEnvVar('VITE_APP_NAME', 'Cards Marketplace'),
  APP_VERSION: getOptionalEnvVar('VITE_APP_VERSION', '1.0.0'),
  NODE_ENV: (import.meta.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  IS_TEST: import.meta.env.NODE_ENV === 'test'
}

if (!env.API_BASE_URL.startsWith('http')) {
  throw new Error('API_BASE_URL must be a valid URL starting with http/https')
}

if (env.IS_DEV) {
  console.log('🔧 Environment Configuration:', {
    API_BASE_URL: env.API_BASE_URL,
    APP_NAME: env.APP_NAME,
    NODE_ENV: env.NODE_ENV
  })
}
