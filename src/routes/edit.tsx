import React from 'react'
import {
  Form,
  redirect,
  useNavigate,
  ActionFunction,
  useParams,
} from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { updateContact, ContactInfo } from '../react-query/queryFunctions'
import { queryKeys } from '../react-query/contstants'
import { useGetContact } from '../react-query/queries/useGetContact'
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

export default function EditContact() {
  const { contactId } = useParams()

  const { data: contact } = useGetContact(contactId ?? '')
  const navigate = useNavigate()

  return (
    <Form method="post" id="contact-form">
      <label>
        <span>First Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label>
        <span>Last Name</span>
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact?.notes}
          rows={6}
          className="textarea textarea-bordered"
        />
      </label>
      <div className="flex gap-4">
        <button className="btn btn-outline btn-success" type="submit">
          Save
        </button>
        <button
          className="btn btn-outline btn-error"
          type="button"
          onClick={() => {
            navigate(-1)
          }}
        >
          Cancel
        </button>
      </div>
      <input
        type="hidden"
        name="favorite"
        checked={contact?.favorite ?? false}
      />
    </Form>
  )
}
