import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StarWars = () => {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchFilms = async () => {
      try {
        const { data } = await axios.get('https://swapi.dev/api/films/', {
          cancelToken: source.token,
        });
        setFilms(data.results);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(`Request cancelled: ${err.message}`);
        } else {
          console.error(err);
          setError(err);
        }
      }
    };

    fetchFilms();

    return () => {
      source.cancel('Cancelling axios in cleanup');
    };
  }, []);

  if (error) {
    return (
      <section>
        <p class="error"> Error: {error.message} - Simulated API Response: </p>
        <h2>Star Wars: The Return of the Jedi</h2>
        <p>
          The Galactic Empire is on the brink of defeat. Rebel forces are
          gathering their strength for a final assault on the Empire’s ultimate
          weapon, the second Death Star. Meanwhile, the fate of Han Solo rests
          in the hands of Princess Leia, Luke Skywalker, and the Ewoks on the
          forest moon of Endor.
        </p>
      </section>
    );
  }

  return (
    <section>
      <ul>
        {films.map(({ episode_id, title, opening_crawl }) => (
          <li key={episode_id}>
            <h2>{title}</h2>
            <p>{opening_crawl}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StarWars;
