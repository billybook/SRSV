var gamePrompt = require('game-prompt');
var colors = require('colors');

// Global variables
var playerName;
var shipName;
var shipFuel = 1000;
var currentPlanet = 'e';
var artifactCount = 0;

var planets = {
    e: {
        name: 'Earth',
        distance: 10,
        welcomeText: 'Welcome home!',
        fuel: 10,
        fuelText: 'You add more fuel to your ship (+10 gallons).',
        welcomeAction: checkWin
    },
    m: {
        name: 'Mesnides',
        distance: 20,
        welcomeText: 'You\'ve arrived at Mesnides. As you land, a representative of the Mesnidian people is there to greet you.\n' +
        '"Welcome, traveler, to Mesnides."',
        welcomeAction: interact,
        artifact: true,
        artifactText: '"Here, take this Myoin Horn, an ancient Mesnidian instrument."',
        planetInfo: '"Well, Laplides suffered from atomic war and has been uninhabited for centuries. You would do well to avoid it on your journey."'
    },
    l: {
        name: 'Laplides',
        distance: 30,
        welcomeText: 'You enter orbit around Laplides. Looking down at the planet, you see signs of atomic war and realize there is no option but to turn around.',
        welcomeAction: getDestinations
    },
    k: {
        name: 'Kiyturn',
        distance: 120,
        welcomeText: 'You\'ve arrived at Kiyturn. As you land, a representative of the Kiyturn people is there to greet you.\n' +
        '"Hello, what brings you to Kiyturn? You\'re not here to cause trouble are you?"',
        welcomeAction: interact,
        artifact: true,
        artifactText: '"We don\'t trust you.  Please have this prized Kiyturn Glass Bowl as a token of our distrust."',
        planetInfo: '"I\'m sorry, but we do not leave our planet. The universe, to us, is a beautiful mystery."'
    },
    a: {
        name: 'Aenides',
        distance: 25,
        welcomeText: 'You discover upon arrival to Aenides that they are a hostile people. You attempt to land, but they begin to fire upon your S.R.S.V. and you are forced to retreat.',
        welcomeAction: getDestinations
    },
    c: {
        name: 'Cramuthea',
        distance: 200,
        fuel: 500,
        welcomeText: 'Cramuthea has been abandoned due to global environmental disaster, but there are remnants of the people that left.\n' + 'You find a beacon signal that tells you the Cramuthean people have migrated to Smeon T9Q.',
        fuelText: 'You are able to refuel your ship (+500 gallons).',
        welcomeAction: getDestinations
    },
    s: {
        name: 'Smeon T9Q',
        distance: 400,
        welcomeText: 'The Cramuthean people, living on Smeon T9Q, are a friendly people.',
        fuel: 100,
        fuelText: 'They give you some fuel (+100 gallons) when you arrive.',
        welcomeAction: interact,
        artifact: true,
        artifactText: '"Sure.  Why not?  We\'ll give you this beloved dried Cramun Flower from the home planet we destroyed."',
        planetInfo: '"The people of Aenides once tried to take over our home planet by force.  We would recommend staying far away from them."'
    },
    g: {
        name: 'Gleshan 7Z9',
        distance: 85,
        welcomeText: 'As you descend upon Gleshan 7Z9, you notice that the streets and buildings are in disrepair.',
        welcomeAction: interact,
        artifactText: '"I\'m sorry, but we are too poor to part with any of our artifacts."',
        planetInfo: '"Long ago, a wealthy people, the Cramuthean, visited our humble planet."'
    }
}

function startGame() {
    gamePrompt('S.R.S.V Press ENTER to start.', intro);
}

function intro() {
    gamePrompt(['You are the captain of a Solo Research Space Vehicle (S.R.S.V.) ' +
        'on an expedition to explore foreign planets. Your mission is to make contact ' +
        'with three alien life forms, acquire an artifact representative of their culture' +
        ', and bring back your findings to Earth.',
        'A voice comes on over the intercom.',
        '"Please state your name for identity verification"'.blue], collectPlayerName);
}

function collectPlayerName(name) {
    if (name) {
        playerName = name;
        gamePrompt([
            '"Thank you Captain ' + name + '."',
            '"Please state your vehicle name for identity verification."'.blue
        ], collectShipName)
    } else {
        gamePrompt('"Don\'t ignore me.  I have feelings.  Tell me your name."'.blue, collectPlayerName)
    }
}

