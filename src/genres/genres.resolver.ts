import { Resolver } from '@nestjs/graphql';
import { GenresService } from './genres.service';

@Resolver()
export class GenresResolver {
  constructor(private readonly genresService: GenresService) {}
}
