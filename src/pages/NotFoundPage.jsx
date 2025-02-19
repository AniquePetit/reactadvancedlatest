import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box textAlign="center" mt={10} p={5}>
      <Heading as="h1" size="2xl" mb={4}>
        404 - Pagina niet gevonden
      </Heading>
      <Text fontSize="lg" mb={6}>
        De pagina die je zoekt bestaat niet. Het lijkt erop dat we niet kunnen vinden waar je naar op zoek bent.
      </Text>
      <Link to="/">
        <Button colorScheme="blue" size="lg">
          Terug naar Home
        </Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
