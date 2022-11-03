import React from 'react'
import { redirect, ActionFunction } from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { updateContact, ContactInfo } from '../react-query/queryFunctions'
import { queryKeys } from '../react-query/contstants'
export function action(queryClient: QueryClient): ActionFunction {
  return async function update({ request, params }) {
    const formData: FormData = await request.formData()
    const updates = Object.fromEntries(formData) as ContactInfo

    if (params.contactId) {
      await updateContact(params.contactId, updates)
      await queryClient.invalidateQueries([queryKeys.contacts])
      return redirect(`/contacts/${params.contactId}`)
    }
  }
}
export const Component = React.lazy(() => import('./edit'))
