import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../contstants'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

async function getTodos(): Promise<Todo[]> {
  const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/users/1/todos',
  )
  return data
}
export function useGetTodos() {
  return useQuery([queryKeys.todos], getTodos)
}
