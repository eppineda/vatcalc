import 'dotenv/config'
import mojo from '@mojojs/core'
import console from './my-console.js'
import server from './server.js'

server.start(mojo).then(({ app, calc }) => {
	app.start()
	calc.start(/* rate file e.g. rates2024.json */)

	while (calc.running()) {
	}

	calc.stop()
}).catch(msg => {
	console.error(msg)
})
