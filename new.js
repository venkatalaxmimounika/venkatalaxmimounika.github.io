import {scene} from './scene.js'

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

let xExtent
let yExtent

let xAxis
let yAxis

let svg
const particleColors = d3
        .scaleSequential(d3.interpolateRgb('maroon', 'midnightblue'))
        //.domain(d3.extent(data.map(d => d.concentration)));
        .domain([0, 30].reverse())

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
    geometry = new THREE.Geometry();
	const vertices = [];
    const colors = []

    const myColor = d3
        .scaleSequential().interpolator(d3.interpolateViridis)
        .domain([0,50])

        let particlePos

        for (const particle of data) {
            particlePos = new THREE.Vector3(particle.X, particle.Z, particle.Y)
            particles.vertices.push(particlePos)
            let particleColor = new THREE.Color(
                particleColors(particle.concentration)
            )
            particles.colors.push(particleColor)
        }

        particles = new THREE.Points(particles, pMaterial)

        scene.add(particles)
        
        // particles.translateZ(3)
       // scene.add(particles);
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
        
        let xExtent = d3.extent(data.map((d) => d.X))
        let yExtent = d3.extent(data.map((d) => d.Y))

        let xAxis = d3.scaleLinear().domain(xExtent).range([0, width])
        let yAxis = d3.scaleLinear().domain(yExtent).range([height, 0])
        console.log('xAixswidth')
        console.log(width)
        console.log('yAixsheight')
        console.log(height)

        const myColor = d3.scaleSequential().interpolator(d3.interpolateViridis).domain([0,50])

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
        return myColor(d.concentration)
        });

        svg.append("g") .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xAxis))
        svg.append("g").call(d3.axisLeft(yAxis))
        svg.node();
}

const drawRectanglePlane = function () {
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
        
        updateForBrush(parseInt(value))
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

// legend
// var linear = d3.scaleLinear()
//   .domain([-10,0])
//   .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

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



const updateForBrush = function(zValue){
    console.log(particles.geometry.vertices)
    const myColor = d3.scaleSequential().interpolator(d3.interpolateViridis).domain([0,50])
    const bwScale = d3.scaleSequential(d3.interpolateGreys).domain([0, 30])
    particles.geometry.attributes.color.needsUpdate = true
    var newColors = []
    for (let i = 0; i < data.length; i++) {
        // newColors = []
        if (data[i].Z >= (zValue - 0.5) && data[i].Z <= (zValue + 0.5)) {
            var newColor = new THREE.Color(myColor(data[i].concentration))
                newColors.push(newColor.r)
                newColors.push(newColor.g)
                newColors.push(newColor.b)
                // geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(newColors),3));
        }
        else{
            var newColor = new THREE.Color(0xeeeeee)
            newColors.push(newColor.r)
            newColors.push(newColor.g)
            newColors.push(newColor.b)
            // geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(newColors),3));
        }
        
    }
    geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(newColors),3));
    var pobject = scene.getObjectByName( "points" );
    scene.remove(pobject)
    points = new THREE.Points( geometry, material );
    scene.add(points)
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

        xExtent = d3.extent(data.map((d) => d.X))
        yExtent = d3.extent(data.map((d) => d.Z))

        createParticleSystem(data)
        scatterPlot(0)

        drawRectanglePlane()

        const valueOutput = document.getElementById('zValue')
        valueOutput.innerHTML = 0

    })


};


loadData('./058.csv');