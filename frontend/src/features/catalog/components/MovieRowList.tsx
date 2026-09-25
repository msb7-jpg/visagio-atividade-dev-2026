import React from 'react'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import { MovieListItemView } from './MovieListItemView'

interface MovieRowListProps {
  movies: MovieListItem[]
}

export const MovieRowList: React.FC<MovieRowListProps> = ({ movies }) => (
  <div className="flex flex-col gap-3">
    {movies.map((movie) => (
      <MovieListItemView key={movie.sk_movie_id} movie={movie} />
    ))}
  </div>
)
