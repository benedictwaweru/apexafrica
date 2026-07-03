import { RouterProvider } from '@tanstack/react-router';

import { createRouter } from './router/router';

const router = createRouter();

export default function App() {
  return <RouterProvider router={router} />;
}
