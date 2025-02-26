import type { Route } from '../../types/routers/index';
import { exampleAdapter } from '../../adapters/example.adapter';

const route: Route[] = [
  {
    path: 'example',
    method: 'get',
    middleware: [],
    handler: exampleAdapter
  }
]

export default route
