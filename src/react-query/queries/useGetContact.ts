import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../contstants'
import { getContact } from '../queryFunctions'

export const contactQuery = (id: string) => ({
  queryKey: [queryKeys.contacts, id],
  queryFn: async () => getContact(id),
})
export function useGetContact(id: string) {
  return useQuery(contactQuery(id))
}
