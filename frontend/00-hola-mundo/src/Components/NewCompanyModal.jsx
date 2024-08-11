import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, Textarea, Checkbox, Select, useToast} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useCreate } from '../Hooks/useCreate.js'

export function NewCompanyModal({ onAddCompany }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [companyName, setCompanyName] = useState('')
  const [constitutionDate, setConstitutionDate] = useState('')
  const [companyType, setCompanyType] = useState('')
  const [comments, setComments] = useState('')
  const [companyFav, setCompanyFav] = useState(false)
  const { postData, error, loading } = useCreate('/empresas', 'POST')
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCompany = {
      company_name: companyName,
      constitution_date: constitutionDate,
      company_type: companyType,
      company_fav: companyFav,
      company_comments: comments
    };

    try {
      await postData(newCompany);
      toast({                  // Ayuda de IA para buscar documentacion de chakra y enviar el toast
        title: 'Empresa creada.',
        description: "La empresa se ha creado exitosamente.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
      setTimeout(() => { window.location.reload();  }, 1000)
      onAddCompany() // Apoyo con IA para recarga de la pagina
    } catch (err) {
      toast({
        title: 'Error al crear empresa.',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>Agregar Empresa</Button>

      <Modal
        initialFocusRef={React.useRef(null)}
        finalFocusRef={React.useRef(null)}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nueva Empresa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                placeholder='Nombre de la empresa'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Fecha de constitución</FormLabel>
              <Input
                type='date'
                value={constitutionDate}
                onChange={(e) => setConstitutionDate(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de empresa</FormLabel>
              <Select
                placeholder='Selecciona el tipo de empresa'
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
              >
                <option value='Usuario final'>Usuario final</option>
                <option value='Distribuidor'>Distribuidor</option>
                <option value='Mayorista'>Mayorista</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Comentarios</FormLabel>
              <Textarea
                placeholder='Agrega tus comentarios'
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Favorito</FormLabel>
              <Checkbox
                isChecked={companyFav}
                onChange={(e) => setCompanyFav(e.target.checked)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit} isLoading={loading}>
              Agregar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
