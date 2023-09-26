import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";

export function MovieDetails({ selectedId, onCloseMovie, watched, onAddWatched, onRemoveWatched, onUpdatedRating }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [userRating, setUserRating] = useState(watched.find(movie => movie.imdbID === selectedId)?.userRating);

	const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);

	const { Title, Year, Poster, Runtime, imdbRating, Plot, Released, Actors, Director, Genre } = movie;

	console.log(userRating);

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
	}

	function handleRemove() {
		onRemoveWatched(selectedId);
		onCloseMovie();
	}

	// FIXME
	/* 	function handleRating() {
		// setMovie({ ...movie, userRating });
// NOTE: here add 
		onCloseMovie();
	} */

	function handleCloseBtn() {
		onUpdatedRating(selectedId, userRating);
		onCloseMovie();
	}

	useEffect(
		function () {
			async function getMovieDetails() {
				try {
					setIsLoading(true);
					setError("");

					const res = await fetch(`https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}
					`);
					if (!res.ok) throw new Error("Cannot fetch movie details.");

					const data = await res.json();
					if (!data) throw new Error("Movie not found!");
					setMovie(data);
				} catch (err) {
					console.error(err);
					setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}
			getMovieDetails();
		},
		[selectedId]
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
