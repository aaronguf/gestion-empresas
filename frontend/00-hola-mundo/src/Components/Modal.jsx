import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure, Button, FormControl, FormLabel, Input, Textarea, Checkbox, Select
} from '@chakra-ui/react'
import React from 'react'

export function CompanyModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  return (
    <>
      <Button onClick={onOpen}>Editar</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Actualizar datos de la empresa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input ref={initialRef} placeholder='Nombre de la empresa' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Fecha de constitución (mes/dia/año)</FormLabel>
              <Input placeholder='Select Date and Time' size='md' type='date' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de empresa</FormLabel>
              <Select placeholder='Selecciona el tipo de empresa'>
                <option value='usuario_final'>Usuario final</option>
                <option value='distribuidor'>Distribuidor</option>
                <option value='mayorista'>Mayorista</option>
              </Select>            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Comentarios</FormLabel>
              <Textarea placeholder='Agrega tus comentarios' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Favorito</FormLabel>
              <Checkbox></Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}