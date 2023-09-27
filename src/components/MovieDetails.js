import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";

export function MovieDetails({ selectedId, onCloseMovie, watched, onAddWatched, onRemoveWatched, onUpdatedRating }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [userRating, setUserRating] = useState(watched.find(movie => movie.imdbID === selectedId)?.userRating);
	const [avgRating, setAvgRating] = useState(0);

	const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);

	const { Title, Year, Poster, Runtime, imdbRating, Plot, Released, Actors, Director, Genre } = movie;

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			imdbRating: +imdbRating,
			Title,
			Year,
			Poster,
			Runtime: +Runtime.split(" ").at(0),
			userRating,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovie();

		// localStorage.setItem("watched", JSON.stringify([...watched, movie]));
	}

	function handleRemove() {
		onRemoveWatched(selectedId);
		onCloseMovie();
	}

	function handleCloseBtn() {
		onUpdatedRating(selectedId, userRating);
		onCloseMovie();
	}

	//NOTE This doesn't update it. It does work when I put it in the main App file.
	// useEffect(
	// 	function () {
	// 		localStorage.setItem("watched", JSON.stringify(watched));
	// 	},
	// 	[watched]
	// );

	useEffect(
		function () {
			function callback(e) {
				if (e.code === "Escape") {
					onCloseMovie();
				}
			}

			document.addEventListener("keydown", callback);

			return function () {
				document.removeEventListener("keydown", callback);
			};
		},
		[onCloseMovie]
	);

	useEffect(
		function () {
			const controller = new AbortController();

			async function getMovieDetails() {
				try {
					setIsLoading(true);
					setError("");

					const res = await fetch(
						`https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}
					`,
						{ signal: controller.signal }
					);
					if (!res.ok) throw new Error("Cannot fetch movie details.");

					const data = await res.json();
					if (!data) throw new Error("Movie not found!");
					setMovie(data);
				} catch (err) {
					if (err.name !== "AbortError") {
						setError(err.message);
						console.error(err);
					}
				} finally {
					setIsLoading(false);
				}
			}
			getMovieDetails();

			return function () {
				controller.abort();
			};
		},
		[selectedId]
	);

	useEffect(
		function () {
			if (!Title) return;
			document.title = `MOVIE | ${Title}`;

			return function () {
				document.title = "usePopcorn";
			};
		},
		[Title]
	);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={handleCloseBtn}>
							&larr;
						</button>
						<img src={Poster} alt={`Poster of ${movie} movie`} />
						<div className="details-overview">
							<h2>{Title}</h2>
							<p>
								{Released} &bull; {Runtime}
							</p>
							<p>{Genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDB rating
							</p>
						</div>
					</header>
					<p>{avgRating}</p>
					<section>
						<div className="rating">
							<StarRating maxRating={10} size={24} onSetRating={setUserRating} defaultRating={userRating} />
							{!isWatched ? (
								<>
									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											➕ Add to watched list
										</button>
									)}
								</>
							) : (
								<button className="btn-rmv" onClick={handleRemove}>
									➖ Remove from watched list
								</button>
							)}
						</div>
						<p>
							<em>{Plot}</em>
						</p>
						<p>Starring {Actors}.</p>
						<p>Directed by {Director}.</p>
					</section>
				</>
			)}
		</div>
	);
}
