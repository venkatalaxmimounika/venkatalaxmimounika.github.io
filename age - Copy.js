loadVisualizations = async () => {

    let usData = await d3.json("https://unpkg.com/us-atlas@3/counties-10m.json");
    let GunDeaths = await d3.csv("freq.csv");
    let stateAverageAge = await d3.csv("freq_avg_age.csv")
    let svg = d3.select("#map");
    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath(projection);
    let state = topojson.feature(usData, usData.objects.states);
    totalDeaths =[];
    GunDeaths.forEach((data) => totalDeaths.push(parseInt(data.males) + parseInt(data.females)));
    spikeScale = d3.scaleLinear().domain(d3.extent(totalDeaths)).range([1, 50]);
       
    let ageColorScale = d3
    .scaleLinear()
    .interpolate(() => d3.interpolateGreens)
    .domain([26, 46]);
  
    let shootingBarTip = d3
    .tip()
    .html(function (d) {
        return `
        <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>City:</strong> 
        ${d.city_state}</span><br/>
        <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Male:</strong> 
            ${d.age}
            </span>
            `
    })
          let stateColored = svg.append("g");
  
  
          stateColored
            .selectAll("path")
            .data(state.features)
            .join("path")
            .attr("d", (f) => path(f))
            .attr("stroke", "grey")
            .attr("fill", (d) => {
                // console.log(d);
                const state = stateAverageAge.filter((s) => {
                  // console.log(d.properties.name === s.state_name);
                  return s.state_name == d.properties.name;
                });
                if (state.length > 0) {
                  return ageColorScale(state[0].age);
                }
                return "none";
              })
              .attr("stroke-width", 2)
              .attr("id", (d) => `state${d.id}`)
            .attr("stroke-width", 2)
            .attr("id", (d) => `state${d.id}`);
        
            var zoom = d3
                .zoom()
                .scaleExtent([1, 8])
                .on('zoom', function () {
        
                  stateColored.attr('transform', d3.event.transform)
                    spikeGroup.attr('transform', d3.event.transform)
        
        
                })
                let legendGroup = svg
                .append("g")
                .attr("class", "legendThreshold")
                .attr("transform", "translate(800,440)");
              legendGroup
                .append("text")
                .attr("class", "caption")
                .attr("x", 0)
                .attr("y", -6)
                .style("font-size", "20px")
                
                .text("Average age of deaths per state");
              var labels = ["20", "30", "34", "38", "42", "50"];
              var legend = d3
                .legendColor()
                .labels(function (d) {
                  return labels[d.i];
                })
                .shapePadding(0)
                .orient("horizontal")
                .shapeWidth(40)
                .scale(ageColorScale);
              svg.select(".legendThreshold").call(legend);
        
          svg.call(zoom)
          svg.call(shootingBarTip)

      
  };
  
  window.onload = () => {
    loadVisualizations();
  };