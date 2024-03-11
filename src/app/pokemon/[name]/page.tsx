'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface PokemonDetails {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
  };
  species: { url: string };
  height: number;
  weight: number;
  cry: string;
}

const PokemonDetailsPage: React.FC = () => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [pokemonDescription, setPokemonDescription] = useState<string>("");
  const [prevPokemon, setPrevPokemon] = useState<PokemonDetails | null>(null);
  const [nextPokemon, setNextPokemon] = useState<PokemonDetails | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const pathSegments = window.location.pathname.split("/");
        const pokemonName = pathSegments[pathSegments.length - 1];

        if (pokemonName && typeof pokemonName === "string") {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
          const speciesResponse = await axios.get(response.data.species.url);

          const data = response.data;
          const speciesData = speciesResponse.data;

          setPokemonDetails({
            id: data.id,
            name: data.name,
            types: data.types,
            sprites: data.sprites,
            species: speciesData,
            height: data.height,
            weight: data.weight,
            cry: speciesData.cry,
          });

          const description = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === "en");
          setPokemonDescription(description?.flavor_text || "");

          if (data.id > 1) {
            const prevResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${data.id - 1}`);
            setPrevPokemon(prevResponse.data);
          }

          const nextResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${data.id + 1}`);
          setNextPokemon(nextResponse.data);
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails pour ${pokemonDetails}:`, error);
      }
    };

    fetchPokemonDetails();
  }, [pokemonDetails]);

  if (!pokemonDetails) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  const heightInMeters = (pokemonDetails.height / 10).toFixed(2);
  const weightInKilograms = (pokemonDetails.weight / 10).toFixed(1);

  const playCry = () => {
    const audio = new Audio(pokemonDetails.cry);
    audio.play();
  };

  const handleClick = () => {
    // Inversez l'état de la carte lorsqu'elle est cliquée
    setIsCardFlipped((prev) => !prev);
  };

  return (
    <body className="">
      <section>
        <div className="flex justify-between mb-8 pt-4 px-4">
          {prevPokemon && (
            <div className="text-center ">
              <p className="text-sm mb-2">Précédent:</p>
              <a href={`/pokemon/${prevPokemon.name}`} className="block">
                <img src={prevPokemon.sprites.front_default} alt={prevPokemon.name} className="mx-auto mb-2" />
                <p className="text-xs">{prevPokemon.name}</p>
              </a>
            </div>
          )}
          <Link href="/">
            <h1 className="Pokédex">Pokédex</h1>
          </Link>
          {nextPokemon && (
            <div className="text-center ">
              <p className="text-sm mb-2">Suivant:</p>
              <a href={`/pokemon/${nextPokemon.name}`} className="block">
                <img src={nextPokemon.sprites.front_default} alt={nextPokemon.name} className="mx-auto mb-2" />
                <p className="text-xs">{nextPokemon.name}</p>
              </a>
            </div>
          )}
        </div>

        <div className="pokemon-details">
          <div className={`card ${isCardFlipped ? "flipped" : ""}`} onClick={handleClick}>
            <div className="card-face front-face">
              <div className="flex text-3xl font-bold mb-4 capitalize mt-4 gap-8">
                <h1 className="">N° {pokemonDetails.id}</h1>
                <h1 className="">{pokemonDetails.name} </h1>
              </div>
              <img
                src={pokemonDetails.sprites.front_default}
                alt={`${pokemonDetails.name} sprite`}
                className="sprite-img mx-auto mb-2"
              />
            </div>
            <div className="card-face back-face">
              <div className="flex text-3xl font-bold mb-4 capitalize mt-4 gap-8 ">
                <h1 className="">N° {pokemonDetails.id}</h1>
                <h1 className="">{pokemonDetails.name}(shiny) </h1>
              </div>

              <img
                src={pokemonDetails.sprites.front_shiny}
                alt={`${pokemonDetails.name} shiny sprite`}
                className="sprite-img mx-auto mb-2"
              />
              <div className="flex gap-4 mb-4">
                <p className="text-sm mb-2 ">Taille: {heightInMeters} m</p>
                <p className="text-sm mb-2 ">Poids: {weightInKilograms} kg</p>
              </div>

              <p className="text-sm mb-2 text-center px-8 "> {pokemonDescription}</p>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h3 className="text-center mt-8 text-red-300">Cliquez sur l image</h3>
      </div>
    </body>
  );
};

export default PokemonDetailsPage;
