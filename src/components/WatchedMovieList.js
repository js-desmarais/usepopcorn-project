export function WatchedMovieList({ watched, onRemoveWatched, onSelectMovie }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<WatchedMovie
					movie={movie}
					key={Math.random()}
					onRemoveWatched={onRemoveWatched}
					onSelectMovie={onSelectMovie}
				/>
			))}
		</ul>
	);
}
function WatchedMovie({ movie, onRemoveWatched, onSelectMovie }) {
	return (
		<li>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3 onClick={() => onSelectMovie(movie.imdbID)}>{movie.Title}</h3>
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
