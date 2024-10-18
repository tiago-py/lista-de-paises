"use client";

import { useState, useEffect } from "react";
import CountryCard from "@/components/country-card";
import Image from "next/image";
import Link from "next/link";

export type Country = {
  name: {
    common: string;
  };

  translations: {
    por: {
      common: string;
    };
  };

  flags: {
    svg: string;
    alt: string;
  };

  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages?: {
    [key: string]: string;
  };

  borders?: string[];
  cca3: string;
};

async function getCountries(): Promise<Country[]> {
  const response = await fetch("https://restcountries.com/v3.1/all");
  return response.json();
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Armazena o termo de pesquisa
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [countriesPerPage] = useState(10); // Número de países por página

  useEffect(() => {
    // Carrega os países ao montar o componente
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  // Filtrar os países com base no termo de pesquisa
  const filteredCountries = countries.filter((country) => {
    return (
      country.name.common.includes(searchTerm) ||
      (country.capital && country.capital.includes(searchTerm)) ||
      (country.region && country.region.includes(searchTerm)) ||
      (country.subregion && country.subregion.includes(searchTerm))
    );
  });
  // Lógica para paginar os países
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="container mt-16">
      {/* Barra de Pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar país..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Grid de países */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {currentCountries.map((country) => (
          <CountryCard
            key={country.name.common}
            name={country.name.common}
            ptName={country.translations.por.common}
            flag={country.flags.svg}
            flagAlt={country.flags.alt}
          />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`p-2 ${currentPage === 1 ? "opacity-50" : ""}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <p>
          Página {currentPage} de {totalPages}
        </p>

        <button
          className={`p-2 ${currentPage === totalPages ? "opacity-50" : ""}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
