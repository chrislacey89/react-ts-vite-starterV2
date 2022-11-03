import { toast } from 'react-hot-toast'
import { QueryClient } from '@tanstack/react-query'

// const toast = createStandaloneToast({ theme });

export function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error
      ? // remove the initial 'Error: ' that accompanies many errors
        error.toString().replace(/^Error:\s*/, '')
      : 'error connecting to server'

  // prevent duplicate toasts
  // toast.closeAll();
  toast.error(title, {
    id: title,
  })
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
})
