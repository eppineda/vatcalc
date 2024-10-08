import 'dotenv/config'
import mojo from '@mojojs/core'
import console from './my-console.js'
import server from './server.js'

let rateFile

process.argv.forEach(function (val, index, array) {
	console.debug(index + ': ' + val);
	if (3 === index) rateFile = val
})

server.start(mojo, rateFile).then(app => {
	app.start()
}).catch(msg => {
	console.error(msg)
})
