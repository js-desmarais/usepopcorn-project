import { NavBar } from "./NavBar";
import { Main } from "./Main";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NumResults } from "./NumResults";
import { Search } from "./Search";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMovieList } from "./WatchedMovieList";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { MovieDetails } from "./MovieDetails";

export const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "b4b0c6a";

export default function App() {
	const [query, setQuery] = useState("top");
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	// const [watched, setWatched] = useState([]);
	const [watched, setWatched] = useState(() => JSON.parse(localStorage.getItem("watched")));

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

	useEffect(
		function () {
			localStorage.setItem("watched", JSON.stringify(watched));
		},
		[watched]
	);

	useEffect(
		function () {
			const controller = new AbortController();

			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");

					const res = await fetch(
						`https://www.omdbapi.com/?s=${query}&apikey=${KEY}
						`,
						{ signal: controller.signal }
					);
					// 			const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${KEY}
					// `).catch(() => {
					// 				throw new Error("There was an issue with the network connection.");
					// 			});

					if (!res.ok) throw new Error("Something went wrong with fetching movies.");

					const data = await res.json();
					if (data.Response === "False") throw new Error(data.Error);

					setMovies(data.Search);
					setError("");
				} catch (err) {
					if (err.name !== "AbortError") {
						setError(err.message);
						console.error(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 3) {
				setMovies([]);
				setError("");
				return;
			}

			handleCloseMovie();
			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

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
