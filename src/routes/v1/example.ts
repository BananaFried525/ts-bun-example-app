import type { Route } from '../../types/routers/index';
import { exampleAdapter } from '../../adapters/example.adapter';
import { HTTP_METHOD } from '../../constants/environment';

const route: Route[] = [
  {
    path: 'test',
    method: HTTP_METHOD.GET,
    middleware: [],
    handler: exampleAdapter
  }
]

export default route