function collectShipName(name) {
    if (name) {
        shipName = name;
        gamePrompt([
            '"' + shipName + '!  Excellent!"'.blue,
            'You have ' + shipFuel.toLocaleString() + ' gallons of fuel.',
            'Your mission is to collect three artifacts and return to Earth before running out of fuel.'
        ], getDestinations)
    } else {
        gamePrompt('"I asked you a question.  Please respond.  What is the name of your vessel?"'.blue, collectShipName)
    }
}

function getDestinations() {
    var planetMenu = '"Where to Captain ' + playerName + '?"\n'.blue;
    Object.keys(planets).forEach(function (planet) {
        planetMenu += '(' + planets[planet].name.charAt(0) + ')' + planets[planet].name.substr(1) + ' - ' + planets[planet].distance + ' lightyears\n';
    });
    gamePrompt(planetMenu, travel);
}

function travel(destinationPlanet) {
    destinationPlanet = destinationPlanet.toLowerCase();

    //!Object.keys(planets).indexOF(destinationPlanet) < 0
    if (!Object.keys(planets).find(function (planet) { return destinationPlanet === planet })) {
        gamePrompt('You did not enter a valid destination.', getDestinations);
        return;
    }

    if (currentPlanet !== destinationPlanet) {
        currentPlanet = destinationPlanet;
        shipFuel -= planets[currentPlanet].distance;
        printFuel = (shipFuel < 0) ? 0 : shipFuel;

        gamePrompt([
            'Flying to ' + planets[currentPlanet].name + '...',
            'You used ' + planets[currentPlanet].distance + ' gallons of gas. The ' + shipName + ' now has ' + printFuel.toLocaleString() + ' gallons of fuel remaining.'
        ], arrive);
    } else {
        gamePrompt('You are already at ' + planets[currentPlanet].name + '.', getDestinations);
    }
}

function arrive() {
    tempText = [planets[currentPlanet].welcomeText];
    if (planets[currentPlanet].fuel) {
        shipFuel += planets[currentPlanet].fuel;
        tempText.push(planets[currentPlanet].fuelText);
        tempText.push('The ' + shipName + ' now has ' + shipFuel.toLocaleString() + ' gallons of fuel remaining.');
        delete planets[currentPlanet].fuel;
        delete planets[currentPlanet].fuelText;
    }
    if (shipFuel <= 0) {
        checkWin();
    } else {
        gamePrompt(tempText, planets[currentPlanet].welcomeAction);
    }
}

function interact() {
    gamePrompt([
        '"How can we assist you?"\n' +
        'Ask about (A)rtifact.\n' + 'Ask about other (P)lanets\n' + '(L)eave'], interactResponse)
}

function interactResponse(interactOption) {
    switch (interactOption.toLowerCase()) {
        case 'a':
            if (planets[currentPlanet].artifact) {
                planets[currentPlanet].artifact = false;
                artifactCount++;
                tempText = planets[currentPlanet].artifactText;
                planets[currentPlanet].artifactText = 'I\'m sorry, but we\'ve already given you all we could.';
                congratsText = 'Congratulations!  You now have ' + artifactCount + ' artifact';
                congratsText += (artifactCount === 1) ? '.' : 's.';
                congratsText += (artifactCount < 3) ? '  Only ' + (3 - artifactCount) + ' more to go.' : '  Time to go home!';

                gamePrompt([tempText, congratsText], interact);
            } else {
                gamePrompt(planets[currentPlanet].artifactText, interact);
            }
            break;
        case 'p':
            gamePrompt(planets[currentPlanet].planetInfo, interact);
            break;
        case 'l':
            getDestinations();
            break;
        default:
            gamePrompt('You did not enter a valid option.', interact);
            return;
    }
}

function checkWin() {
    if (currentPlanet === 'e') {
        if (artifactCount < 3) {
            haveArtifacts = (artifactCount === 1) ? artifactCount + ' artifact' : artifactCount + ' artifacts';
            gamePrompt('You only have ' + haveArtifacts + '.  Please collect ' + (3 - artifactCount) + ' more.', getDestinations);
        } else {
            gamePrompt('Congratulations!  You have successfully completed the mission!');
        }
    } else {
        gamePrompt([
            'I\m sorry.  You\'ve run out of fuel, and are now stranded on ' + planets[currentPlanet].name + '.',
            'Better luck next time!'
        ])

    }
}


startGame();