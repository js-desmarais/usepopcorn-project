export function WatchedMovieList({ watched, onRemoveWatched }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<WatchedMovie movie={movie} key={Math.random()} onRemoveWatched={onRemoveWatched} />
			))}
		</ul>
	);
}
function WatchedMovie({ movie, onRemoveWatched }) {
	return (
		<li>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.Runtime} min</span>
				</p>
				<button className="btn-delete" onClick={() => onRemoveWatched(movie.imdbID)}>
					X
				</button>
			</div>
		</li>
	);
}
