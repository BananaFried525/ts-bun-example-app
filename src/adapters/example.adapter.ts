import { exampleController } from '../controllers/example.controller'
import { createAdapter } from '../utils/route'

export const exampleAdapter = createAdapter(exampleController)