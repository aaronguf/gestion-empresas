import { useState } from 'react';

export function useDelete(endpoint) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function deleteData() {
    setLoading(true);
    setError(null); // Resetear error antes de realizar la solicitud
    try {
      const response = await fetch(`http://localhost:1234${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text(); // Obtener el texto de error de la respuesta
        throw new Error(errorText || 'Error en la solicitud');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { deleteData, error, loading };
}
