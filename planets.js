var planets = [], orbits = [], moons = [];
var sun;
var moonSelected = false;
var planetSelected = false;
var selectedPlanetIndex, selectedMoonIndex;
var scene, camera, renderer;
var controls;
var ambientLight;
var orbitMaterial;
var speedModifier = 1;

var terrestrialGeometry = new THREE.SphereGeometry(1, 32, 32);
var moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var marsMoonGeometry = new THREE.SphereGeometry(0.05, 32, 8);
var sunGeometry = new THREE.SphereGeometry(18, 32, 32);
var gasGiantGeometry = new THREE.SphereGeometry(4, 32, 32);

function initScene(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
    renderer = new THREE.WebGLRenderer();

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
    scene.add(ambientLight);
    
    controls = new THREE.OrbitControls(camera);
//    controls.noPan = true;
//    camera.position.set(0, 0, 10);
//    controls.target.set(0,0,0);
    
    var starSphere	= THREEx.Planets.createStarfield()
	scene.add(starSphere)

//    renderer.gammaInput = true;
//    renderer.gammaOutput = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function initPlanets(){
    createTerrestrialPlanet("Mercury", "assets/planets/map/mercury.jpg", "assets/planets/bump/mercurybump.jpg", 200, 3);
    createTerrestrialPlanet("Venus", "assets/planets/map/venus.jpg", "assets/planets/bump/mercurybump.jpg", 600, 2);
    createTerrestrialPlanet("Earth", "assets/planets/map/earth.jpg", "assets/planets/bump/mercurybump.jpg", 1000, 1);
    createTerrestrialPlanet("Mars", "assets/planets/map/mars.jpg", "assets/planets/bump/mercurybump.jpg", 1400, 0.5);
    createGasGiant("Jupiter", "assets/planets/map/jupiter.jpg", 1800, 0.4);
    createRingedPlanet("Saturn", 2200, 0.2);
    createRingedPlanet("Uranus", 2600, 0.1);
    createGasGiant("Neptune", "assets/planets/map/neptune.jpg", 3000, 0.08);
    
    
    createMoon("Moon", "assets/moons/map/earth/moon.jpg", "assets/moons/bump/earth/moonbump.jpg", 5, 5, 2);
    
    createMoon("Phobos", "assets/moons/map/mars/phobos.jpg", "assets/moons/bump/mars/phobosBump.jpg", 3, 2, 3);
    createMoon("Deimos", "assets/moons/map/mars/deimos.jpg", "assets/moons/bump/mars/deimosBump.jpg", 6, 1, 3);
    
    createMoon("Callisto", "assets/moons/map/jupiter/callisto.jpg", "assets/moons/bump/jupiter/callistoBump.jpg", 35, 1, 4);
    createMoon("Ganymede", "assets/moons/map/jupiter/ganymede.jpg", "assets/moons/bump/jupiter/ganymedeBump.jpg", 29, 2, 4);
    createMoon("Europa", "assets/moons/map/jupiter/europa.jpg", "assets/moons/bump/jupiter/europaBump.jpg", 23, 3, 4);
    createMoon("Io", "assets/moons/map/jupiter/io.jpg", "assets/moons/bump/jupiter/ioBump.jpg", 15, 4, 4);
    
    createMoon("Titan", "assets/moons/map/saturn/titan.jpg", "assets/moons/bump/saturn/titanBump.jpg", 25, 3, 5);
    createMoon("Enceladus", "assets/moons/map/saturn/enceladus.jpg", "assets/moons/bump/saturn/enceladusBump.jpg", 15, 2, 5);
    createMoon("Mimas", "assets/moons/map/saturn/mimas.png", "assets/moons/bump/saturn/mimasBump.png", 10, 2, 5);
    createMoon("Iapetus", "assets/moons/map/saturn/iapetus.jpg", "assets/moons/bump/saturn/iapetusBump.jpg", 45, 1, 5);
    
    createMoon("Miranda", "assets/moons/map/uranus/miranda.jpg", "assets/moons/bump/uranus/mirandaBump.jpg", 10, 1, 6);
    
    createMoon("Triton", "assets/moons/map/neptune/triton.jpg", "assets/moons/bump/neptune/tritonBump.jpg", 10, 1, 7);
    centerEarth();

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
    material.transparent = false
    
    var moon
    if(planetIndex == 3){
        moon = new THREE.Mesh(marsMoonGeometry, material);
    }
    else{
        moon = new THREE.Mesh(moonGeometry, material);
    }
    
    moon.name = name;
    moon.orbit = orbit;
    moon.speed = speed;
    moon.planetIndex = planetIndex;
    moon.castShadow = true;
    moon.receiveShadow = true;
    
    moons.push(moon);
    scene.add(moon);
}

