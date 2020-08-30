// PART 1: PLOTTING % SMOKERS VS AGE BY STATE.  % SMOKERS ON Y AXIS, AGE ON X AXIS, DATA IN CIRCLES, STATE ABBR INSIDE CIRCLE
//----------------------------------------------------------------------------------------------------------------------------
//1.1 Define SVG area dimensions
const svgWidth = 900;
const svgHeight = 500;

// 1.2 Define the chart's margins as an object
const margin = {
  top: 50,
  right:50,
  bottom: 50,
  left: 50
};

// 1.3 Define dimensions of the chart area
const chartWidth = svgWidth - margin.left - margin.right-50;
const chartHeight = svgHeight - margin.top - margin.bottom -50;

// 1.4 Select body, append SVG area to it, and set its dimensions
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height",svgHeight)
  .classed("iframeContainer", true);

// 1.5 Append a group area, then set its margins
const chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`)
    .classed('iframeContainer', true);


//1.3 Load data using d3.csv function:
d3.csv("assets/data/data.csv").then(function(csvData) {

    console.log(csvData);
    const states = csvData.map(data=>data.state);
    const abbrs= csvData.map(data=> data.abbr);

    csvData.forEach(function(data) {
        data.poverty =+ data.state;
        data.povertyMoe =+data.povertyMoe;
        data.age =+data.age;
        data.ageMoe=+ data.ageMoe;
        data.income =+data.income;
        data.incomeMoe =+ data.incomeMoe;
        data.healthcare=+ data.healthcare;
        data.healthcareLow =+ data.healthcareLow;
        data.healthcareHigh=+ data.healthcareHigh;
        data.obesity=+ data.obesity;
        data.obesityLow=+ data.obesityLow;
        data.obesityHigh=+ data.obesityHigh;
        data.smokes=+ data.smokes;
        data.smokesLow=+ data.smokesLow;
        data.smokesHigh=+ data.smokesHigh;
        console.log (data.smokes);
        
    });

    const xMin = d3.min(csvData,data=>data.age);
    const xMax = d3.max(csvData,data=>data.age);
    const yMin = d3.min(csvData,data=>data.smokes);
    const yMax = d3.max(csvData,data=>data.smokes);


    // 1.4 Create a scale for your independent (x) coordinates:
    const xScale = d3.scaleLinear()
        .domain([xMin-1, xMax+1])
        .range([0,chartWidth]);

    // 1.5 Create a scale for your dependent (y) coordinates:
    const yScale = d3.scaleLinear()
        .domain([yMin -1, yMax+1])
        .range([chartHeight,0]);

    // 1.6 Scale and create chart axes:
    const bottomAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    const leftAxis = d3.axisLeft(yScale);
    
    chartGroup.append("g")
        .call(leftAxis);
        
    //1.7 Add circles to the a group and append
    const circlesGroup = chartGroup.append('g')
        .selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d=> xScale(d.age))
        .attr("cy",  d=> yScale(d.smokes))
        .attr("r", 15)
        .attr('opacity', '.75')
        // .html(`<h1>${d=>d.abbr}</h1>`)
        .classed('stateCircle', true);
    
    // 1.8 Add state abbreviations inside circles via a tooltip
    const textGroup = chartGroup.append('g')
        .selectAll('text')
        .data(csvData)
        .enter()
        .append("text")
        .text(d=>d.abbr)
        .attr("x", d=> xScale(d.age))
        .attr("y",  d=> yScale(d.smokes))
        .attr('z-layer', '1000')
        .attr('font-size', '8px')
        .attr('text-anchor', 'middle')
    console.log(csvData.map(d=>d.abbr));

    //1.9  Create axes labels
    //create y labels
    const yAxisLabel = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .append('text')
        .attr("y", 0-25)
        .attr("x", 0-(chartHeight / 2))
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text("Smokers(%)")
        .classed('stateText', true);
        
        
    // create xlabels
    chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top })`)
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text("Age (Median)")
        .classed('aText', true);

    // Append a div to the body to create tooltips, assign it a class
    function updateToolTip(CirclesGroup){
        const toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8,0])
            .html(d =>
              `State: <strong>${d.state}</strong>
                    <br>
                    Age (Median): ${d.age}
                    Smokes (%): ${d.smokes}`
            );
            // .style("left", d3.event.pageX + "px")
            // .style("top", d3.event.pageY + "px");

        circlesGroup.call(toolTip);

         //Add an onmouseover event to display a tooltip
           circlesGroup.on("mouseover", function(data){
               toolTip.show(data)
           })

            // Step 3: Add an onmouseout event to make the tooltip invisible
            .on("mouseout", function(data,i){
                toolTip.hide(data);
            });
        return circlesGroup;
    };

}).catch(function(error) {
    console.log(error);
    });
  

