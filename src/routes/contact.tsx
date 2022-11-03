import React from 'react'
import {
  Form,
  useLoaderData,
  useFetcher,
  LoaderFunction,
  useParams,
  ActionFunction,
} from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '../react-query/contstants'
import { updateContact, ContactInfo } from '../react-query/queryFunctions'
import {
  useGetContact,
  contactQuery,
} from '../react-query/queries/useGetContact'

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
export default function Contact() {
  const { contactId } = useParams()
  const { data: contact } = useGetContact(contactId ?? '')

  return (
    <div className=" flex max-w-xl gap-8">
      <div className="avatar">
        <div className="w-48 mask mask-squircle">
          {contact?.avatar.includes('https') ? (
            <img
              key={contact.avatar}
              src={contact.avatar}
              alt={contact.first}
            />
          ) : (
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content w-48 mask mask-squircle">
                <span className="text-6xl">{contact?.first[0]}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="prose">
        <div className="flex gap-3">
          <h1>
            {contact?.first || contact?.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}
          </h1>
          <Favorite contact={contact} />
        </div>

        {contact?.twitter ? (
          <p>
            <a
              className="link link-primary"
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
              rel="noreferrer"
            >
              @{contact.twitter}
            </a>
          </p>
        ) : null}

        {contact?.notes ? <p>{contact.notes}</p> : null}

        <div className="flex gap-4">
          <Form action="edit">
            <button className="btn btn-outline" type="submit">
              Edit
            </button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button className="btn btn-outline btn-error" type="submit">
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite({ contact }: Contact) {
  const fetcher = useFetcher()

  let favorite = contact?.favorite
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }
  return (
    <fetcher.Form method="post">
      <button
        className="btn btn-circle"
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
      {Object.keys(contact || {}).map((key) => (
        <input key={key} type="hidden" name={key} value={contact[key]} />
      ))}
    </fetcher.Form>
  )
}
