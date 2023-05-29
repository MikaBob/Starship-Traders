import env = require('dotenv')
import main from './main'
import { init } from './api'
env.config()

const { SPACE_TRADERS_TOKEN } = process.env

if ((SPACE_TRADERS_TOKEN ?? '') === '') throw new Error('Invalid token provided: ' + SPACE_TRADERS_TOKEN)

init(SPACE_TRADERS_TOKEN ?? '')
main()
