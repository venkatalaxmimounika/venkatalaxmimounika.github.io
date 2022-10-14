import {scene} from './scene.js'
import * as THREE from './three.js'

/* Get or create the application global variable */
var data = [];

// bounds of the data
const ranges = {};
const margin = { top: 10, right: 30, bottom: 30, left: 30 },
width = 600 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom

//const sceneObject = new THREE.Group()
let plane
let geometry
let particles
let material
let points

let xAxis
let yAxis

let svg


// create the containment box.
// This cylinder is only to guide development.
// TODO: Remove after the data has been rendered
const createCylinder = () => {
    // get the radius and height based on the data bounds
    const radius = (ranges.maxX - ranges.minX) / 2.0 + 1;
    const height = (ranges.maxY - ranges.minY) + 1;

    // create a cylinder to contain the particle system
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const cylinder = new THREE.Mesh(geometry, material);

    // add the containment to the scene
    scene.add(cylinder);
};

// creates the particle system
const createParticleSystem = (data) => {
    // draw your particle system here!
    geometry = new THREE.BufferGeometry();
	const vertices = [];
    const colors = []

    const colorscale = d3
        .scaleSequential().interpolator(d3.interpolateViridis)
        .domain([0,50])

        data.forEach(d => {
          vertices.push(d.X, d.Z, d.Y);
          let particleColor = new THREE.Color(
            colorscale(d.concentration)
        )
        colors.push(particleColor.r,particleColor.g, particleColor.b)
        });
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(colors),3));
        geometry.rotateX(-Math.PI * 0.5);
        console.log(geometry.attributes.color.array[1])
        const material = new THREE.PointsMaterial( 
            { size: 0.1, 
              vertexColors: true,
              blending: THREE.AdditiveBlending,
              sizeAttenuation: false,
              opacity : 0.7, 
              transparent: true } );
        particles = new THREE.Points( geometry, material );
        
        // particles.translateZ(3)
        scene.add(particles);
        console.log('1111111111')
        console.log(particles.geometry)
          
  
};


const scatterPlot = function (zValue) {
    console.log('scatwidth')
       console.log(width + margin.left + margin.right)
       console.log('scatheight')
       console.log(height + margin.top + margin.bottom)
    const svg = d3.select('#d3_scatter')
    .append('svg')
      .attr('width', width + margin.left + margin.right+100)
      .attr('height', height + margin.top + margin.bottom+100)
      
      .append('g')
      .attr('transform', `translate(${margin.left}, 60)`);
        const d3Data = data.filter(
            (d) => d.Z <= zValue + 0.01 && d.Z >= zValue - 0.01
        )
        
        
        let xAxis = d3.scaleLinear().domain(d3.extent(data.map((d) => d.X))).range([0, width])
        let yAxis = d3.scaleLinear().domain(d3.extent(data.map((d) => d.Y))).range([height, 0])
        console.log('xAixswidth')
        console.log(width)
        console.log('yAixsheight')
        console.log(height)

        const colorscale = d3.scaleSequential().interpolator(d3.interpolateViridis).domain([0,50])

        d3.selectAll('circle').remove()
        
        svg.append("g")
        .selectAll("circle")
        .data(d3Data)
        .join("circle")
        .attr("cx",(d) => {
        return xAxis(d.X)
        })
        .attr("cy",(d) => {
        return yAxis(d.Y)
        })
        .attr("r",3)
        .attr("fill",(d) => {
        return colorscale(d.concentration)
        });

        svg.append("g") .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xAxis))
        svg.append("g").call(d3.axisLeft(yAxis))
        svg.node();
}

const Rectangle = function () {
    const slider = document.getElementById('zSlider')
    const valueOutput = document.getElementById('zValue')
    const sliderRange = d3.scaleLinear().domain([1, 100]).range([-10,0])

    slider.onchange = function (e) {
        //const value = sliderRange(this.value).toFixed(2)
        const value = Number(slider.value)
        console.log(value)
        console.log('9999999999999')
        valueOutput.innerHTML = value
        plane.position.z = -value
        scatterPlot(parseInt(value))
        
        Brush(parseInt(value))
        requestAnimationFrame(function (){
            renderer.render(scene, camera);
        })
    }

    const width = ranges.maxX - ranges.minX + 1
    const height = ranges.maxY - ranges.minY + 1
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
    })
    const geometry = new THREE.PlaneGeometry(width, height)
    plane = new THREE.Mesh(geometry, material)
    plane.translateZ(-10)
    scene.add(plane)
}


var linear = d3.scaleSequential().interpolator(d3.interpolateViridis).domain([0,500])

var svg1 = d3.select("svg");

svg1.append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(20,560)");

var legendLinear = d3.legendColor()
  .shapeWidth(50)
  .cells([0,50,100,150,200,250,500])
  .orient('horizontal')
  .scale(linear);

svg1.select(".legendLinear")
  .call(legendLinear);



const Brush = function(zValue){
    console.log(particles.geometry.vertices)
    particles.geometry.attributes.color.needsUpdate = true
    var newColors = []
    for (let i = 0; i < data.length; i++) {
        // newColors = []
        if (data[i].Z >= (zValue - 0.5) && data[i].Z <= (zValue + 0.5)) {
            var newColor = new THREE.Color(d3.scaleSequential().interpolator(d3.interpolateViridis).domain([0,50])(data[i].concentration))
                newColors.push(newColor.r)
                newColors.push(newColor.g)
                newColors.push(newColor.b)
                
        }
        else{
            var newColor = new THREE.Color(0xeeeeee)
            newColors.push(newColor.r)
            newColors.push(newColor.g)
            newColors.push(newColor.b)
           
        }
        
    }
    geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(newColors),3));
    var newobject = scene.getObjectByName( "points" );
    scene.remove(newobject)
    newpoints = new THREE.Points( geometry, material );
    scene.add(newpoints)
}

const loadData = (file) => {

    
    // read the csv file
    d3.csv(file).then(function (fileData)
    // iterate over the rows of the csv file
    {
        fileData.forEach(d => {
            // get the min bounds
            ranges.minX = Math.min(ranges.minX || Infinity, d.Points0);
            ranges.minY = Math.min(ranges.minY || Infinity, d.Points1);
            ranges.minZ = Math.min(ranges.minZ || Infinity, d.Points2);

            // get the max bounds
            ranges.maxX = Math.max(ranges.maxX || -Infinity, d.Points0);
            ranges.maxY = Math.max(ranges.maxY || -Infinity, d.Points1);
            ranges.maxZ = Math.max(ranges.maxY || -Infinity, d.Points2);

            // add the element to the data collection
            data.push({
                // concentration density
                concentration: Number(d.concentration),
                // Position
                X: Number(d.Points0),
                Y: Number(d.Points1),
                Z: Number(d.Points2),
                // Velocity
                U: Number(d.velocity0),
                V: Number(d.velocity1),
                W: Number(d.velocity2)
            })
        });

        var xExtent = d3.extent(data.map((d) => d.X))
        var yExtent = d3.extent(data.map((d) => d.Z))

        createParticleSystem(data)
        scatterPlot(0)

        Rectangle()

        const valueOutput = document.getElementById('zValue')
        valueOutput.innerHTML = 0

    })


};


loadData('./058.csv');