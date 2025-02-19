import React from 'react';
import { Outlet } from 'react-router-dom'; 
import { Box, Container } from '@chakra-ui/react';
import Navigation from './Navigation'; 

const Root = () => {
  return (
    <Box>
      {/* Navigatie bovenaan */}
      <Navigation />
      
      {/* Dit is de plek waar de specifieke pagina's worden geladen */}
      <Container maxW="container.xl" mt={8}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Root;
