import { Args, Query, Resolver } from '@nestjs/graphql';
import { CursorMoviesResponse } from 'src/shared/entites/cursor.movies';
import { MoviesService } from './movies.service';

@Resolver()
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) { }
  
  @Query(() => CursorMoviesResponse)
  movies(
    @Args('limit') limit: number,
    @Args('nextCursor', { nullable: true }) nextCursor?: string,
  ): Promise<CursorMoviesResponse> {
    return this.moviesService.findAll(limit, nextCursor);
  }
}
