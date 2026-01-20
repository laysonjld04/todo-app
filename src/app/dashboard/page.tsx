'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'


export default function Dashboard() {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )


  const fetchTodos = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return <Loading />

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setTodos(data)
  }

  const addTodo = async () => {
    if (!task.trim()) return

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('todos').insert([
      {
        text: task,
        is_done: false,
        user_id: user.id
      }
    ])

    if (!error) {
      setTask('')
      fetchTodos()
    }
  }

  const toggleTodo = async (todo: any) => {
    const { error } = await supabase
        .from('todos')
        .update({ is_done: !todo.is_done })
        .eq('id', todo.id)

    if (!error) fetchTodos()
  }

    const deleteTodo = async (id: string) => {
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

    if (!error) fetchTodos()
  }


  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="p-6 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">My Todos</h2>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="New task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="bg-blue-600 text-white p-2" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((t: any) => (
            <li
                key={t.id}
                className="border p-2 rounded flex justify-between items-center"
                >
                <span className={t.is_done ? "line-through opacity-60" : ""}>
                    {t.text}
                </span>
                
                <div className="flex gap-2">
                    <button
                    onClick={() => toggleTodo(t)}
                    className="px-2 py-1 border rounded"
                    >
                    {t.is_done ? "Undo" : "Done"}
                    </button>
                    <button
                    onClick={() => deleteTodo(t.id)}
                    className="px-2 py-1 border rounded text-red-600"
                    >
                    Delete
                    </button>
                </div>
            </li>

        ))}
      </ul>
    </div>
  )
}
