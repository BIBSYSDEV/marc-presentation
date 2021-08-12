import { render, screen } from '@testing-library/react';
import App from './App';

test('it renders', () => {
  render(<App />);
  const headerElement = screen.getByText(/MARC-visning/i);
  expect(headerElement).toBeInTheDocument();
});