function createTerrestrialPlanet(name, mapURL, bumpMapURL, orbit, speed){
	var material	= new THREE.MeshPhysicalMaterial({
		map	: THREE.ImageUtils.loadTexture(mapURL),
		bumpMap	: THREE.ImageUtils.loadTexture(bumpMapURL),
		bumpScale: 0.005,
	})
    material.transparent = false
	var planet	= new THREE.Mesh(terrestrialGeometry, material);
    
    if(name == "Earth" || name == "Mars"){
        var radians = 23.4 * Math.PI / 180; // tilt in radians
        planet.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( - radians ) );
        var axis = new THREE.Vector3( Math.sin( radians ), Math.cos( radians ), 0 ).normalize();
        planet.axis = axis;
    }
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    planet.castShadow = true;
    planet.receiveShadow = true;
    
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
    material.transparent = false
	var planet	= new THREE.Mesh(gasGiantGeometry, material)
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    planet.castShadow = true;
    planet.receiveShadow = true;
    
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
    
    planet.castShadow = true;
    planet.receiveShadow = true;
    
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

        planet.position.x = Math.sin(timestamp * speed * speedModifier) * orbit;
        planet.position.z = Math.cos(timestamp * speed * speedModifier) * orbit;
           
        if(planet.name == "Earth" || planet.name == "Mars"){
            planet.rotateOnAxis( planet.axis, 0.02 * speedModifier);
        }
        else if(planet.name == "Venus"){
            planet.rotation.y -= 0.01 * speedModifier;
            planet.position.x = Math.cos(timestamp * speed * speedModifier) * orbit;
            planet.position.z = Math.sin(timestamp * speed * speedModifier) * orbit;
        }
        else if(planet.name == "Uranus"){
            planet.rotation.z += 0.01 * speedModifier;
            planet.position.x = Math.cos(timestamp * speed * speedModifier) * orbit;
            planet.position.z = Math.sin(timestamp * speed * speedModifier) * orbit;
        }
        else{
            planet.rotation.y += 0.03 * speedModifier;
        }
    });
    
    moons.forEach(function(moon) {
        moon.position.x = Math.sin(timestamp * moon.speed * speedModifier) * moon.orbit + planets[moon.planetIndex].position.x;
        moon.position.z = Math.cos(timestamp * moon.speed * speedModifier) * moon.orbit + planets[moon.planetIndex].position.z;
        moon.rotation.y += 0.01 * speedModifier;
    });
                  
    if(planetSelected == true){
        controls.target.copy(planets[selectedPlanetIndex].position);
        camera.position.x = planets[selectedPlanetIndex].position.x - 3;
        camera.position.z = planets[selectedPlanetIndex].position.z + 0.5;
        controls.update();
    }
    if(moonSelected == true){
        console.log(moons[selectedMoonIndex].name);
        controls.target.copy(moons[selectedMoonIndex].position);
        camera.position.x = moons[selectedMoonIndex].position.x - 2.5;
        camera.position.z = moons[selectedMoonIndex].position.z + 0.5;
    }
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.render(scene, camera);
    controls.update();
}

function positionSun(){
    sun.position.set(0, 0, 0);
    sunlight = new THREE.PointLight( 0xffda80, 2, 0, 2);  
    sunlight.position.copy(sun.position);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(4096,4096);
    sunlight.shadow.radius = 1.75;
    sunlight.shadow.camera.far = 99999;
    scene.add(sunlight);
    console.log("Sun position: ")
    console.log(sun.position);
}

initScene();
createSun();
initPlanets();
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

$("document").ready(function(){
    $(document).on("click", ".moon-btn", function(){
        var moonIndex = $(this).attr("data-moonIndex");
        moonSelected = true;
        planetSelected = false;
        selectedMoonIndex = moonIndex;
            
        controls.target.copy(moons[selectedMoonIndex].position);
        camera.position.x = moons[selectedMoonIndex].position.x - 2.5;
        camera.position.z = moons[selectedMoonIndex].position.z + 0.8;            
    });
});

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

function normalSpeed(){
    speedModifier = 1;
}

function fastForward(){
    speedModifier = 5;
}