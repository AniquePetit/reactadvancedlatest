import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, FormControl, FormLabel, Select, Spinner, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddEventPage = () => {
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

  // Categorieën ophalen bij mount
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then((categories) => setAllCategories(categories))
      .catch(() => setErrorMessage('Er is iets mis gegaan bij het ophalen van de categorieën.'))
      .finally(() => setLoading(false));
  }, [BACKEND_URL]);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validatie
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
      creator,
    };

    fetch(`${BACKEND_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add event');
        return res.json();
      })
      .then(() => {
        toast({
          title: 'Nieuw evenement toegevoegd',
          description: 'Het evenement is succesvol toegevoegd.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      })
      .catch(() => setErrorMessage('Er is iets mis gegaan bij het toevoegen van het evenement.'));
  };

  // Form reset
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
      <h1>Nieuw Evenement Toevoegen</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Titel</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel van het evenement"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Beschrijving</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschrijving van het evenement"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Starttijd</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Eindtijd</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Afbeelding URL</FormLabel>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL van de afbeelding"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Kies een categorie</FormLabel>
          <Select
            value={categoryIds[0] || ''}
            onChange={(e) => setCategoryIds([e.target.value])}
          >
            <option value="">Selecteer een categorie...</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Creator</FormLabel>
          <Input
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Naam van de maker"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" mt={4}>Voeg Evenement Toe</Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>Reset</Button>
      </form>
    </Box>
  );
};

export default AddEventPage;
