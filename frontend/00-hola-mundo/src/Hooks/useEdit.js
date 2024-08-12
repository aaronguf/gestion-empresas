import { useState } from 'react';

export function useEdit(endpoint, method = 'PATCH') { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editData = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:1234${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;

    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editData, error, loading };
}
