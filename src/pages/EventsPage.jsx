import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Select, Spinner, Text, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CustomButton = ({ to, colorScheme, children }) => (
  <Button as={Link} to={to} colorScheme={colorScheme} mt="4">
    {children}
  </Button>
);

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gebruik environment variable
  const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setLoading(true);

    // Ophalen van categorieën
    fetch(`${BACKEND_URL}/categories`)
      .then((res) => (res.ok ? res.json() : Promise.reject('Fout bij ophalen categorieën')))
      .then((data) => setCategories(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    // Ophalen van evenementen
    fetch(`${BACKEND_URL}/events`)
      .then((res) => (res.ok ? res.json() : Promise.reject('Fout bij ophalen evenementen')))
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [BACKEND_URL]);

  useEffect(() => {
    if (loading) return;

    let filtered = events;

    if (search) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categoryIds.includes(parseInt(selectedCategory))
      );
    }

    setFilteredEvents(filtered);
  }, [events, search, selectedCategory, loading]);

  const getCategoryNames = (categoryIds) =>
    categoryIds
      ? categoryIds
          .map((id) => {
            const category = categories.find((cat) => cat.id === id);
            return category ? category.name : null;
          })
          .filter(Boolean)
      : ['Onbekend'];

  if (loading) return <Spinner size="xl" />;

  if (error) return <Text color="red.500" mt="4">{error}</Text>;

  return (
    <Box p="4">
      <Input
        placeholder="Zoek evenementen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="4"
      />

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
                src={event.image || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'}
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
