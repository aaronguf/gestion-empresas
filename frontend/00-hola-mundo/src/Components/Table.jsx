import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Spinner
} from '@chakra-ui/react'
import { CompanyModal } from './Modal'
import { DeleteButton } from './DeleteButton'
import { useFetch } from '../Hooks/useFetch.js'
import { NewCompanyModal } from './NewCompanyModal.jsx'
import { useState, useEffect } from 'react'

export function MainTable() {
  const { data, error, loading } = useFetch('/empresas')
  const [companies, setCompanies] = useState([]) // (1)  

  useEffect(() => {  // Apoyo con IA para recargar los datos = (1)
    if (data) {
      setCompanies(data)
    }
  }, [data])

  if (loading)
    return (
      <h3>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </h3>
    )
  if (error) return <h3>Error: {error}</h3>

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  const handleAddCompany = (newCompany) => { // (1)
    setCompanies([...companies, newCompany])
  }
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{`Total de empresas registradas: ${data.length}`}</TableCaption>
        <Thead>
          <NewCompanyModal onAddCompany={handleAddCompany} /> {/*(1) */}
          <Tr>
            <Th>Nombre</Th>
            <Th>Tipo</Th>
            <Th>Fecha de constitución</Th>
            <Th>Favorito</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((empresa) => (
            <Tr key={empresa.company_id}>
              <Td>{empresa.company_name}</Td>
              <Td>{empresa.company_type}</Td>
              <Td>{formatDate(empresa.constitution_date)}</Td>
              <Td>{empresa.company_fav}</Td>
              <Td>
                <CompanyModal />
                <DeleteButton id={empresa['BIN_TO_UUID(company_id)']} />
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot></Tfoot>
      </Table>
    </TableContainer>
  )
}
