import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };
type cowboyQuery = { cowboy_name: string };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type animal = { type: "space_animal", metadata: spaceAnimal, location: location };
type cowboy = { type: "space_cowboy", metadata: spaceCowboy, location: location };
type spaceEntity =
    | cowboy
    | animal;


type animalEntityEntry = { type: spaceAnimal["type"], location: location };
type animalEntity = { "space_animals": animalEntityEntry[] };

type cowboyDBEntry = {
    metadata: spaceCowboy, location: location
}

type cowboyDB = {
    name: {
        cowboyDBEntry
    }
}

type animalDBEntry = {
    metadata: spaceAnimal, location: location
}
type animalDB = animalDBEntry[]

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];

// Don't think it's efficient to have above database, not good for querying
const cowboyDb = {} as cowboyDB;
const animalDb = [] as animalDB;

const app = express();
app.use('*', express.json({ strict: false }));

// === ADD YOUR CODE BELOW :D ===
function verifyEntity(entity: any): boolean {
    if (entity.type === undefined || entity.metadata === undefined 
            || entity.location === undefined) return false;
        
    if (typeof entity.type !== "string") return false;
    if (entity.type === "space_animal") {
        let meta : spaceAnimal = entity.metadata;
        if (meta.type !== "pig" && meta.type !== "cow"
        && meta.type !== "flying_burger" ) return false;
    } else {
        let meta : spaceCowboy = entity.metadata;
        if (typeof meta.name !== "string") return false;
        if (typeof meta.lassoLength!== "number") return false;
    }
    
    if (typeof entity.location.x !== "number"
        || typeof entity.location.y !== "number") return false;
    return true;
}

function queryCowboy(cowboyName: string) {
    return cowboyDb[cowboyName];
}

function withinDist(x1: number, y1: number, 
    x2: number, y2: number, range: number): boolean {
    if (Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2) <= range ) return true;
    return false;
}

function findAnimal(cowboy : cowboyDBEntry) : animalEntity {
    let x = cowboy.location.x;
    let y = cowboy.location.y;
    let range = cowboy.metadata.lassoLength;

    let retEntities : animalEntity = {
        space_animals: []
    };
    for (let entry of animalDb) {
        if (withinDist(x, y, entry.location.x, entry.location.y, range)) {
            retEntities.space_animals.push({
                type: entry.metadata.type,
                location: entry.location
            })
        }
    }
    return retEntities;
}

// Version 2 Uses the default database
function findAnimalV2(cowboyName: string) : animalEntity | undefined {
    let cowboy = spaceDatabase.find(entity => {
        entity.type === 'space_cowboy' && entity.metadata.name === cowboyName;
    }) as cowboy;
    if (cowboy === undefined) return undefined;

    let animals = spaceDatabase.filter(entity => {
        entity.type === 'space_animal'
    }) as animal[];
    if (animals.length === 0) return {
        'space_animals': []
    };
        

    let retEntities : animalEntity = {
        space_animals: []
    };
    for (let entry of animals) {
        if (withinDist(cowboy.location.x, cowboy.location.y, 
            entry.location.x, entry.location.y, cowboy.metadata.lassoLength)) {
            retEntities.space_animals.push({
                type: entry.metadata.type,
                location: entry.location
            })
        }
    }
    return retEntities;
}





// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    let entities : spaceEntity[] = req.body;
    for (let entity of entities) {
        if (!verifyEntity(entity)) continue;
        
        spaceDatabase.push(entity);

        // Basically use hashMap for space_animal
        // O(1) to search in the future
        if (entity.type === "space_animal") {
            animalDb.push({
                metadata: entity.metadata,
                location: entity.location
            });
        } else if (entity.type === "space_cowboy") {
            cowboyDb[entity.metadata.name] = {
                metadata: entity.metadata,
                location: entity.location,
            }
        }
    }
    res.status(200).json({});
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    let query : cowboyQuery = req.body;

    // Bad request
    if (typeof query.cowboy_name !== "string") {
        res.status(400).json({});
    }
    
    // Not found
    if (queryCowboy(query.cowboy_name) === undefined) {
        res.status(404).json({});
    }

    let cowboy = queryCowboy(query.cowboy_name);
    res.status(200).json(findAnimal(cowboy));
})

app.listen(8080);
