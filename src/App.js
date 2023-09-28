import { NavBar } from "./components/NavBar";
import { Main } from "./components/Main";
import { useState } from "react";
import { Logo } from "./components/Logo";
import { NumResults } from "./components/NumResults";
import { Search } from "./components/Search";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMovieList } from "./components/WatchedMovieList";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { MovieDetails } from "./components/MovieDetails";

import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export const KEY = "b4b0c6a";

export default function App() {
	const [query, setQuery] = useState("top");
	const [selectedId, setSelectedId] = useState(null);

	const { movies, isLoading, error } = useMovies(query);
	const [watched, setWatched] = useLocalStorageState([], "watched");

	function handleSelectMovie(id) {
		setSelectedId(selectedId => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched(watched => [...watched, movie]);
	}

	function handleRemoveWatched(movieID) {
		setWatched(watched => watched.filter(movie => movie.imdbID !== movieID));
	}

	function handleUpdatedRating(movieID, rating) {
		setWatched(movies =>
			movies.map(movie => {
				if (movie.imdbID === movieID) {
					movie.userRating = rating;
				}
				return movie;
			})
		);
		console.log("rating was updated!");
	}

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							watched={watched}
							onAddWatched={handleAddWatched}
							onRemoveWatched={handleRemoveWatched}
							onUpdatedRating={handleUpdatedRating}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList
								watched={watched}
								onRemoveWatched={handleRemoveWatched}
								onSelectMovie={handleSelectMovie}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
