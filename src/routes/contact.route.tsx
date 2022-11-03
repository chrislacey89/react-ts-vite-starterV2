import React from 'react'
import { LoaderFunction, ActionFunction } from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '../react-query/contstants'
import { updateContact, ContactInfo } from '../react-query/queryFunctions'
import { contactQuery } from '../react-query/queries/useGetContact'

export function action(queryClient: QueryClient): ActionFunction {
  return async function update({ request, params }) {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData) as ContactInfo

    if (params.contactId) {
      await updateContact(params.contactId, {
        ...updates,
        favorite: formData.get('favorite') === 'false',
      })
    }
    await queryClient.invalidateQueries([queryKeys.contacts])
  }
}

export function loader(queryClient: QueryClient): LoaderFunction {
  return async function load({ params }) {
    if (params.contactId) {
      const query = contactQuery(params.contactId)

      queryClient.getQueryData(query.queryKey) ??
        (await queryClient.fetchQuery(query))
    }
  }
}

export const Component = React.lazy(() => import('./contact'))
