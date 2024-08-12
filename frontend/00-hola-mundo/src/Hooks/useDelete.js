import { useState } from 'react'

export function useDelete(endpoint) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function deleteData(endpoint) {
    setLoading(true)
    setError(null) //Apoyo con IA
    try {
      const response = await fetch(`http://localhost:1234${endpoint}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error en la solicitud')
      }
    } catch (err) {
      setError(err.message)//Apoyo con IA
    } finally {
      setLoading(false)
    }
  }

  return { deleteData: () => deleteData(endpoint), error, loading } //Apoyo con IA
}
