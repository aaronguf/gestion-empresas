import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeartCrack } from '@fortawesome/free-solid-svg-icons'
import { AlertBadge } from './AlertBadge.jsx'
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
  Spinner,
  Box
} from '@chakra-ui/react'
import { DeleteButton } from './DeleteButton'
import { EditCompanyModal } from './EditCompanyModal.jsx'
import { useFetch } from '../Hooks/useFetch.js'
import { NewCompanyModal } from './NewCompanyModal.jsx'
import { useState, useEffect } from 'react'

export function MainTable() {
  const { data, error, loading } = useFetch('/empresas')
  const [companies, setCompanies] = useState([]) // (1)

  useEffect(() => {
    // Apoyo con IA para recargar los datos = (1)
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

  const handleAddCompany = (newCompany) => {
    // (1)
    setCompanies([...companies, newCompany])
  }
  return (
    <TableContainer>
      <Box display="flex" justifyContent="end" mb={4}>
        <NewCompanyModal onAddCompany={handleAddCompany} /> {/*(1) */}
      </Box>
      {data.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <AlertBadge/>
          </Box>
      ) : (
        <Table variant="simple">
          <TableCaption>{`Total de empresas registradas: ${data.length}`}</TableCaption>
          <Thead>
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
                <Td>
                  <FontAwesomeIcon
                    icon={empresa.company_fav ? faHeartSolid : faHeartCrack}
                    style={{ color: empresa.company_fav ? 'red' : 'gray' }}
                  />{' '}
                </Td>
                <Td width={"70%"} display="flex" justifyContent="space-between">
                  <EditCompanyModal id={empresa.company_id} />
                  <DeleteButton id={empresa.company_id} />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      )}
    </TableContainer>
  )
}
