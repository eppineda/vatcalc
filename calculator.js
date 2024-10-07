import { loadJsonFile } from 'load-json-file'
import console from './my-console.js'

const start = filespec => {
	console.log('calculator started')
	loadRates(filespec).then(rates => {
	}).catch(err => {
		console.error(err)
	})
}

const running = () => false

const stop = () => {
	console.log('calculator stopped')
}

const addObserver = who => new Promise((resolve, reject) => {
	if (!who) reject(`invalid observer: ${ JSON.stringify(who) }`)
})

const loadRates = filespec => new Promise(async (resolve, reject) => {
	if (!filespec) reject('no rate file specified')

	console.log(`loading ${ filespec }...`)
	const rates = await loadJsonFile(filespec); console.debug(JSON.stringify(rates))

	if (!rates) reject(`finish reading rates from ${ filespec }\n${ console.trace() }`)
	resolve(rates)	
})

const calculatorulator = { start, running, stop, addObserver }
export default calculatorulator
