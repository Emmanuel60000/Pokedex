// components/PokemonList/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from '../pokemonCard';
import { useAppContext } from '../../context';
import SearchBar from '../SearchBar';

const PokemonList: React.FC = () => {
  const { pokemonList, setPokemonList, filterType } = useAppContext();
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPokemon, setFilteredPokemon] = useState<any[]>(pokemonDetails); // Initialiser avec tous les Pokémon

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=100');
        const data = response.data.results;

        setPokemonList(data);

        const detailsPromises = data.map(async (pokemon: any) => {
          const detailsResponse = await axios.get(pokemon.url);
          return detailsResponse.data;
        });

        const detailsResults = await Promise.all(detailsPromises);
        setPokemonDetails(detailsResults);
        setFilteredPokemon(detailsResults);
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };

    fetchPokemonData();
  }, [setPokemonList]);

  const indexOfLastCard = currentPage * 20;
  const indexOfFirstCard = indexOfLastCard - 20;
  const currentCards = filteredPokemon.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = (searchTerm: string) => {
    const filtered = pokemonDetails.filter((pokemon: any) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (filterType: string | null) => {
    const filtered = filterType
      ? pokemonDetails.filter((pokemon: any) =>
          pokemon.types.some((type: any) => type.type.name === filterType)
        )
      : pokemonDetails;
    setFilteredPokemon(filtered);
    setCurrentPage(1);
  };

  // Appeler handleFilter lorsque filterType change
  useEffect(() => {
    handleFilter(filterType);
  }, [filterType]);

  return (
    <div className="pokemon-list">
      <SearchBar onSearch={handleSearch} />
      {currentCards.map((pokemon: any) => (
        <PokemonCard key={pokemon.name} name={pokemon.name} types={pokemon.types.map((type: any) => type.type.name)} />
      ))}
  
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredPokemon.length / 20) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
