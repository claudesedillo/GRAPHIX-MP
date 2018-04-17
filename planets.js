var planets = [], orbits = [], moons = [];
var sun;
var moonSelected = false;
var planetSelected = false;
var selectedPlanetIndex;
var scene, camera, renderer, backgroundScene, backgroundCamera;
var controls;
var ambientLight;
var orbitMaterial;

var terrestrialGeometry = new THREE.SphereGeometry(1, 32, 32);
var moonGeometry = new THREE.SphereGeometry(0.6, 32, 32);
var sunGeometry = new THREE.SphereGeometry(18, 32, 32);
var gasGiantGeometry = new THREE.SphereGeometry(2, 32, 32);

function initScene(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
    renderer = new THREE.WebGLRenderer();
    
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.Camera();

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.01);
    scene.add(ambientLight);
    
    controls = new THREE.OrbitControls(camera);
//    controls.noPan = true;
//    camera.position.set(0, 0, 10);
//    controls.target.set(0,0,0);
    
    var starSphere	= THREEx.Planets.createStarfield()
	scene.add(starSphere)

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function initLights(){
    createSun();
}

function init(){
    createTerrestrialPlanet("Mercury", "assets/planets/map/mercury.jpg", "assets/planets/bump/mercurybump.jpg", 50, 3);
    createTerrestrialPlanet("Venus", "assets/planets/map/venus.jpg", "assets/planets/bump/mercurybump.jpg", 350, 2);
    createTerrestrialPlanet("Earth", "assets/planets/map/earth.jpg", "assets/planets/bump/mercurybump.jpg", 480, 1);
    createTerrestrialPlanet("Mars", "assets/planets/map/mars.jpg", "assets/planets/bump/mercurybump.jpg", 550, 0.5);
    createGasGiant("Jupiter", "assets/planets/map/jupiter.jpg", 720, 0.4);
    createRingedPlanet("Saturn", 830, 0.2);
    createRingedPlanet("Uranus", 980, 0.1);
    createGasGiant("Neptune", "assets/planets/map/neptune.jpg", 1080, 0.08);
    centerEarth();
    //createMoon("Moon", "assets/moons/map/moon.jpg", "assets/moons/bump/moonbump.jpg", 15, 0.5, 2);
}

function createSun(){
	var texture	= THREE.ImageUtils.loadTexture("assets/planets/map/sun.jpg");
	var material	= new THREE.MeshBasicMaterial( {
                map: texture
    } );
	sun	= new THREE.Mesh(sunGeometry, material);
    sun.name = "Sun";
    scene.add(sun);
    positionSun();   
}

function createMoon(name, mapURL, bumpMapURL, orbit, speed, planetIndex){
    var material	= new THREE.MeshPhysicalMaterial({
		map	: THREE.ImageUtils.loadTexture(mapURL),
		bumpMap	: THREE.ImageUtils.loadTexture(bumpMapURL),
		bumpScale: 0.005,
	})
    var moon = new THREE.Mesh(moonGeometry, material);
    
    moon.name = name;
    moon.orbit = orbit;
    moon.speed = speed;
    moon.planetIndex = planetIndex;
    
    moons.push(moon);
    scene.add(moon);
}

function createTerrestrialPlanet(name, mapURL, bumpMapURL, orbit, speed){
	var material	= new THREE.MeshPhysicalMaterial({
		map	: THREE.ImageUtils.loadTexture(mapURL),
		bumpMap	: THREE.ImageUtils.loadTexture(bumpMapURL),
		bumpScale: 0.005,
	})
	var planet	= new THREE.Mesh(terrestrialGeometry, material);
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    planets.push(planet);
    
    createOrbit(orbit);
    scene.add(planet); 
}

function createGasGiant(name, mapURL, orbit, speed){
	var texture	= THREE.ImageUtils.loadTexture(mapURL)
	var material	= new THREE.MeshPhysicalMaterial({
		map	: texture,
		bumpMap	: texture,
		bumpScale: 0.02,
	})
	var planet	= new THREE.Mesh(gasGiantGeometry, material)
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    
    planets.push(planet);
    createOrbit(orbit);
    scene.add(planet);
}

function createRingedPlanet(name, orbit, speed){
    var planet
    if(name == "Saturn"){
       planet	= THREEx.Planets.createSaturn()
	   planet.receiveShadow	    = true
	   planet.castShadow		= true
       var ring	= THREEx.Planets.createSaturnRing()
       ring.receiveShadow	= true
       ring.castShadow		= true
       ring.parentIndex = 6
       planet.add(ring)
    }
    else{
        planet	= THREEx.Planets.createUranus()
        planet.receiveShadow	= true
        planet.castShadow		= true
        var ring	= THREEx.Planets.createUranusRing()
        ring.receiveShadow	= true
        ring.castShadow		= true
        ring.parentIndex = 6
        planet.add(ring)
    }
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    
    planets.push(planet);
    createOrbit(orbit);
    scene.add(planet);
}

function createOrbit(orbit){
    //orbit
    var shape = new THREE.Shape();
    shape.moveTo(orbit, 0);
    //shape.absarc(0, 0, orbit, 0, 2 * Math.PI, false);
    shape.absellipse(0, 0, orbit, orbit, 0, 2 * Math.PI, false);
    var spacedPoints = shape.createSpacedPointsGeometry(128);
    spacedPoints.rotateX(THREE.Math.degToRad(-90));
    orbitMaterial = new THREE.LineBasicMaterial( {
        color: "black",
        linewidth: 0.001
    } );
    var orbit = new THREE.Line(spacedPoints, orbitMaterial);
    orbits.push(orbit);
    scene.add(orbit);
}

