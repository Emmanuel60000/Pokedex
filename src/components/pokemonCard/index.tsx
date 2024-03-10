import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Définition des propriétés que le composant PokemonCard peut recevoir
interface PokemonCardProps {
  name: string;
  types: string[]; // Liste des types du Pokémon
}

// Définition des détails d'un Pokémon
interface PokemonDetails {
  id: number;
  name: string;
  types: { type: { name: string } }[]; // Structure des types de Pokémon provenant de l'API
  sprites: { front_default: string };
}

// Définition du composant PokemonCard en tant que fonction composante React
const PokemonCard: React.FC<PokemonCardProps> = ({ name, types }) => {
  // Utilisation de l'état pour stocker les détails du Pokémon
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);

  // Effet qui s'exécute au montage du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer les détails du Pokémon depuis l'API
    const fetchPokemonDetails = async () => {
      try {
        // Envoyer une requête GET à l'API Pokemon pour obtenir les détails du Pokémon
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = response.data;

        // Mettre à jour l'état avec les détails du Pokémon
        setPokemonDetails({
          id: data.id,
          name: data.name,
          types: data.types,
          sprites: data.sprites,
        });
      } catch (error) {
        // Gérer les erreurs liées à la récupération des détails du Pokémon
        console.error(`Error fetching details for ${name}:`, error);
      }
    };

    // Appeler la fonction pour charger les détails au montage du composant
    fetchPokemonDetails();
  }, [name]);

  // Rendu du composant PokemonCard
  return (
    <Link href={`/pokemon/${name}`}>
    <div className="pokemon-card">
      {pokemonDetails && (
        <>
          {/* Afficher le nom du Pokémon */}
          <p className="pokemon-name">{pokemonDetails.name}</p>
          {/* Afficher l'image du Pokémon */}
          <img className="pokemon-image" src={pokemonDetails.sprites.front_default} alt={`${name} sprite`} />
          {/* Afficher les types du Pokémon */}
          <p className="pokemon-types text-red-500"> {types.join(', ')}</p>
        </>
      )}
    </div>
    </Link>
  );
};

export default PokemonCard;
