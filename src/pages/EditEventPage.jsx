import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, FormControl, FormLabel, Select, Spinner, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [creator, setCreator] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCategories, setAllCategories] = useState([]);

  // Gebruik environment variable voor backend URL
  const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    Promise.all([
      fetch(`${BACKEND_URL}/events/${eventId}`),
      fetch(`${BACKEND_URL}/categories`)
    ])
      .then(([eventRes, catRes]) => {
        if (!eventRes.ok || !catRes.ok) throw new Error('Failed to fetch data');
        return Promise.all([eventRes.json(), catRes.json()]);
      })
      .then(([eventData, categoriesData]) => {
        setTitle(eventData.title || '');
        setDescription(eventData.description || '');
        setStartTime(eventData.startTime || '');
        setEndTime(eventData.endTime || '');
        setImage(eventData.image || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
        setCategoryIds(eventData.categoryIds || []);
        setCreator(eventData.creator ? eventData.creator.name : '');
        setAllCategories(categoriesData);
      })
      .catch(() => setErrorMessage('Er is iets mis gegaan bij het ophalen van het evenement.'))
      .finally(() => setLoading(false));
  }, [eventId, BACKEND_URL]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(endTime) <= new Date(startTime)) {
      setErrorMessage('De eindtijd moet na de starttijd liggen.');
      return;
    }

    if (!title || !startTime || !endTime || !creator || categoryIds.length === 0) {
      setErrorMessage('Titel, starttijd, eindtijd, creator en categorieën zijn verplicht.');
      return;
    }

    const eventData = { 
      title, 
      description, 
      startTime, 
      endTime, 
      image, 
      categoryIds: categoryIds.map(Number), 
      creator 
    };

    fetch(`${BACKEND_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update event');
        return res.json();
      })
      .then(() => {
        toast({
          title: 'Evenement bijgewerkt',
          description: 'Het evenement is succesvol bijgewerkt.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      })
      .catch(() => setErrorMessage('Er is iets mis gegaan bij het bijwerken van het evenement.'));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setImage('');
    setCategoryIds([]);
    setCreator('');
    setErrorMessage('');
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={5}>
      <h1>{eventId ? 'Evenement Bewerken' : 'Nieuw Evenement Toevoegen'}</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Titel</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel van het evenement" />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Beschrijving</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beschrijving van het evenement" />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Starttijd</FormLabel>
          <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Eindtijd</FormLabel>
          <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Afbeelding URL</FormLabel>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL van de afbeelding" />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Kies een categorie</FormLabel>
          <Select value={categoryIds[0] || ''} onChange={(e) => setCategoryIds([e.target.value])}>
            <option value="">Selecteer een categorie...</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Creator</FormLabel>
          <Input value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="Naam van de maker" />
        </FormControl>

        <Button type="submit" colorScheme="teal" mt={4}>
          {eventId ? 'Sla Evenement op' : 'Voeg Evenement Toe'}
        </Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default EditEventPage;
