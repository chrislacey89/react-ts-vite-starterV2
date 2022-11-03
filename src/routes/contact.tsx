import React from 'react'
import { Form, useFetcher, useParams } from 'react-router-dom'

import { useGetContact } from '../react-query/queries/useGetContact'

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
