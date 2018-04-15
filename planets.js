var planets = [];
var sun;

var scene, camera, renderer, backgroundScene, backgroundCamera;
var controls;
var ambientLight;

function initScene(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
    renderer = new THREE.WebGLRenderer();
    
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.Camera();

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.001);
    scene.add(ambientLight);
    
    controls = new THREE.OrbitControls(camera);
    camera.position.set(0, 0, 10);
    controls.update();
    
    texture = THREE.ImageUtils.loadTexture( 'assets/backgrounds/galaxy_starfield.png' );
    backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        new THREE.MeshBasicMaterial({
            map: texture
        }));
    backgroundMesh .material.depthTest = false;
    backgroundMesh .material.depthWrite = false;
    
    backgroundScene .add(backgroundCamera );
    backgroundScene .add(backgroundMesh );

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
    createSaturn();
//    createGasGiant("Saturn", "assets/planets/map/saturn.jpg", 260, 0.2);
    createGasGiant("Uranus", "assets/planets/map/uranus.jpg", 300, 0.1);
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
	var planet	= new THREE.Mesh(terrestrialGeometry, material)
    planets.push(planet);
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    
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
    planets.push(planet);
    
    planet.name = name;
    planet.orbit = orbit;
    planet.speed = speed;
    260, 0.2
    createOrbit(orbit);
    scene.add(planet);
}

function createSaturn(){
    var planet	= THREEx.Planets.createSaturn()
	planet.receiveShadow	= true
	planet.castShadow		= true
	var ring	= THREEx.Planets.createSaturnRing()
	ring.receiveShadow	= true
	ring.castShadow		= true
	planet.add(ring)
    
    planet.name = "Saturn";
    planet.orbit = 260;
    planet.speed = 0.2;
    
    createOrbit(260);
    planets.push(planet)
    scene.add(planet);
}
function createRing(planet){
    console.log("I am at createring");
    var ring	= THREEx.Planets.createSaturnRing();
    ring.receiveShadow	= true;
	ring.castShadow		= true;
	planet.add(ring);
}

function createOrbit(orbit){
    //orbit
    var shape = new THREE.Shape();
    shape.moveTo(orbit, 0);
    shape.absarc(0, 0, orbit, 0, 2 * Math.PI, false);
    var spacedPoints = shape.createSpacedPointsGeometry(128);
    spacedPoints.rotateX(THREE.Math.degToRad(-90));
    var orbit = new THREE.Line(spacedPoints, new THREE.LineBasicMaterial({
      color: "white"
    }));
    scene.add(orbit);
}
function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.01
    
    planets.forEach(function(planet) {
        timestamp = Date.now() * 0.0001;
        var orbit = planet.orbit;
        var speed = planet.speed;
//        planet.position.x = Math.sin(timestamp * speed) * orbit;
//        planet.position.z = Math.cos(timestamp * speed) * orbit;
        planet.position.x = orbit;
        planet.position.z = orbit;
        if(planet.name == "Venus"){
            planet.rotation.y -= 0.01;
//            planet.position.x = Math.cos(timestamp * speed) * orbit;
//            planet.position.z = Math.sin(timestamp * speed) * orbit;
        }
        else if(planet.name == "Uranus"){
            planet.rotation.x += 0.01;
//            planet.position.x = Math.cos(timestamp * speed) * orbit;
//            planet.position.z = Math.sin(timestamp * speed) * orbit;
        }
        else{
            planet.rotation.y += 0.01;
        }
    });
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene , backgroundCamera );
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

function centerSun(){
    camera.lookAt(sun);
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerMercury(){
    camera.position.set(
        planets[0].position.x,
        planets[0].position.y,
        planets[0].position.z -2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerVenus(){
    camera.position.set(
        planets[1].position.x,
        planets[1].position.y,
        planets[1].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerEarth(){
    camera.position.set(
        planets[2].position.x,
        planets[2].position.y,
        planets[2].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerMars(){
    camera.position.set(
        planets[3].position.x,
        planets[3].position.y,
        planets[3].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerJupiter(){
    camera.position.set(
        planets[4].position.x,
        planets[4].position.y,
        planets[4].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerSaturn(){
    camera.position.set(
        planets[5].position.x,
        planets[5].position.y,
        planets[5].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerUranus(){
    camera.position.set(
        planets[6].position.x,
        planets[6].position.y,
        planets[7].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerNeptune(){
    camera.position.set(
        planets[7].position.x,
        planets[7].position.y,
        planets[7].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}