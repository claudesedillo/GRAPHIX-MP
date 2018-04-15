var planets = [], orbits = [];
var sun;

var planetSelected = false;
var selectedPlanetIndex;
var scene, camera, renderer, backgroundScene, backgroundCamera;
var controls;
var ambientLight;
var orbitMaterial;

function initScene(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
    renderer = new THREE.WebGLRenderer();
    
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.Camera();

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.001);
    scene.add(ambientLight);
    
    controls = new THREE.OrbitControls(camera);
    controls.noPan = true;
    camera.position.set(0, 0, 10);
    controls.target.set(0,0,0);
    
    var starSphere	= THREEx.Planets.createStarfield()
	scene.add(starSphere)

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

var terrestrialGeometry = new THREE.SphereGeometry(0.5, 32, 32);
var sunGeometry = new THREE.SphereGeometry(3, 32, 32);
var gasGiantGeometry = new THREE.SphereGeometry(1, 32, 32);

function initLights(){
    createSun();
}

function init(){
    createTerrestrialPlanet("Mercury", "assets/planets/map/mercury.jpg", "assets/planets/bump/mercurybump.jpg", 40, 3);
    createTerrestrialPlanet("Venus", "assets/planets/map/venus.jpg", "assets/planets/bump/mercurybump.jpg", 80, 2);
    createTerrestrialPlanet("Earth", "assets/planets/map/earth.jpg", "assets/planets/bump/mercurybump.jpg", 120, 1);
    createTerrestrialPlanet("Mars", "assets/planets/map/mars.jpg", "assets/planets/bump/mercurybump.jpg", 160, 0.5);
    createGasGiant("Jupiter", "assets/planets/map/jupiter.jpg", 220, 0.4);
    createRingedPlanet("Saturn", 260, 0.2);
    createRingedPlanet("Uranus", 300, 0.1);
    createGasGiant("Neptune", "assets/planets/map/neptune.jpg", 350, 0.08);

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

function createTerrestrialPlanet(name, mapURL, bumpMapURL, orbit, speed){
	var material	= new THREE.MeshPhongMaterial({
		map	: THREE.ImageUtils.loadTexture(mapURL),
		bumpMap	: THREE.ImageUtils.loadTexture(bumpMapURL),
		bumpScale: 0.005,
	})
	var planet	= new THREE.Mesh(terrestrialGeometry, material);
    if(name == "Earth"){
        planet.lookAt(0, 23.5, 0);
    }
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    
    planets.push(planet);
    createOrbit(orbit);
    scene.add(planet);
}

function createGasGiant(name, mapURL, orbit, speed){
	var texture	= THREE.ImageUtils.loadTexture(mapURL)
	var material	= new THREE.MeshPhongMaterial({
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
       planet.add(ring)
    }
    else{
        var planet	= THREEx.Planets.createUranus()
        planet.receiveShadow	= true
        planet.castShadow		= true
        var ring	= THREEx.Planets.createUranusRing()
        ring.receiveShadow	= true
        ring.castShadow		= true
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
    shape.absarc(0, 0, orbit, 0, 2 * Math.PI, false);
    var spacedPoints = shape.createSpacedPointsGeometry(128);
    spacedPoints.rotateX(THREE.Math.degToRad(-90));
    orbitMaterial = new THREE.LineBasicMaterial( {
        color: "white",
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
        
        planet.position.x = Math.sin(timestamp * speed) * orbit;
        planet.position.z = Math.cos(timestamp * speed) * orbit;
//        planet.position.x = orbit;
//        planet.position.z = orbit;
        
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
        camera.position.x = planets[selectedPlanetIndex].position.x - 2.5;
        camera.position.z = planets[selectedPlanetIndex].position.z + 0.8;
        controls.update();
    }
    else{
        controls.target.copy(sun.position);
    }
    
    renderer.render(scene, camera);
    controls.update();
    //console.log(camera.position);
}

var initialz = 10;
var initialx = 10;

function positionSun(){
    sun.position.set(0, 0, 0);
    sunlight = new THREE.PointLight( 0xFDB813, 3, 0, 2);
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

function centerSun(){
    controls.target.copy(sun.position);
    camera.position.x = planets[0].position.x - 2.5;
    camera.position.z = planets[0].position.z + 0.8;
    planetSelected = false;
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerMercury(){
    planetSelected = true;
    selectedPlanetIndex = 0;
}

function centerVenus(){
    planetSelected = true;
    selectedPlanetIndex = 1;
}

function centerEarth(){
    planetSelected = true;
    selectedPlanetIndex = 2;
}

function centerMars(){
    planetSelected = true;
    selectedPlanetIndex = 3;
}

function centerJupiter(){
    planetSelected = true;
    selectedPlanetIndex = 4;
}

function centerSaturn(){
    planetSelected = true;
    selectedPlanetIndex = 5;
}

function centerUranus(){
    planetSelected = true;
    selectedPlanetIndex = 6;
}

function centerNeptune(){
    planetSelected = true;
    selectedPlanetIndex = 7;
}

function logPosition(){
    planetSelected = true;
    selectedPlanetIndex = 8;
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