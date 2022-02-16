import http from 'http'

const PORT = 3000;

let locations = [{ city: "Ciudad Juarez", state: "Chihuahua", country: "Mexico", id: "1" }, { city: "EL Paso", state: "Texas", country: "United States", id: "2" }];
let customers = [{ name: "Total Play", id: "1" }, { name: "Televisa", id: "2" }, { name: "UTEP", id: "3" }];

const urlHandler = {
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
        return { message: 'Hello Logan' }
    }
}

const server = http.createServer((req, res) => {
    const splittedUrl = req.url.split("/")
    let result = urlHandler['null']()
    if (req.url != '' && urlHandler.hasOwnProperty(splittedUrl[1])) {
        result = urlHandler[splittedUrl[1]](splittedUrl[2]) || {}
    }

    res.writeHead(200, {
        'Content-Type': 'application/json'
    })

    res.end(JSON.stringify(result));
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})