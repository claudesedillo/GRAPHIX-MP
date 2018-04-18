var planets = [], orbits = [], moons = [];
var sun;
var moonSelected = false;
var planetSelected = false;
var selectedPlanetIndex, selectedMoonIndex;
var scene, camera, renderer;
var controls;
var ambientLight;
var orbitMaterial;

var terrestrialGeometry = new THREE.SphereGeometry(1, 32, 32);
var moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var sunGeometry = new THREE.SphereGeometry(18, 32, 32);

initScene();
createSun();
initPlanets();
animate();

function initScene(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
    renderer = new THREE.WebGLRenderer();

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.01);
    scene.add(ambientLight);
    
    controls = new THREE.OrbitControls(camera);

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function initPlanets(){
    createTerrestrialPlanet("Earth", "assets/planets/map/earth.jpg", "assets/planets/bump/mercurybump.jpg", 200, 1);  
    createMoon("Moon", "assets/moons/map/earth/moon.jpg", "assets/moons/bump/earth/moonbump.jpg", 5, 3, 0);
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

function positionSun(){
    sun.position.set(0, 0, 0);
    sunlight = new THREE.PointLight( 0xFDB813, 2, 5000, 2);  
    sunlight.position.copy(sun.position);
        
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    
    scene.add(sunlight);
    console.log("Sun position: ")
    console.log(sun.position);
}

function createMoon(name, mapURL, bumpMapURL, orbit, speed, planetIndex){
    var material	= new THREE.MeshPhysicalMaterial( { color: 0xffffff } );
    material.transparent = false
    
    var moon = new THREE.Mesh(moonGeometry, material);
    
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
	var material	= new THREE.MeshPhysicalMaterial( { color: 0xffffff } );
    material.transparent = false
	var planet	= new THREE.Mesh(terrestrialGeometry, material);
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    planet.castShadow = true;
    planet.receiveShadow = true;
    
    planets.push(planet);
    
    scene.add(planet); 
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
        planet.rotation.y += 0.01;
        }
    );
    
    moons.forEach(function(moon) {
        moon.position.x = Math.sin(timestamp * moon.speed) * moon.orbit + planets[moon.planetIndex].position.x;
        moon.position.z = Math.cos(timestamp * moon.speed) * moon.orbit + planets[moon.planetIndex].position.z;
        moon.rotation.y += 0.01;
    });
                  
    if(planetSelected == true){
        controls.target.copy(planets[selectedPlanetIndex].position);
        camera.position.x = planets[selectedPlanetIndex].position.x - 3;
        camera.position.z = planets[selectedPlanetIndex].position.z + 3;
        controls.update();
    }
    if(moonSelected == true){
        controls.target.copy(moons[selectedMoonIndex].position);
        camera.position.x = moons[selectedMoonIndex].position.x - 2.5;
        camera.position.z = moons[selectedMoonIndex].position.z + 0.8;
    }
    renderer.shadowMap.renderReverseSided = false;
    renderer.shadowMap.enabled = true;             
    renderer.render(scene, camera);
    controls.update();
}

function centerSun(){
    controls.target.copy(sun.position);
    planetSelected = false;
    moonSelected = false;
}

function centerMoon(){
    console.log("centerMoon clicked!");
    moonSelected = true;
    planetSelected = false;
    selectedMoonIndex = 0;
    console.log("Selected moon index " + selectedMoonIndex)
    controls.target.copy(moons[0].position);
    camera.position.x = moons[0].position.x - 2.5;
    camera.position.z = moons[0].position.z + 0.8;
}

function centerEarth(){
    planetSelected = true;
    moonSelected = false;
    
    selectedPlanetIndex = 0;
}