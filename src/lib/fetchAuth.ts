import { createServerFn } from '@tanstack/react-start'
import { auth } from './mockAuth'

export const fetchAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const authResult = await auth()
  const token = await authResult.getToken()

  return {
    userId: authResult.userId,
    token,
  }
})
