import { Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, Textarea, Checkbox, Select, useToast, Spinner} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useEdit } from '../Hooks/useEdit';
import { useFetchById } from '../Hooks/useFetchById';

export function EditCompanyModal({ id }) { //Apoyo con IA para la funcion de edicion de empresa
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [companyName, setCompanyName] = useState('');
  const [constitutionDate, setConstitutionDate] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [comments, setComments] = useState('');
  const [companyFav, setCompanyFav] = useState(false);

  const { data: company, loading, error } = useFetchById(`/empresas/${id}`);

  const loadCompanyData = () => {
  if (company) {
    setCompanyName(company.company_name);

    if (company.constitution_date) {
      const formattedDate = new Date(company.constitution_date).toISOString().split('T')[0];
      setConstitutionDate(formattedDate);
    } else {
      setConstitutionDate(''); 
    }

    setCompanyType(company.company_type);
    setComments(company.company_comments);
    setCompanyFav(company.company_fav);
  }
};

  useEffect(() => {
    if (isOpen) {
      loadCompanyData();    
    }
  }, [isOpen, company]);

  const { editData, loading: editLoading } = useEdit(`/empresas/${id}`, 'PATCH');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName.trim() || !constitutionDate.trim() || !companyType.trim()) {
      toast({
        title: 'Error al modificar la empresa.',
        description: 'Por favor, no dejes ningun campo obligatorio vacío.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }
      let formattedCompanyFav

      if (companyFav === 0) {
        formattedCompanyFav = false
      } else {
        formattedCompanyFav = true
      }

    const updatedCompany = {
      company_name: companyName,
      constitution_date: constitutionDate,
      company_type: companyType,
      company_fav: formattedCompanyFav,
      company_comments: comments,
    };
    Object.keys(updatedCompany).forEach(key => {
      if (updatedCompany[key] === undefined) {
        delete updatedCompany[key];
      }})

    try {
      await editData(updatedCompany);
      toast({
        title: 'Empresa actualizada.',
        description: 'La empresa se ha actualizado exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setTimeout(() => { window.location.reload();  }, 1000)
    } catch (err) {
      toast({
        title: 'Error al actualizar empresa.',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button colorScheme="yellow" onClick={onOpen}>
        Editar Empresa
      </Button>

      <Modal
        initialFocusRef={React.useRef(null)}
        finalFocusRef={React.useRef(null)}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Empresa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {loading ? (
              <Spinner size="xl" />
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <>
                <FormControl>
                  <FormLabel>
                  <Text as="span" color="red">* </Text> 
                    Nombre</FormLabel>
                  <Input
                    placeholder="Nombre de la empresa"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>
                  <Text as="span" color="red">* </Text> 
                    Fecha de constitución</FormLabel>
                  <Input
                    type="date"
                    value={constitutionDate}
                    onChange={(e) => setConstitutionDate(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>
                  <Text as="span" color="red">* </Text> 
                    Tipo de empresa</FormLabel>
                  <Select
                    placeholder="Selecciona el tipo de empresa"
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                  >
                    <option value="Usuario final">Usuario final</option>
                    <option value="Distribuidor">Distribuidor</option>
                    <option value="Mayorista">Mayorista</option>
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Comentarios</FormLabel>
                  <Textarea
                    placeholder="Agrega tus comentarios"
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
              </>
            )}
            <Text as="span" color="red">(*) Campos obligatorios</Text>
          </ModalBody>
          
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={editLoading || loading}
            >
              Actualizar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
