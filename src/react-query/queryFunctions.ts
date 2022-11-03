import axios, { AxiosResponse } from 'axios'

export interface Contact {
  avatar: string
  first: string
  last: string
  id: string
  notes: string
  twitter: string
  favorite: boolean
}

export async function getContacts(
  query: string | null,
): Promise<Array<Contact>> {
  if (query?.length) {
    const { data }: AxiosResponse<Array<Contact>> = await axios.get(
      `http://localhost:3001/contacts?q=${query}`,
    )
    return data
  } else {
    const { data } = await axios.get(`http://localhost:3001/contacts`)
    return data
  }
}

export async function getContact(id: string): Promise<Contact> {
  const { data } = await axios.get(`http://localhost:3001/contacts/${id}`)
  return data
}

export interface ContactInfo {
  avatar: string
  first: string
  last: string
  notes: string
  twitter: string
  favorite: boolean
}

const emptyContact: ContactInfo = {
  first: '',
  last: '',
  twitter: '',
  avatar: '',
  notes: '',
  favorite: false,
}
export async function createContact(): Promise<{ id: string }> {
  const { data } = await axios.post(
    'http://localhost:3001/contacts',
    emptyContact,
  )
  return data
}

export async function updateContact(
  id: string,
  contactInfo: ContactInfo,
): Promise<void> {
  await axios.put(`http://localhost:3001/contacts/${id}`, contactInfo)
}

export async function deleteContact(id: string): Promise<void> {
  await axios.delete(`http://localhost:3001/contacts/${id}`)
}
