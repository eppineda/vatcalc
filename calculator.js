import console from './my-console.js'

const start = filespec => {
	console.log('calculator started')
	loadRates(filespec).then(call => {
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

const loadRates = filespec => new Promise((resolve, reject) => {
	if (!filespec) reject('no rate file specified')

	console.log(`loading ${ filespec }...`)
	const rates = undefined // todo: finish
	resolve(rates)	
})

const calculatorulator = { start, running, stop, addObserver }
export default calculatorulator
