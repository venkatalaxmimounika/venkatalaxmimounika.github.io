loadVisualizations = async () => {

 
  let data = await d3.json("file1.json");
  
  console.log(data);

  const width = 1400;
    const height = 600;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };

    const svg = d3.select('#d3-container')
      .append('svg')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, 1500])
      .range([height - margin.bottom, margin.top])

    svg
      .append("g")
      .attr("fill", 'royalblue')
      .selectAll("rect")
      .data(data.sort((a, b) => d3.descending(a.total, b.total)))
      .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.total))
        .attr('title', (d) => d.total)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.total))
        .attr("width", x.bandwidth());

    function yAxis(g) {
      g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .attr("font-size", '20px')
    }

    function xAxis(g) {
      g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].state))
        .attr("font-size", '15px')
    }

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();
  
};

window.onload = () => {
  loadVisualizations();
};