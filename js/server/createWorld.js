console.log('createWorld');

import systems from '../data/systems'

//Constants
//import FactionPlayerTypes from '../consts/FactionPlayerTypes';
import OrbitTypes from '../consts/OrbitTypes';

//Helpers
import {orbitPeriod} from '../helpers/Physics';

//Reducers
import {addPlayer} from '../reducers/game/players';
import {addFaction} from '../reducers/game/factions';
import {addPlayerToFaction} from '../reducers/game/factionPlayer';
import {addSystem} from '../reducers/game/systems';
import {addSystemBody} from '../reducers/game/systemBodies';
import {addSystemToFaction} from '../reducers/game/factionSystem';
import {addSystemBodyToFaction} from '../reducers/game/factionSystemBody';
import {setTime} from '../reducers/game';


export default function createWorld(store, definition) {
  switch(definition.type) {
    case 'new':
      return createNewWorld(store, definition);
  }
}

function createNewWorld(store, definition) {
  console.log('Server.createWorld: ', definition);

  let factionIdCounter = 1;
  let factionIdByName = {};
  let playerIdCounter = 1;

  let systemIdCounter = 1;
  let bodyIdCounter = 1;

  const createdStartingSystems = {};
  const createdStartingSystemData = {};


  function createSystem(definition) {
    const systemId = (systemIdCounter++).toString();
    const primaryBodyId = bodyIdCounter;
    const systemBodiesData = {};
    const systemBodyNames = {};

    const nameToId = {};

    store.dispatch(addSystem(systemId, {}));

    definition.bodies.forEach(bodyDefinition => {
      const bodyId = (bodyIdCounter++).toString();
      let {name, parent, ...data} = bodyDefinition;

      nameToId[name] = bodyId;

      //get parent ID
      const parentId = definition.parentId || (parent ? nameToId[parent] : null);


      systemBodiesData[bodyId] = {
        ...data,
        parentId,
        children: [],
        systemId: systemId.toString(),
        orbit: data.orbit ? normaliseOrbit(data.orbit, data, systemBodiesData[parentId]) : null
      };

      //add to parents children list (if appropriate)
      if(parentId) {
        systemBodiesData[parentId].children.push(bodyId);
      }
    })

    //Now record the system bodies
    Object.keys(systemBodiesData).forEach((bodyId) => {
      store.dispatch(addSystemBody(bodyId, systemBodiesData[bodyId]));
    });

    return {
      systemId,
      name: definition.name,
      nameToId
    };
  }
  //end create system

  definition.factions.forEach(factionDefinition => {
    const factionId = (factionIdCounter++).toString();
    store.dispatch(addFaction(factionId, {name: factionDefinition.name}));

    factionIdByName[factionDefinition.name] = factionId;

    //Create starting systems
    Object.keys(factionDefinition.startingSystems).forEach(startingSystemId => {
      const systemFactionDefinition = factionDefinition.startingSystems[startingSystemId];

      //If this system hasn't already been created, do so
      if(!createdStartingSystems.hasOwnProperty(startingSystemId)) {
        createdStartingSystems[startingSystemId] = getStartingSystemDefinition(systemFactionDefinition);

        createdStartingSystemData[startingSystemId] = createSystem(createdStartingSystems[startingSystemId], true);
      }

      const systemData = createdStartingSystemData[startingSystemId];

      //Link system to faction
      store.dispatch(addSystemToFaction(systemData.systemId, factionId, systemFactionDefinition.factionName || systemData.name));

      //Known system bodies
      Object.keys(systemData.nameToId).forEach((bodyName) => {
        const systemBodyId = systemData.nameToId[bodyName];

        store.dispatch(addSystemBodyToFaction(systemBodyId, factionId, {
          name: (systemFactionDefinition.nameMap && systemFactionDefinition.nameMap[bodyName]) || bodyName
        }));
      });
    });
  });

  definition.players.forEach(playerDefinition => {
    const playerId = (playerIdCounter++).toString();

    store.dispatch(addPlayer(playerId, {name: playerDefinition.name}));

    playerDefinition.factions.forEach((factionDefinition) => {
      if(!factionIdByName.hasOwnProperty(factionDefinition.name)) {
        throw new Error('Player must belong to known faction');
      }

      //link player to faction
      store.dispatch(addPlayerToFaction(playerId, factionIdByName[factionDefinition.name], factionDefinition.role))
    });
  });

  store.dispatch(setTime(new Date(definition.startDate).valueOf() / 1000));

  //TODO create the rest of the systems, etc

  const state = store.getState();
  console.log('createWorld state: ', state);

  return {
    name: definition.gameName,
    factions: state.game.factions,
    players: state.game.players
  }
}



