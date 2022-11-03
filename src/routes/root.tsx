import React, { useEffect } from 'react'
import {
  Outlet,
  useLoaderData,
  useNavigation,
  Form,
  redirect,
  NavLink,
  LoaderFunction,
  ActionFunction,
} from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { createContact } from '../react-query/queryFunctions'
import {
  useGetContacts,
  contactsQuery,
} from '../react-query/queries/useGetContacts'
import { contactQuery } from '../react-query/queries/useGetContact'
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

export default function Root() {
  const { q, queryClient } = useLoaderData() as {
    q: string
    queryClient: QueryClient
  }
  const { data: contacts } = useGetContacts(q)
  const navigation = useNavigation()

  return (
    <>
      <div id="sidebar">
        <Form method="post">
          <button className="btn btn-success w-full mt-8" type="submit">
            New
          </button>
        </Form>
        <nav>
          {contacts?.length ? (
            <ul className="menu bg-base-100 p-2 rounded-box">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* prefetch route data - will want to abstract to a custom component */}
                  <NavLink
                    onMouseEnter={() =>
                      queryClient.getQueryData([
                        queryKeys.contacts,
                        contact.id,
                      ]) ?? queryClient.fetchQuery(contactQuery(contact.id))
                    }
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  )
}
