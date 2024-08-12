import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, Textarea, Checkbox, Select, useToast, Spinner} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useEdit } from '../Hooks/useEdit';
import { useFetchById } from '../Hooks/useFetchById';

export function EditCompanyModal({ id }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Estados para los datos de la compañía
  const [companyName, setCompanyName] = useState('');
  const [constitutionDate, setConstitutionDate] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [comments, setComments] = useState('');
  const [companyFav, setCompanyFav] = useState(false);

  // Lógica para cargar los datos de la compañía
  const { data: company, loading, error } = useFetchById(`/empresas/${id}`);

  const loadCompanyData = () => {
  if (company) {
    setCompanyName(company.company_name);

    // Verificar si la fecha es válida antes de intentar formatearla
    if (company.constitution_date) {
      const formattedDate = new Date(company.constitution_date).toISOString().split('T')[0];
      setConstitutionDate(formattedDate);
    } else {
      setConstitutionDate(''); // O un valor por defecto si la fecha no es válida
    }

    setCompanyType(company.company_type);
    setComments(company.company_comments);
    setCompanyFav(company.company_fav);
    console.log(company.company_comments)
  }
};

  useEffect(() => {
    if (isOpen) {
      loadCompanyData();
      console.log(constitutionDate)

      
    }
  }, [isOpen, company]);

  const { editData, loading: editLoading } = useEdit(`/empresas/${id}`, 'PATCH');

  const handleSubmit = async (e) => {
    e.preventDefault();

      let formattedCompanyFAv = companyFav === 0 ? false : companyFav
      formattedCompanyFAv = companyFav === 1 ?  true: companyFav

    const updatedCompany = {
      company_name: companyName,
      constitution_date: constitutionDate,
      company_type: companyType,
      company_fav: formattedCompanyFAv,
      company_comments: comments,
    };
    console.log(updatedCompany)
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
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    placeholder="Nombre de la empresa"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Fecha de constitución</FormLabel>
                  <Input
                    type="date"
                    value={constitutionDate}
                    onChange={(e) => setConstitutionDate(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Tipo de empresa</FormLabel>
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
