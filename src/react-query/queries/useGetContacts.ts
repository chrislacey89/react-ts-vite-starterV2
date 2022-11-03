import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../contstants'
import { getContacts } from '../queryFunctions'

export const contactsQuery = (query: string) => ({
  queryKey: [queryKeys.contacts],
  queryFn: async () => getContacts(query),
})
export function useGetContacts(query: string) {
  return useQuery(contactsQuery(query))
}
