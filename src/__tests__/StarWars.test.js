import React from 'react';
import { act, render, waitFor, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import StarWars from '../components/StarWars';

const server = setupServer(
  rest.get('https://swapi.dev/api/films/', (_req, res, ctx) => {
    return res(
      ctx.json({
        results: [
          {
            title: 'Star Wars: The Return of the Jedi',
            episode_id: 6,
            opening_crawl:
              'The Galactic Empire is on the brink of defeat. Rebel forces are gathering their strength for a final assault on the Empire’s ultimate weapon, the second Death Star. Meanwhile, the fate of Han Solo rests in the hands of Princess Leia, Luke Skywalker, and the Ewoks on the forest moon of Endor.',
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('<StarWars/>', () => {
  it('displays film info returned from API call', async () => {
    await act(async () => {
      const component = render(<StarWars />);
      expect(component.baseElement).toMatchSnapshot('StarWars before data');

      // wait until what we expect to be on the page is actually there
      await waitFor(() =>
        component.getByText('Star Wars: The Return of the Jedi')
      );
      expect(component.baseElement).toMatchSnapshot('StarWars after data');

      // by now, all the text from the api should have been rendered
      expect(
        screen.getByText(
          'The Galactic Empire is on the brink of defeat. Rebel forces are gathering their strength for a final assault on the Empire’s ultimate weapon, the second Death Star. Meanwhile, the fate of Han Solo rests in the hands of Princess Leia, Luke Skywalker, and the Ewoks on the forest moon of Endor.'
        )
      ).toBeInTheDocument();
    });
  });
});
