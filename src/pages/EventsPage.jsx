import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Select, Spinner, Text, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CustomButton = ({ to, colorScheme, children }) => {
  return (
    <Button as={Link} to={to} colorScheme={colorScheme} mt="4">
      {children}
    </Button>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Ophalen van de categorieën
    fetch('https://strengthened-resilient-nyala.glitch.me/categories')  // Glitch API URL voor categorieën ophalen
      .then((response) => response.ok ? response.json() : Promise.reject('Fout bij ophalen categorieën'))
      .then((data) => setCategories(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    // Ophalen van de evenementen
    fetch('https://strengthened-resilient-nyala.glitch.me/events')  // Glitch API URL voor evenementen ophalen
      .then((response) => response.ok ? response.json() : Promise.reject('Fout bij ophalen evenementen'))
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data); // Initiële lijst van evenementen
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;

    let filtered = events;

    // Filteren op zoekterm
    if (search) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filteren op geselecteerde categorie, maar alleen als er een categorie is geselecteerd
    if (selectedCategory && selectedCategory !== '') {
      filtered = filtered.filter((event) =>
        event.categoryIds.includes(parseInt(selectedCategory)) // Vergelijk ID's van categorieën
      );
    }

    setFilteredEvents(filtered);
  }, [events, search, selectedCategory, loading]);

  const getCategoryNames = (categoryIds) => {
    return categoryIds
      ? categoryIds
          .map((categoryId) => {
            const category = categories.find((cat) => cat.id === categoryId);
            return category ? category.name : null;
          })
          .filter(Boolean)
      : ['Onbekend'];
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Text color="red.500" mt="4">
        {error}
      </Text>
    );
  }

  return (
    <Box p="4">
      {/* Zoekveld */}
      <Input
        placeholder="Zoek evenementen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="4"
      />

      {/* Categorieën dropdown */}
      <Select
        placeholder="Selecteer een categorie"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb="4"
      >
        <option value="">Alle categorieën</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="4">
        {filteredEvents.length === 0 ? (
          <Text>Geen evenementen gevonden.</Text>
        ) : (
          filteredEvents.map((event) => (
            <Box key={event.id} p="4" borderWidth="1px" borderRadius="lg">
              <Image
                src={event.image ? event.image : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'}
                alt={event.title}
                boxSize="200px"
                objectFit="cover"
                mb="4"
              />
              <Text fontWeight="bold" mb="2">{event.title}</Text>
              <Text>{event.description}</Text>
              <Text mt="2">
                <strong>Categorieën:</strong> {getCategoryNames(event.categoryIds).join(', ')}
              </Text>
              <CustomButton to={`/event/${event.id}`} colorScheme="teal">
                Meer details
              </CustomButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default EventsPage;