function getStartingSystemDefinition(definition) {
  if(definition.type === 'known') {
    return systems[definition.name];
  }

  throw new Error('Currently only known systems are implemented');
}


function normaliseOrbit(orbit, systemBody, systemBodyParent) {
  switch(orbit.type) {
    case OrbitTypes.REGULAR:
      return {
        ...orbit,
        minRadius: orbit.radius,
        maxRadius: orbit.radius,
        period: orbitPeriod(orbit.radius, systemBody, systemBodyParent)
      };
  }

  return orbit;
}

/*

import {random} from '../helpers/Maths';
import {mapObj} from '../helpers/Object';
import {randomString} from '../helpers/String';


function makeAsteroidBelt(parentId, {
  minOrbitRadius,
  maxOrbitRadius,
  minNumber,
  maxNumber,
  minRadius,
  maxRadius,
  cTypeWeight,
  sTypeWeight,
  mTypeWeight,
  nameProps,
  factionNameProps
}) {
  const cTypeDensity = [1380*0.9, 1380*1.1];//1.38//g/cm3
  const sTypeDensity = [2710*0.9, 2710*1.1];//2.71//g/cm3
  const mTypeDensity = [5320*0.9, 5320*1.1];//5.32//g/cm3

  const cTypeAlbedo = [0.03, 0.1];
  const sTypeAlbedo = [0.1, 0.22];
  const mTypeAlbedo = [0.1, 0.2];

  const totalWeight = cTypeWeight + sTypeWeight + mTypeWeight;

  const number = getNumberInRange(minNumber, maxNumber, 1);

  const asteroids = [];

  for(let i = 0; i < number; i++) {
    let orbitRadius = getNumberInRange(minOrbitRadius, maxOrbitRadius);
    let radius = getNumberInRange(minRadius, maxRadius, 2);//tend towards small asteroids
    let volume = volumeOfSphere(radius);
    let density, mass, albedo, asteroidType, asteroidTypeRand = Math.random() * totalWeight;

    if(asteroidTypeRand < cTypeWeight) {
      //is a cType
      density = getNumberInRange(cTypeDensity);
      albedo = getNumberInRange(cTypeAlbedo);
    } else if(asteroidTypeRand < cTypeWeight + sTypeWeight) {
      //is an s type
      density = getNumberInRange(sTypeDensity);
      albedo = getNumberInRange(sTypeAlbedo);
    } else {
      //is an m type
      density = getNumberInRange(mTypeDensity);
      albedo = getNumberInRange(mTypeAlbedo);
    }

    mass = volume * density;

    let asteroid = {
      type: SystemBodyTypes.ASTEROID,
      parentId,
      radius,
      mass,
      density,
      albedo,

      day: 1000,

      orbit: {
        type: OrbitTypes.REGULAR,
        radius: orbitRadius,
        offset: Math.random()
      }
    };

    asteroid.name = generateAsteroidName(nameProps, asteroid),
    asteroid.factionNames = mapObj(factionNameProps, (nameProps, factionName) => {
      return generateAsteroidName(nameProps, asteroid);
    });

    asteroids.push(asteroid);
  }

  //sort into radius order
  asteroids.sort((a, b) => {
    return a.orbit.radius - b.orbit.radius;
  });

  return asteroids;
}

function generateAsteroidName(nameProps, asteroid) {
  //TODO be better than this...
  switch(nameProps.system) {
    case 'sol':
      return random(1975, 2005, 0) + randomString(2, 'ABCDEFGHJKLMNOPQRSTUVWXYZ');
    default:
      return (nameProps.prefix || '') + Math.round(Math.random() * 1000000) + ('' + nameProps.suffix);
  }
}

function getNumberInRange(a, b, distribution = 1) {
  if(a instanceof Array) {
    b = a[1];
    a = a[0];
  }

  const min = Math.min(a, b);
  const max = Math.max(a, b);

  const random = Math.pow(Math.random(), distribution);

  return min + ((max - min) * random);
}
*/
