import http from 'http'

const PORT = 3000;
const server = http.createServer()
let locations = [{ city: "Ciudad Juarez", state: "Chihuahua", country: "Mexico", id: 1 }, { city: "EL Paso", state: "Texas", country: "United States", id: 2 }];
let customers = [{ name: "Total Play", id: 1 }, { name: "Televisa", id: 2 }, { name: "UTEP", id: 3 }];
const urlHandler = {
    'GET': {
        "locations": (id) => {
            if (id) {
                return locations.find(e => e.id == id)
            }
            return locations
        },
        "customers": (id) => {
            if (id) {
                return customers.find(e => e.id == id)
            }
            return customers
        },
        "null": () => {
            return { message: '[GET] Hello Logan' }
        }
    },
    'POST': {
        "locations": ({ city, state, country, id }) => {
            if (!id) {
                let id = generateId(locations)
                if (!city) {
                    throw Error("Incomplete info, missing City parameter")
                }
                if (!state) {
                    throw Error("Incomplete info, missing State parameter")
                }
                if (!country) {
                    throw Error("Incomplete info, missing Country parameter")
                }
                locations.push({ city, state, country, id })
            } else {
                let index = locations.findIndex(e => e.id == id)
                if (index != -1) {
                    locations[index] = { city, state, country, id }
                } else {
                    throw ("Location doesn't exist")
                }
            }
            return locations[locations.length - 1]
        },
        "customers": ({ id, name }) => {
            if (!id) {
                let id = generateId(customers)
                if (!name) {
                    throw Error("Incomplete info, missing Name parameter")
                }
                customers.push({ name, id })
            } else {
                let index = customers.findIndex(e => e.id == id)
                if (index != -1) {
                    customers[index] = { name, id }
                } else {
                    throw ("Customer doesn't exist")
                }
            }
            return customers[customers.length - 1]
        },
        "null": () => {
            return { message: '[POST] Hello Logan' }
        }
    }
}

server.on('request', (req, res) => {
    let method = req.method;
    let result = urlHandler[method]['null']();
    let data = {};
    const splittedUrl = req.url.split("/")
    if (method == "POST") {
        req.on('data', (_data) => {
            data = _data.toString();
            console.log(data)
            if (req.url != '' && urlHandler.hasOwnProperty(method) && urlHandler[method].hasOwnProperty(splittedUrl[1])) {
                result = urlHandler[method][splittedUrl[1]](JSON.parse(data)) || {}
            }
            finishRequest({ res, result })
        })
    } else {
        data = splittedUrl[2]
        if (req.url != '' && urlHandler.hasOwnProperty(method) && urlHandler[method].hasOwnProperty(splittedUrl[1])) {
            result = urlHandler[method][splittedUrl[1]](data) || {}
        }
        finishRequest({ res, result })
    }

});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

function generateId(arr) {
    return Number(arr.sort((ce, ne) => ne.id - ce.id)[0].id) + 1
}

function finishRequest({ res, result }) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(result));
}