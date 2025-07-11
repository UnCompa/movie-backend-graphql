//cursor pagination to movies

export class CursorMovies {
  genre: string;
}

export class CursorMoviesResponse {
  movies: CursorMovies[];
  nextCursor: string;
}