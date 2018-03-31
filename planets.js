var planets = [];
var planetNames = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 10000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var terrestrialGeometry = new THREE.SphereGeometry(0.5, 32, 16);
var sunGeometry = new THREE.SphereGeometry(3, 32, 16);
var gasGiantGeometry = new THREE.SphereGeometry(1, 32, 16);

function init(){
    console.log("I am at init");
    createPlanet("Sun", 0xefff31, sunGeometry, "assets/planets/sun.jpg");
    createPlanet("Mercury", 0xc47f2e, terrestrialGeometry, "assets/planets/mercury.jpg");
    createPlanet("Venus", 0x9c31bc, terrestrialGeometry, "assets/planets/venus.jpg");
    createPlanet("Earth", 0x4069f2, terrestrialGeometry, "assets/planets/earth.jpg");
    createPlanet("Mars", 0xa05c18, terrestrialGeometry, "assets/planets/mars.jpg");
    createPlanet("Jupiter", 0xaf7b3e, gasGiantGeometry, "assets/planets/jupiter.jpg");
    createPlanet("Saturn", 0xf8f021, gasGiantGeometry, "assets/planets/saturn.jpg");
    createPlanet("Neptune", 0x2129ef, gasGiantGeometry, "assets/planets/neptune.jpg");
    createPlanet("Uranus", 0x31ffff, gasGiantGeometry, "assets/planets/uranus.jpg");
}

function createPlanet(name, color, geometry, filePath){
    console.log("I am at createPlanet");
    var loader = new THREE.TextureLoader();
    loader.load(
        filePath,
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            material = new THREE.MeshBasicMaterial( {
                map: texture
             } );
            console.log("I am creating the mesh for " + name);
            var planet = new THREE.Mesh( geometry, material );
            planets.push(planet);
            planetNames.push(name);
            scene.add(planet);
            console.log(name + " position: ");
            console.log(planet.position);
            positionPlanet(planet, name);
        },

        undefined,
        function ( err ) {
            console.error( 'An error happened.' );
        }
    );
//    var material = new THREE.MeshBasicMaterial( { color: color } );
//    planet = new THREE.Mesh( geometry, material );
//    planets.push(planet);
//    planetNames.push(name);
//    scene.add(planet);
    console.log("createPlanet complete!");
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    planets.forEach(function(planet) {
        planet.rotation.y += 0.01;
    });
}

var initialpos = -45;
var initialx = -6;

function positionPlanet(planet, name){
    if(name == "Sun"){
        planet.position.set(0, 0, -50);
    }
    else{
        console.log("Planet name: " + name);
        planet.position.set(initialx, 0, initialpos);
        console.log("position: ");
        console.log(planet.position); 
        initialpos += 5;
        initialx += 2;
    }
    console.log(name + " position: ");
    console.log(planet.position);
}

init();
animate();

function centerSun(){
    console.log("Hello! 1");
    camera.position.set(
        0,
        0,
        0
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerMercury(){
    console.log("Hello! 2");
    camera.position.set(
        planets[1].position.x,
        planets[1].position.y,
        planets[1].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerVenus(){
    console.log("Hello! 2");
    camera.position.set(
        planets[2].position.x,
        planets[2].position.y,
        planets[2].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerEarth(){
    console.log("Hello! 2");
    camera.position.set(
        planets[3].position.x,
        planets[3].position.y,
        planets[3].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerMars(){
    console.log("Hello! 3");
    camera.position.set(
        planets[4].position.x,
        planets[4].position.y,
        planets[4].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerJupiter(){
    console.log("Hello! 2");
    camera.position.set(
        planets[5].position.x,
        planets[5].position.y,
        planets[5].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerSaturn(){
    console.log("Hello! 4");
    camera.position.set(
        planets[6].position.x,
        planets[6].position.y,
        planets[6].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerUranus(){
    console.log("Hello! 2");
    camera.position.set(
        planets[7].position.x,
        planets[7].position.y,
        planets[7].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}

function centerNeptune(){
    console.log("Hello! 5");
    camera.position.set(
        planets[8].position.x,
        planets[8].position.y,
        planets[8].position.z +2
    );
    console.log("Camera position: ");
    console.log(camera.position);
}