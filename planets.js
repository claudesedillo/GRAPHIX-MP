var planets = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 10000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 0);

var terrestrialGeometry = new THREE.SphereGeometry(0.5, 32, 16);
var sunGeometry = new THREE.SphereGeometry(3, 32, 16);
var gasGiantGeometry = new THREE.SphereGeometry(1, 32, 16);

createPlanet("Sun", 0xefff31, sunGeometry);
createPlanet("Mercury", 0xc47f2e, terrestrialGeometry);
createPlanet("Venus", 0x9c31bc, terrestrialGeometry);
createPlanet("Earth", 0x4069f2, terrestrialGeometry);
createPlanet("Mars", 0xa05c18, terrestrialGeometry);
createPlanet("Jupiter", 0xaf7b3e, gasGiantGeometry);
createPlanet("Saturn", 0xf8f021, gasGiantGeometry);
createPlanet("Neptune", 0x2129ef, gasGiantGeometry);
createPlanet("Uranus", 0x31ffff, gasGiantGeometry);

function createPlanet(name, color, geometry){
    var material = new THREE.MeshBasicMaterial( { color: color } );
    planet = new THREE.Mesh( geometry, material );
    planets.push(planet);
    scene.add(planet);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    console.log(camera.position);
}

function positionPlanets(){
    planets[0].position.set(0, 0, -50);
    console.log(planets[0].name + " position: ");
    console.log(planets[0].position);
    
    var initialpos = -45;
    var initialx = -6;
    
    for(var i = 1; i < 9; i++){
        planets[i].position.set(initialx, 0, initialpos);
        console.log("position: ");
        console.log(planets[i].position); 
        initialpos += 5;
        initialx += 2;
    }

}

animate();
positionPlanets();