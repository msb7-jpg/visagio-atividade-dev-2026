import React from 'react'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import { MovieGridItemView } from './MovieGridItemView'

interface MovieGridListProps {
  movies: MovieListItem[]
}

export const MovieGridList: React.FC<MovieGridListProps> = ({ movies }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {movies.map((movie) => (
      <MovieGridItemView key={movie.sk_movie_id} movie={movie} />
    ))}
  </div>
)
