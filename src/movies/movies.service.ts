import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cursor } from 'src/shared/entites/cursor';
import { CursorMoviesResponse } from 'src/shared/entites/cursor.movies';
import { Repository } from 'typeorm';
import { Movie } from './entites/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) { }

  async findAll(limit: number, nextCursor?: string): Promise<CursorMoviesResponse> {
    let query = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .orderBy('movie.id', 'ASC');

    // Si hay cursor, decodificar y usar para paginación
    if (nextCursor) {
      try {
        const decodedCursor = Cursor.fromBase64(nextCursor);
        const cursorData = JSON.parse(decodedCursor) as { lastId?: number; genre?: string };

        // Asumiendo que el cursor contiene el ID de la última película vista
        if (cursorData.lastId) {
          query = query.where('movie.id > :lastId', { lastId: cursorData.lastId });
        }
      } catch (error) {
        // Si el cursor es inválido, ignorar y continuar
        console.warn('Invalid cursor provided:', nextCursor);
      }
    }

    // Aplicar límite
    query = query.limit(limit + 1); // +1 para saber si hay más páginas

    const movies = await query.getMany();

    // Verificar si hay más páginas
    const hasMore = movies.length > limit;
    const moviesToReturn = hasMore ? movies.slice(0, limit) : movies;

    // Generar el siguiente cursor si hay más páginas
    let nextCursorValue: string | null = null;
    if (hasMore && moviesToReturn.length > 0) {
      const lastMovie = moviesToReturn[moviesToReturn.length - 1];
      const cursorData = {
        lastId: lastMovie.id,
        genre: lastMovie.genres?.[0]?.name || null,
      };
      nextCursorValue = Cursor.toBase64(JSON.stringify(cursorData));
    }

    return {
      movies: moviesToReturn.map((movie) => ({
        genre: movie.genres?.[0]?.name || '',
      })),
      nextCursor: nextCursorValue || '',
    };
  }
}
