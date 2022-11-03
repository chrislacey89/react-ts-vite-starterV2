import { redirect } from 'react-router-dom'
import { deleteContact } from '../react-query/queryFunctions'

export async function action({ params }) {
  await deleteContact(params.contactId)
  return redirect('/')
}
