// Importation des modules nécessaires depuis React et axios, ainsi que du contexte d'application personnalisé
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context';

// Définition du composant de filtre par type en tant que fonction composante React
const TypeFilter: React.FC = () => {
  // Utilisation du contexte d'application pour accéder à l'état et aux fonctions liées aux Pokémon
  const { filterType, setFilterType, pokemonList, setPokemonList } = useAppContext();

  // Utilisation de l'état local pour stocker les types uniques des Pokémon
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  // Effet qui s'exécute au montage du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer les données des Pokémon depuis l'API
    const fetchPokemonData = async () => {
      try {
        // Envoyer une requête GET à l'API Pokemon pour obtenir une liste de Pokémon
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=100');
        const data = response.data.results;
        
        // Mettre à jour la liste des Pokémon dans le contexte d'application
        setPokemonList(data);

        // Extraire dynamiquement les types uniques de la liste des Pokémon
        const types: string[] = [];
        for (const pokemon of data) {
          const pokemonDetails = await axios.get(pokemon.url);
          types.push(...pokemonDetails.data.types.map((type: any) => type.type.name));
        }

        // Mettre à jour l'état local avec les types uniques
        setUniqueTypes([...new Set(types)]);
      } catch (error) {
        // Gérer les erreurs liées à la récupération des données des Pokémon
        console.error('Error fetching Pokemon data:', error);
      }
    };

    // Appeler la fonction pour charger les données au montage du composant
    fetchPokemonData();
  }, [setPokemonList]);

  // Gérer le changement de valeur dans le sélecteur de filtre par type
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  // Rendu du composant TypeFilter
  return (
    <div className="filter-container">
      <label className="label-filter" htmlFor="typeFilter">Filter by type:</label>
      <select className="filter-select" id="typeFilter" value={filterType || ''} onChange={handleTypeChange}>
        <option value="">All types</option>
        {/* Ajout des options pour chaque type de Pokémon */}
        {uniqueTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;
