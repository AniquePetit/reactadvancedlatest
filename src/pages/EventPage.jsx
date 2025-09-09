import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Text, Image, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BACKEND_URL = 'https://reactadvancedlatest.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [eventsResponse, categoriesResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/events/${eventId}`),  
          fetch(`${BACKEND_URL}/categories`),  
        ]);

        if (!eventsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Fout bij het ophalen van gegevens');
        }

        const [eventData, categoriesData] = await Promise.all([eventsResponse.json(), categoriesResponse.json()]);

        if (!eventData) {
          throw new Error('Geen evenement gevonden met dit ID.');
        }

        setEvent(eventData);
        setAllCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Onbekende datum' : date.toLocaleString();
  };

  const getCategoryNames = (categoryIds) => {
    if (!Array.isArray(categoryIds)) return ['Onbekend'];

    return categoryIds
      .map((categoryId) => {
        const category = allCategories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'Onbekende categorie';
      })
      .filter(Boolean);
  };

  const handleDelete = () => setIsModalOpen(true);

  const confirmDelete = async () => {
    try {
      await fetch(`${BACKEND_URL}/events/${event.id}`, {
        method: 'DELETE',
      });

      toast({
        title: 'Evenement verwijderd.',
        description: 'Het evenement is succesvol verwijderd.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch {
      toast({
        title: 'Fout bij verwijderen.',
        description: 'Er is een fout opgetreden bij het verwijderen van het evenement.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" />;

  if (error) return <Text color="red.500" mt="4">{error}</Text>;
  if (!event) return <Text color="orange.500">Evenement niet gevonden.</Text>;

  const eventCategories = getCategoryNames(event.categoryIds);

  return (
    <Box p={5}>
      <Heading>{event.title}</Heading>
      <Text mb={2}>{event.description}</Text>
      <Text mb={2}><strong>Start Time:</strong> {parseDate(event.startTime)}</Text>
      <Text mb={2}><strong>End Time:</strong> {parseDate(event.endTime)}</Text>
      <Image
        src={event.image || 'https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg'}
        alt={event.title || 'Evenement afbeelding'}
        boxSize="300px"
        objectFit="cover"
        mb={4}
      />
      <Text mb={2}><strong>Categories:</strong> {eventCategories.join(', ')}</Text>

      <Button colorScheme="blue" onClick={() => navigate(`/edit-event/${event.id}`)}>Bewerken</Button>
      <Button colorScheme="red" ml={2} onClick={handleDelete}>Verwijderen</Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Weet je zeker dat je dit evenement wilt verwijderen?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Dit kan niet ongedaan worden gemaakt.</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDelete}>Verwijderen</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Annuleren</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventPage;
