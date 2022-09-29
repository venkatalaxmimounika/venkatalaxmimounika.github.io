
    spikes = async () => {

        d3.selectAll('g').remove();
        d3.selectAll('rect').remove();
        d3.selectAll('text').remove();
        let usData = await d3.json("https://unpkg.com/us-atlas@3/counties-10m.json");
        let GunDeaths = await d3.csv("freq.csv");
      
        let svg = d3.select("#map");
        let projection = d3.geoAlbersUsa();
        let path = d3.geoPath(projection);
        let state = topojson.feature(usData, usData.objects.states);
        totalDeaths =[];
        GunDeaths.forEach((data) => totalDeaths.push(parseInt(data.males) + parseInt(data.females)));
        spikeScale = d3.scaleLinear().domain(d3.extent(totalDeaths)).range([1, 50]);
        let ageColorScale = d3
          .scaleLinear()
          .interpolate(() => d3.interpolateOranges)
          .domain([26, 46]);
        spike = (length, width = 7) =>
        `M${-width / 2},0L0,${-length*2}L${width / 2},0`
        const legend = svg
      .append('g')
      .attr('fill', '#777')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('g')
      .data(spikeScale.ticks(4).reverse())
      .join('g')
      .attr('transform', (d, i) => `translate(${900 - (i + 1) * 18},500)`)

  legend
      .append('path')
      .attr('fill', 'red')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#67001f')
      .attr('d', (d) => spike(spikeScale(d)))


      LegendText = svg.append("text")
                  .attr("x","819")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("8k")
      LegendText = svg.append("text")
                  .attr("x","840")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("16k")
     LegendText = svg.append("text")
                  .attr("x","860")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("24k")
     LegendText = svg.append("text")
                  .attr("x","880")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("38k")
      
        let shootingBarTip = d3
              .tip()
              .html(function (d) {
                  return `
                  <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>City:</strong> 
                  ${d.city_state}</span><br/>
                  <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Total:</strong> 
                      ${d.males+d.females}
                      </span><br/>
                      
                      `
              })
      
              let stateColored = svg.append("g");
      
      
              stateColored
                .selectAll("path")
                .data(state.features)
                .join("path")
                .attr("d", (f) => path(f))
                .attr("stroke", "grey")
                .attr("fill", "#e7e1ef")
                .attr("stroke-width", 2)
                .attr("id", (d) => `state${d.id}`);
            
                var zoom = d3
                    .zoom()
                    .scaleExtent([1, 8])
                    .on('zoom', function () {
            
                      stateColored.attr('transform', d3.event.transform)
                        spikeGroup.attr('transform', d3.event.transform)
            
            
                    })
            
            
              svg.call(zoom)
              svg.call(shootingBarTip)
      
          // add a legend for SVG Icons
      
          spikeTip = d3
              .tip()
              .attr('class', 'd3-tip')
              .html(function (d) {
                  return `<strong>City:</strong> <span style='color:red'>
                  
                  </span><br/>
                  <strong>Total Deaths:</strong> <span style='color:red'>
                      ${parseInt(d.males) + parseInt(d.females)}
                      </span><br/>
                      <strong>Male Deaths:</strong> <span style='color:red; margin-top: 5px'>
                      ${d.males}
                      </span><br/>
                      <strong>Female Deaths:</strong> <span style='color:red; margin-top: 5px'>
                      ${d.females}
                      </span>
                      `
              })
      
          let  spikeGroup = svg.append('g');
          spikeGroup
              .attr('fill', 'red')
              .selectAll('path')
              .data(GunDeaths)
              .join('path')
              .attr('stroke',(d) => {
                  if((parseInt(d.males) + parseInt( d.females)) > 2){
                    return "#67001f"
                  }
                  else if((parseInt(d.males) + parseInt( d.females)) == 1){
                    return "#ce1256"
                  }
                  else{
                    return "#df65b0"
                  }
                } )
              .attr('fill-opacity', (d) => {
                  if((parseInt(d.males) + parseInt( d.females)) > 2){
                    return 0.5
                  }
                  else if((parseInt(d.males) + parseInt( d.females)) == 1){
                    return 0.3
                  }
                  else{
                    return 0.1
                  }
                } )
              .attr(
                  'transform',
                  (d) =>
                      `translate(${projection([d.lng, d.lat])[0]}, ${
                          projection([d.lng, d.lat])[1]
                      })`
              )
              .attr('d', (d) => spike(spikeScale(parseInt(d.males)+parseInt(d.females))))
              .on('mouseover', shootingBarTip.show)
              .on('mouseout', shootingBarTip.hide);
      
      };
      
     

    males = async () => {
      d3.selectAll('g').remove();
      d3.selectAll('rect').remove();
      d3.selectAll('text').remove();
      let usData = await d3.json("https://unpkg.com/us-atlas@3/counties-10m.json");
      let GunDeaths = await d3.csv("freq.csv");
      let stateFreq = await d3.csv("newdf.csv");
      let svg = d3.select("#map");
      let projection = d3.geoAlbersUsa();
      let path = d3.geoPath(projection);
      let state = topojson.feature(usData, usData.objects.states);
      totalDeaths =[];
      GunDeaths.forEach((data) => totalDeaths.push(parseInt(data.males) ));
      spikeScale = d3.scaleLinear().domain(d3.extent(totalDeaths)).range([1, 50]);
      deathPerGender = [];
      deathPerGender = [];
      stateFreq.forEach((data) => {
          deathPerGender.push(data.males)
          deathPerGender.push(data.females)
      })
      
      
      let ageColorScale = d3
        .scaleLinear()
        .interpolate(() => d3.interpolateOranges)
        .domain([26, 46]);
      spike = (length, width = 7) =>
      `M${-width / 2},0L0,${-length}L${width / 2},0`
      
  const legend = svg
      .append('g')
      .attr('fill', '#777')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('g')
      .data(spikeScale.ticks(4).reverse())
      .join('g')
      .attr('transform', (d, i) => `translate(${900 - (i + 1) * 18},500)`)

  legend
      .append('path')
      .attr('fill', 'red')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#67001f')
      .attr('d', (d) => spike(spikeScale(d)))


      LegendText = svg.append("text")
                  .attr("x","819")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("100")
      LegendText = svg.append("text")
                  .attr("x","840")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("300")
     LegendText = svg.append("text")
                  .attr("x","860")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("900")
     LegendText = svg.append("text")
                  .attr("x","880")
                  .attr("y","515") 
                  .attr("font-size",8)
                  .text("1200")
    
      let maleBarTip = d3
          .tip()
          .html(function (d) {
              return `
              <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'></span><br/>
              <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>State:</strong> 
                  ${d.state}
                  </span><br/>
                  <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Males:</strong> 
                  ${d.males}
                  </span></div>
                        `
          })
      
      let shootingBarTip2 = d3
            .tip()
            .html(function (d) {
                return `
                <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>State:</strong> 
                ${d.state}</span><br/>
                <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Male:</strong> 
                    ${d.males}
                    </span><br/>
                                     `
            })
            
    
            let stateColored = svg.append("g");
    
    
          stateColored
              .selectAll("path")
              .data(state.features)
              .join("path")
              .attr("d", (f) => path(f))
              .attr("stroke", "grey")
              .attr("fill", "#e7e1ef")
              .attr("stroke-width", 2)
              .attr("id", (d) => `state${d.id}`);
              
          
              var zoom = d3
                  .zoom()
                  .scaleExtent([1, 8])
                  .on('zoom', function () {
          
                    stateColored.attr('transform', d3.event.transform)
                    spikeGroup.attr('transform', d3.event.transform)
          
                  })
          
          
            svg.call(zoom)
            svg.call(shootingBarTip2)
            
            
            let  spikeGroup = svg.append('g');
            spikeGroup
                .attr('fill', 'red')
                .selectAll('path')
                .data(stateFreq)
                .join('path')
                .attr('stroke',(d) => {
                    if(parseInt(d.males) > 2){
                      return "#67001f"
                    }
                    else if(parseInt(d.males) == 1){
                      return "#ce1256"
                    }
                    else{
                      return "#df65b0"
                    }
                  } )
                .attr('fill-opacity', (d) => {
                    if(parseInt(d.males)  > 2){
                      return 0.5
                    }
                    else if(parseInt(d.males) == 1){
                      return 0.3
                    }
                    else{
                      return 0.1
                    }
                  } )
                .attr(
                    'transform',
                    (d) =>
                        `translate(${projection([d.lng, d.lat])[0]}, ${
                            projection([d.lng, d.lat])[1]
                        })`
                )
                .attr('d', (d) => spike(spikeScale(parseInt(d.males))))
                .on('mouseover', shootingBarTip2.show)
                .on('mouseout', shootingBarTip.hide);
                      
      };

      females = async () => {
        d3.selectAll('g').remove();
        d3.selectAll('rect').remove();
        d3.selectAll('text').remove();
        let usData = await d3.json("https://unpkg.com/us-atlas@3/counties-10m.json");
        let GunDeaths = await d3.csv("freq.csv");
        let stateFreq = await d3.csv("newdf.csv");
        let svg = d3.select("#map");
        let projection = d3.geoAlbersUsa();
        let path = d3.geoPath(projection);
        let state = topojson.feature(usData, usData.objects.states);
        totalDeaths =[];
        GunDeaths.forEach((data) => totalDeaths.push(parseInt(data.females)));
        spikeScale = d3.scaleLinear().domain(d3.extent(totalDeaths)).range([1, 25]);
        deathPerGender = [];
        deathPerGender = [];
        stateFreq.forEach((data) => {
            deathPerGender.push(data.males)
            deathPerGender.push(data.females)
        })
        
        
        let ageColorScale = d3
          .scaleLinear()
          .interpolate(() => d3.interpolateOranges)
          .domain([26, 46]);
        spike = (length, width = 7) =>
        `M${-width / 2},0L0,${-length}L${width / 2},0`
        
    const legend = svg
        .append('g')
        .attr('fill', '#777')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('g')
        .data(spikeScale.ticks(4).reverse())
        .join('g')
        .attr('transform', (d, i) => `translate(${900 - (i + 1) * 18},500)`)
  
    legend
        .append('path')
        .attr('fill', 'red')
        .attr('fill-opacity', 0.3)
        .attr('stroke', '#67001f')
        .attr('d', (d) => spike(spikeScale(d)))
  
  
        LegendText = svg.append("text")
                    .attr("x","819")
                    .attr("y","515") 
                    .attr("font-size",8)
                    .text("1")
        LegendText = svg.append("text")
                    .attr("x","840")
                    .attr("y","515") 
                    .attr("font-size",8)
                    .text("65")
       LegendText = svg.append("text")
                    .attr("x","860")
                    .attr("y","515") 
                    .attr("font-size",8)
                    .text("120")
       LegendText = svg.append("text")
                    .attr("x","880")
                    .attr("y","515") 
                    .attr("font-size",8)
                    .text("200")
      
        let maleBarTip = d3
            .tip()
            .html(function (d) {
                return `
                <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'></span><br/>
                <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>State:</strong> 
                    ${d.state}
                    </span><br/>
                    <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Females:</strong> 
                    ${d.females}
                    </span></div>
                          `
            })
        
        let shootingBarTip2 = d3
              .tip()
              .html(function (d) {
                  return `
                  <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>State:</strong> 
                  ${d.state}</span><br/>
                  <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Female:</strong> 
                      ${d.females}
                      </span><br/>
                                       `
              })
              
      
              let stateColored = svg.append("g");
      
      
            stateColored
                .selectAll("path")
                .data(state.features)
                .join("path")
                .attr("d", (f) => path(f))
                .attr("stroke", "grey")
                .attr("fill", "#e7e1ef")
                .attr("stroke-width", 2)
                .attr("id", (d) => `state${d.id}`);
                
            
                var zoom = d3
                    .zoom()
                    .scaleExtent([1, 8])
                    .on('zoom', function () {
            
                      stateColored.attr('transform', d3.event.transform)
                      spikeGroup.attr('transform', d3.event.transform)
            
                    })
            
            
              svg.call(zoom)
              svg.call(shootingBarTip2)
              
              
              let  spikeGroup = svg.append('g');
              spikeGroup
                  .attr('fill', 'red')
                  .selectAll('path')
                  .data(stateFreq)
                  .join('path')
                  .attr('stroke',(d) => {
                      if(parseInt(d.females) > 2){
                        return "#67001f"
                      }
                      else if(parseInt(d.females) == 1){
                        return "#ce1256"
                      }
                      else{
                        return "#df65b0"
                      }
                    } )
                  .attr('fill-opacity', (d) => {
                      if(parseInt(d.females)  > 2){
                        return 0.5
                      }
                      else if(parseInt(d.females) == 1){
                        return 0.3
                      }
                      else{
                        return 0.1
                      }
                    } )
                  .attr(
                      'transform',
                      (d) =>
                          `translate(${projection([d.lng, d.lat])[0]}, ${
                              projection([d.lng, d.lat])[1]
                          })`
                  )
                  .attr('d', (d) => spike(spikeScale(parseInt(d.females))))
                  .on('mouseover', shootingBarTip2.show)
                  .on('mouseout', shootingBarTip.hide);
                        
        };
  ages = async () => {
    d3.selectAll('g').remove();
    d3.selectAll('rect').remove();
    d3.selectAll('text').remove();
    let usData = await d3.json("https://unpkg.com/us-atlas@3/counties-10m.json");
    let GunDeaths = await d3.csv("freq.csv");
    let stateFreq = await d3.csv("age.csv");
    let stateAverageAge = await d3.csv("freq_avg_age.csv")
    let svg = d3.select("#map");
    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath(projection);
    let state = topojson.feature(usData, usData.objects.states);
    totalDeaths =[];
    stateAverageAge.forEach((data) => totalDeaths.push(parseInt(data.age)));
    spikeScale = d3.scaleLinear().domain(d3.extent(totalDeaths)).range([1, 50]);
    deathPerGender = [];
    deathPerGender = [];
    stateAverageAge.forEach((data) => {
        deathPerGender.push(data.age)
        
    }) 
    let ageColorScale = d3
    .scaleLinear()
    .interpolate(() => d3.interpolateGreens)
    .domain([26, 46]);
    spike = (length, width = 7) =>
  `M${-width / 2},0L0,${-length}L${width / 2},0`

  const legend = svg
  .append('g')
  .attr('fill', '#777')
  .attr('text-anchor', 'middle')
  .attr('font-family', 'sans-serif')
  .attr('font-size', 10)
  .selectAll('g')
  .data(spikeScale.ticks(4).reverse())
  .join('g')
  .attr('transform', (d, i) => `translate(${900 - (i + 1) * 18},500)`)

legend
  .append('path')
  .attr('fill', 'red')
  .attr('fill-opacity', 0.3)
  .attr('stroke', '#67001f')
  .attr('d', (d) => spike(spikeScale(d)))


  LegendText = svg.append("text")
              .attr("x","819")
              .attr("y","515") 
              .attr("font-size",8)
              .text("30")
  LegendText = svg.append("text")
              .attr("x","840")
              .attr("y","515") 
              .attr("font-size",8)
              .text("36")
 LegendText = svg.append("text")
              .attr("x","860")
              .attr("y","515") 
              .attr("font-size",8)
              .text("45")
 LegendText = svg.append("text")
              .attr("x","880")
              .attr("y","515") 
              .attr("font-size",8)
              .text("50")
  let maleBarTip = d3
              .tip()
              .html(function (d) {
                  return `
                  <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'></span><br/>
                  <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>State:</strong> 
                      ${d.state}
                      </span><br/>
                      <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Age:</strong> 
                      ${Math.trunc(d.age)}
                      </span></div>
                            `
              })

    let shootingBarTip2 = d3
    .tip()
    .html(function (d) {
        return `
        <div class = 'd3-tip' style='background:black;font-size: small'><span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>State:</strong> 
        ${d.state}</span><br/>
        <span style='color:white; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Male:</strong> 
            ${Math.round(d.age)}
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
            .attr("fill", '#e7e1ef')
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
    
          svg.call(zoom)
          svg.call(shootingBarTip2)
        
          let  spikeGroup = svg.append('g');
          spikeGroup
              .attr('fill', 'red')
              .selectAll('path')
              .data(stateFreq)
              .join('path')
              .attr('stroke',(d) => {
                  if(parseInt(d.age) > 2){
                    return "#67001f"
                  }
                  else if(parseInt(d.age) == 1){
                    return "#ce1256"
                  }
                  else{
                    return "#df65b0"
                  }
                } )
              .attr('fill-opacity', (d) => {
                  if(parseInt(d.age)  > 2){
                    return 0.5
                  }
                  else if(parseInt(d.age) == 1){
                    return 0.3
                  }
                  else{
                    return 0.1
                  }
                } )
              .attr(
                  'transform',
                  (d) =>
                      `translate(${projection([d.lng, d.lat])[0]}, ${
                          projection([d.lng, d.lat])[1]
                      })`
              )
              .attr('d', (d) => spike(spikeScale(parseInt(d.age))))
              .on('mouseover', shootingBarTip2.show)
              .on('mouseout', shootingBarTip2.hide);
                    
      
  };    
     


    
  