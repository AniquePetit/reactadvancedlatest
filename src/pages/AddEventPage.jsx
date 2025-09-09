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

  useEffect(() => {
    setLoading(true);

    fetch('https://reactadvancedlatest.onrender.com/categories')  // Glitch API URL
      .then((response) => response.json())
      .then((categoriesData) => {
        setAllCategories(categoriesData); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setErrorMessage("Er is iets mis gegaan bij het ophalen van de categorieën.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Controleer of de eindtijd na de starttijd komt
    if (end <= start) {
      setErrorMessage('De eindtijd moet na de starttijd liggen.');
      return;
    }

    // Controleer of verplichte velden zijn ingevuld, inclusief categorie
    if (!title || !startTime || !endTime || !creator || categoryIds.length === 0 || categoryIds[0] === '') {
      setErrorMessage('Titel, starttijd, eindtijd, creator en categorieën zijn verplicht.');
      return;
    }

    // Zet de categoryIds om naar getallen
    const numericCategoryIds = categoryIds.map((categoryId) => Number(categoryId));

    const eventData = {
      title,
      description,
      startTime,
      endTime,
      image,
      categoryIds: numericCategoryIds, // Gebruik de genummerde categoryIds
      creator,
    };

    // Verzenden van evenement naar de server
    fetch('https://strengthened-resilient-nyala.glitch.me/events', {  // Glitch API URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
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
      .catch((error) => {
        console.error('Fout bij het toevoegen van het evenement:', error);
        setErrorMessage('Er is iets mis gegaan bij het toevoegen van het evenement.');
      });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setImage('');
    setCategoryIds([]); // Reset categoryIds
    setCreator('');
    setErrorMessage('');
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={5}>
      <h1>Nieuw Evenement Toevoegen</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Titel</FormLabel>
          <Input
            type="text"
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
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL van de afbeelding"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Kies een categorie</FormLabel>
          <Select
            value={categoryIds[0] || ''} // Only allow one category to be selected
            onChange={(e) => setCategoryIds([e.target.value])} // Ensure it's an array with one value
          >
            <option value="">Selecteer een categorie...</option> {/* Lege optie toevoegen */}
            {allCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Creator</FormLabel>
          <Input
            type="text"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Naam van de maker"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" mt={4}>
          Voeg Evenement Toe
        </Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default AddEventPage;

