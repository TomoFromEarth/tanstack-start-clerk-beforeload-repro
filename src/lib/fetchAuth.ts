import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'

export const fetchAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const authResult = await auth()
  const token = await authResult.getToken()

  return {
    userId: authResult.userId,
    token,
  }
})
