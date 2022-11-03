import React from 'react'
import { redirect, LoaderFunction, ActionFunction } from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { createContact } from '../react-query/queryFunctions'
import { contactsQuery } from '../react-query/queries/useGetContacts'
import { queryKeys } from '../react-query/contstants'
export function action(queryClient: QueryClient): ActionFunction {
  return async function addContact() {
    const contact = await createContact()
    await queryClient.invalidateQueries([queryKeys.contacts])
    return redirect(`/contacts/${contact.id}`)
  }
}

export function loader(queryClient: QueryClient): LoaderFunction {
  return async function load({
    request,
  }): Promise<{ q: string; queryClient: QueryClient }> {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    const query = contactsQuery(q)
    queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    return { queryClient, q }
  }
}

export const Component = React.lazy(() => import('./root'))
