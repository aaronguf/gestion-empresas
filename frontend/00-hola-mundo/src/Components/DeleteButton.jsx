import { Button } from '@chakra-ui/react';
import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons'; 
import { useDelete } from '../Hooks/useDelete.js';

export function DeleteButton({ id }) { // Usa 'id' en lugar de 'key'
  const { deleteData, error, loading } = useDelete();

  const handleDelete = () => {
    console.log('ID recibido:', id); // Asegúrate de que el ID se está recibiendo
    if (id) {
      deleteData(`/empresas/${id}`);
    } else {
      console.error('Id no proporcionado para eliminar');
    }
  };
  
  return (
    <Button colorScheme="red" onClick={handleDelete} isLoading={loading}>
      <DeleteIcon />
      {error && <p>{error}</p>}
    </Button>
  );
}
