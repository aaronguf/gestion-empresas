import { Badge, Text } from '@chakra-ui/react'

export function AlertBadge() {
  return (  
    <Text fontSize='xl' fontWeight='bold'>
    <Badge ml='1' fontSize='0.8em' colorScheme='green'>
      Sin empresas creadas...
    </Badge>
  </Text>
  )
}