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

//    ambientLight = new THREE.AmbientLight(0xFFFFFF);
//    scene.add(ambientLight);
    
    controls = new THREE.OrbitControls(camera);
    controls.target.set( 0, 0, 0 );
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
    createTerrestrialPlanet("Mercury", "assets/planets/map/mercury.jpg", "assets/planets/bump/mercurybump.jpg");
    createTerrestrialPlanet("Venus", "assets/planets/map/venus.jpg", "assets/planets/bump/mercurybump.jpg");
    createTerrestrialPlanet("Earth", "assets/planets/map/earth.jpg", "assets/planets/bump/mercurybump.jpg");
    createTerrestrialPlanet("Mars", "assets/planets/map/mars.jpg", "assets/planets/bump/mercurybump.jpg");
    createGasGiant("Jupiter", "assets/planets/map/jupiter.jpg");
    createGasGiant("Saturn", "assets/planets/map/saturn.jpg");
    createGasGiant("Neptune", "assets/planets/map/neptune.jpg");
    createGasGiant("Uranus", "assets/planets/map/uranus.jpg");
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

function createTerrestrialPlanet(name, mapURL, bumpMapURL){
	var material	= new THREE.MeshPhongMaterial({
		map	: THREE.ImageUtils.loadTexture(mapURL),
		bumpMap	: THREE.ImageUtils.loadTexture(bumpMapURL),
		bumpScale: 0.005,
	})
	var planet	= new THREE.Mesh(terrestrialGeometry, material)
    planets.push(planet);
    planet.name = name;
    scene.add(planet);
    positionPlanet(planet);
}

function createGasGiant(name, mapURL){
	var texture	= THREE.ImageUtils.loadTexture(mapURL)
	var material	= new THREE.MeshPhongMaterial({
		map	: texture,
		bumpMap	: texture,
		bumpScale: 0.02,
	})
	var planet	= new THREE.Mesh(gasGiantGeometry, material)
    planets.push(planet);
    planet.name = name;
    scene.add(planet);
    positionPlanet(planet);
}

function animate() {
    requestAnimationFrame(animate);
    
    planets.forEach(function(planet) {
        planet.rotation.y += 0.01;
    });
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene , backgroundCamera );
    renderer.render(scene, camera);
    controls.update();
    //console.log(camera.position);
}

var initialpos = -45;
var initialx = -6;

function positionSun(){
    sun.position.set(0, 0, -50);
    sunlight = new THREE.PointLight( 0xFDB813, 3, 0, 2);
    sunlight.position.copy(sun.position);
    scene.add(sunlight);
}

function positionPlanet(planet){
    if(planet.name == "Mercury"){
        planet.position.set(-6, 0, -50);
    }
    else{
        planet.position.set(initialx, 0, initialpos);
        initialpos += 10;
        initialx += 2;
    }
}

initScene();
initLights();
init();
animate();

function centerSun(){
    camera.position.set(
        0,
        0,
        0
    );
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