import { useState, useEffect } from 'react';

export function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:1234${endpoint}`);
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        console.log(data)
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, error, loading };
}
