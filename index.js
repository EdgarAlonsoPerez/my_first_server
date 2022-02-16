import http from 'http'

const PORT = 3000;

let locations = [{ city: "Ciudad Juarez", state: "Chihuahua", country: "Mexico", id: "1" }, { city: "EL Paso", state: "Texas", country: "United States", id: "2" }];
let customers = [{ name: "Total Play", id: "1" }, { name: "Televisa", id: "2" }, { name: "UTEP", id: "3" }];

const urlHandler = {
    "/locations": (p) => {
        return locations
    },
    "/customers": (p) => {
        return customers
    },
    "null": () => {
        return { message: 'Hello Logan' }
    }
}

const server = http.createServer((req, res) => {
    let result = urlHandler['null']()
    if (req.url != '' && urlHandler.hasOwnProperty(req.url)) {
        result = urlHandler[req.url](req)
    }

    res.writeHead(200, {
        'Content-Type': 'application/json'
    })

    res.end(JSON.stringify(result));
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})