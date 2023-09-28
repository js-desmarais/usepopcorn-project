import { useEffect, useState } from "react";
import { KEY } from "../App";

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(
		function () {
			// callback?.();

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

			// handleCloseMovie();
			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return { movies, isLoading, error };
}
