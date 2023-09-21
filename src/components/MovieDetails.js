import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";

export function MovieDetails({ selectedId, onCloseMovie }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

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
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDB rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							<StarRating maxRating={10} size={24} />
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}.</p>
						<p>Directed by {director}.</p>
					</section>
				</>
			)}
		</div>
	);
}
