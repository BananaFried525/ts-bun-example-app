import { ENVIRONMENT } from "../constants/environment"

export const configs = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT,
  appName: process.env.APP_NAME || '',
}

export default configs