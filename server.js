import { readdir } from 'fs/promises'
import console from './my-console.js'
import calc from './calculator.js'

const startup = (mojo, filespec) => new Promise((resolve, reject) => {
	const port = process.env.PORT
	const app = mojo()

	mapRoutes(app, filespec)
	resolve(app)
}); const start = startup

const handleExit = (signal = 0) => {
	console.log(`\n--Received ${ signal }. App will stop listening.`)
	process.exit(signal)
}
const shutdown = () => {
	handleExit()
}; const stop = shutdown

const listFilesAsync = async (path, wildcards) => {
	const found = []
	const options = {
	}

	try {
// identify all files in the specified directory that match the wildcards, rewritten as being relative to the root (/) www directory
		const all = (await readdir(path, options))
			.filter(f => {
				let match = false

				wildcards.forEach(pattern => {
					if (pattern.test(f)) match = true
				})

				return match
			})
			.forEach(f => found.push(`${ path }/${ f }`.replace('./public', ''))) // rewrite the path relative to public/
  	} catch (err) {
    		console.error(err)
  	}

	//console.log(found)
	return found
}

const mapRoutes = async (app, filespec) => {
	const router = app.router

	app.get('/', async ctx => {
		await ctx.sendFile(ctx.home.child('public', 'index.html')) // default response for root aka public/
	})
	calc.start(filespec).then(rates => {
		const EUROPE = 'Europe'
		const UNITEDSTATES = 'United States'
		const RATES_EU = rates[EUROPE]//; console.debug(JSON.stringify(RATES_EU))
		const RATES_US = rates[UNITEDSTATES]//; console.debug(JSON.stringify(RATES_US))
		const respondWith = async (ctx, rateTable, subtotal) => {
			const params = await ctx.params()//; console.debug(`${ ctx.req.path } with params ${ params }`)
			const country = encodeURI(ctx.req.path).split('/')[2]//; console.debug(country)
			const response = {}; const json = {}
			const calculateTax = (subtotal, rate) => subtotal * rate

			json['location'] = country
			json['rate'] = rateTable[country]

			if (subtotal) json['tax'] = calculateTax(subtotal, json['rate'])

			response['json'] = json
			response['status'] = 200; console.debug(JSON.stringify(response))
			ctx.render(response)
		}

		app.get('/Europe/:country', ctx => {
			respondWith(ctx, RATES_EU)
		})
		app.get('/Europe/:country/:subtotal', ctx => {
			const subtotal = encodeURI(ctx.req.path).split('/')[3]; console.debug(subtotal) // todo: cannot handle decimal in URI
			respondWith(ctx, RATES_EU, subtotal)
		})
		app.get('/United States/:state', ctx => {
			respondWith(ctx, RATES_US)
		})
		app.get('/United States/:state/:subtotal', ctx => {
			const subtotal = encodeURI(ctx.req.path).split('/')[3]; console.debug(subtotal) // todo: cannot handle decimal in URI
			respondWith(ctx, RATES_US, subtotal)
		})
	}).catch(err => {
		throw new Error(err)
	})

// all static web files under public/
	new Promise((resolve, reject) => {
		const promises = []
		const dirs = [
			'./public',
		].forEach(async path => {
			const allowed = [
				/.html/,
				/.css$/,
				/.js$/,
				/.min.js$/,
				/.jpg/,
				/.png/,
				/.gif/,
			]

			promises.push(new Promise((resolve, reject) => {
				resolve(listFilesAsync(path, allowed))
			}))

		})

		Promise.all(promises).then(result => {
			let toBeServed = []

			result.forEach(list => {
				toBeServed = toBeServed.concat(list)
			})// ; console.log(toBeServed)

			resolve(toBeServed)
		})
	}).then(www => {
		www.forEach(request => {
			const response = request.replace('/', '')//; console.log(`requesting ${ request } responds with ${ response }`)
			app.get(request, async ctx => {
				await ctx.sendFile(ctx.home.child('public', response))
			})
		})
	}).catch(err => {
		throw new Error(err)
	})
}

const server = { startup, shutdown, start, stop }
export default server

process.on('SIGINT', shutdown)
process.on('SIGQUIT', shutdown)
process.on('SIGTERM', shutdown)