function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.01;
    
    planets.forEach(function(planet) {
        timestamp = Date.now() * 0.0001;
        var orbit = planet.orbit;
        var speed = planet.speed;
        
        if(planet.name == "Earth"){
            planet.position.x = orbit;
            planet.position.z = orbit;
        }
        else{
            planet.position.x = Math.sin(timestamp * speed) * orbit;
            planet.position.z = Math.cos(timestamp * speed) * orbit;
        }

//        console.log(moons[0].name);
//        moons[0].position.x = Math.sin(timestamp * moons[0].speed) * moons[0].orbit - planets[2].position.x;
//        moons[0].position.z = Math.cos(timestamp * moons[0].speed) * moons[0].orbit - planets[2].position.z;
        
           
        if(planet.name == "Venus"){
            planet.rotation.y -= 0.01;
            planet.position.x = Math.cos(timestamp * speed) * orbit;
            planet.position.z = Math.sin(timestamp * speed) * orbit;
        }
        else if(planet.name == "Uranus"){
            planet.rotation.z += 0.01;
            planet.position.x = Math.cos(timestamp * speed) * orbit;
            planet.position.z = Math.sin(timestamp * speed) * orbit;
        }
        else{
            planet.rotation.y += 0.01;
        }
    });
    
    if(planetSelected == true){
        controls.target.copy(planets[selectedPlanetIndex].position);
        camera.position.x = planets[selectedPlanetIndex].position.x - 3;
        camera.position.z = planets[selectedPlanetIndex].position.z + 3;
        controls.update();
    }
    if(moonSelected == true){
        controls.target.copy(moons[0].position);
        camera.position.x = moons[0].position.x - 2.5;
        camera.position.z = moons[0].position.z + 0.8;
    }
                  
    renderer.render(scene, camera);
    controls.update();
}

var initialz = 10;
var initialx = 10;

function positionSun(){
    sun.position.set(0, 0, 0);
    sunlight = new THREE.PointLight( 0xFDB813, 2, 0, 2);
    sunlight.position.copy(sun.position);
    scene.add(sunlight);
    console.log("Sun position: ")
    console.log(sun.position);
}

function positionPlanet(planet){
    planet.position.set(initialx, 0, initialz);
    initialz += 10;
    initialx -= 10;
    console.log(planet.name + ":");
    console.log(planet.position);
}

initScene();
initLights();
init();
animate();

//https://stackoverflow.com/questions/30918864/orbit-camera-lookat-change
//https://stackoverflow.com/questions/24855708/how-can-i-apply-trackballcontrols-to-a-moving-target
function centerSun(){
    controls.target.copy(sun.position);
    planetSelected = false;
    moonSelected = false;
    $('.planet-btn').removeAttr('hidden');
    $('.moon-btn').prop('hidden', 'hidden');
}

function centerMercury(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 0;
    $('.planet-btn').removeAttr('hidden');
}

function centerVenus(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 1;
    $('.planet-btn').removeAttr('hidden');
}

function centerEarth(){
    planetSelected = true;
    moonSelected = false;
    
    selectedPlanetIndex = 2;
    $('.planet-btn').prop('hidden', 'hidden');
    $('#btn-earth').removeAttr('hidden');
    $('.earth-moon').removeAttr('hidden');
}

function centerMars(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 3;
    $('.planet-btn').prop('hidden', 'hidden');
    $('#btn-mars').removeAttr('hidden');
    $('.mars-moon').removeAttr('hidden');
}

function centerJupiter(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 4;
    $('.planet-btn').prop('hidden', 'hidden');
    $('#btn-jupiter').removeAttr('hidden');
    $('.jupiter-moon').removeAttr('hidden');
}

function centerSaturn(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 5;
    $('.planet-btn').prop('hidden', 'hidden');
    $('#btn-saturn').removeAttr('hidden');
    $('.saturn-moon').removeAttr('hidden');
}

function centerUranus(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 6;
    $('.planet-btn').prop('hidden', 'hidden');
    $('#btn-uranus').removeAttr('hidden');
    $('.uranus-moon').removeAttr('hidden');
}

function centerNeptune(){
    planetSelected = true;
    moonSelected = false;
    selectedPlanetIndex = 7;
    $('.planet-btn').prop('hidden', 'hidden');
    $('#btn-neptune').removeAttr('hidden');
    $('.neptune-moon').removeAttr('hidden');
}

function centerMoon(){
    moonSelected = true;
    planetSelected = false;
    selectedMoonIndex = 0;
    
    controls.target.copy(moons[0].position);
    camera.position.x = moons[0].position.x - 2.5;
    camera.position.z = moons[0].position.z + 0.8;
}

function logPosition(){
    console.log(camera.position);
}

function disableOrbit(){
    var orbitColor = orbits[0].material.color.getHexString();
    
    orbits.forEach(function(orbit) {
        if(orbitColor == "ffffff"){
            orbit.material.color.setHex(0x000000);
        }
        else{
            orbit.material.color.setHex(0xffffff);
        }
    });
}