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

export const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

export const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

export const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "b4b0c6a";

export default function App() {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	/// Educational test
	/* 	useEffect(function () {
		console.log("After initial render");
	}, []);

	useEffect(function () {
		console.log("After every render");
	});

	console.log("During render");
	useEffect(
		function () {
			console.log("When query state is changed");
		},
		[query]
	); */

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
