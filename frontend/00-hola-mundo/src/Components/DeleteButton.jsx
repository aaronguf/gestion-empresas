import { Button, useToast } from '@chakra-ui/react';
import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons'; 
import { useDelete } from '../Hooks/useDelete.js';

export function DeleteButton( {id} ) { 
  const { deleteData, error, loading } = useDelete(`/empresas/${id}`);
  const toast = useToast(); // Ayuda de IA para buscar documentacion de chakra y enviar el toast

  const handleDelete = async () => {
    console.log('ID recibido:', id); 
    if (id) {
      try {
        await deleteData(); 
        toast({
          title: 'Empresa eliminada.',
          description: "La empresa se ha eliminado exitosamente.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setTimeout(() => {window.location.reload()}, 1000)
      } catch (err) {
        toast({
          title: 'Error al eliminar empresa.',
          description: err.message || "Ocurrió un error inesperado.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
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
