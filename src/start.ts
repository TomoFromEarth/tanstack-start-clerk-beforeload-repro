import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from '@tanstack/react-start'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

const mockRequestMiddleware = createMiddleware().server(async ({ next }) => {
  return next()
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [csrfMiddleware, mockRequestMiddleware],
  }
})
