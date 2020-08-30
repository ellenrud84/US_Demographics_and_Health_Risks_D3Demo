// BONUS 1 & 2:
//----------------------------------------------------------------------------------------------------------------------------
//1.1 Define SVG area dimensions
const svgWidth = 900;
const svgHeight = 900;

// 1.2 Define the chart's margins as an object
const margin = {
  top: 100,
  right:20,
  bottom: 100,
  left: 100
};

// 1.3 Define dimensions of the chart area
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// 1.4 Create SVG wrapper, and set its dimensions
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height",svgHeight)

// 1.5 Append a group, then set its margins
const chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`)
    .classed('iframeContainer', true);

// 1.6 Initiate X and Y axes :
let yAxisChoice= "age";
let xAxisChoice= "smokes";

//1.7 Function to update x-scale when select an axis label:
function updateXScale(csvData, xAxisChoice){
    const xLinearScale = d3.scaleLinear()
        .domain(d3.extent(csvData, d=>d[xAxisChoice]))
        .range([0,chartWidth]);
    return xLinearScale;
}

//1.8 Function to update y-scale when select an axis label:
function updateYScale(csvData, yAxisChoice){
    const yLinearScale = d3.scaleLinear()
        .domain(d3.extent(csvData, d=>d[yAxisChoice]))
        .range([chartHeight, 0]);
    return yLinearScale;
}

//1.9 Function to update xaxis when select axis label
function updateXAxis(xScale2, xAxis){
    const bottomAxis = d3.axisBottom(xScale2);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);
    
    return xAxis;
}

//2.0 Function to update y axis when select axis label:
function updateYAxis(yScale2, yAxis){
    const leftAxis = d3.axisLeft(yScale2);

    yAxis.transition()
        .duration(500)
        .call(leftAxis);
    
    return yAxis;
}

//2.1 Function to update circles group x position with transition when change axes selection:
function updateXCircles(circlesGroup, xScale2, xAxisChoice){

    circlesGroup.transition()
                .duration(500)
                .attr('cx', d=>xScale2(d[xAxisChoice]));
    
    return circlesGroup;
}

//2.2 Function to update circles group y position with transition when change axes selection:
function updateYCircles(circlesGroup, yScale2, yAxisChoice){

    circlesGroup.transition()
                .duration(500)
                .attr('cy', d=>yScale2(d[yAxisChoice]));
    
    return circlesGroup;
}

//2.2 Function to update circles text x position with transition when change axes selection:
function updateXCircleText(circlesText, xScale2, xAxisChoice){

    circlesText.transition()
                .duration(500)
                .attr('x', d=>xScale2(d[xAxisChoice]));
    
    return circlesText;
}

//2.2 Function to update circles text y position with transition when change axes selection:
function updateYCircleText(circlesText, yScale2, yAxisChoice){

    circlesText.transition()
                .duration(500)
                .attr('y', d=>yScale2(d[yAxisChoice]));
    
    return circlesText;
}

//2.3 Function to update tooltip when change axes selection:
function updateToolTip(xAxisChoice, yAxisChoice, circlesGroup){

    var xlabel;
    var ylabel;

    if (yAxisChoice ==='obesity'){
        yLabel='Obese (%)'
    }
    else if (yAxisChoice === 'healthcare'){
        yLabel ='Lacks Healthcare (%)'
    }
    else {
        yLabel = 'Smokes (%)'
    }

    if (xAxisChoice === 'poverty'){
        xLabel= 'In Poverty (%)'
    }
    else if (xAxisChoice === 'income'){
        xLabel= 'Income(Median)'
    }
    else{
        xLabel = 'Age (Median)'
    }

    const toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([0,10])
        .html(function(d){
            return (`<strong>${d.state}</strong>
                    <br>
                    <h2>${xLabel}: ${d[xAxisChoice]}</h2>
                    <br>
                    <h2>${yLabel}: ${d[yAxisChoice]}</h2>`)
        });
    circlesGroup.call(toolTip);

    //add event listeners for tooltip:
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })
    
        .on("mouseout", function(data, i){
            toolTip.hide(data)
    });
    
    return circlesGroup;
}

//2.4 Load data using d3.csv function:
d3.csv("assets/data/data.csv").then(function(csvData) {

    console.log(csvData);
    const states = csvData.map(data=>data.state);
    const abbrs= csvData.map(data=> data.abbr);

    csvData.forEach(function(data) {
        data.id =+ data.id
        data.poverty =+ data.poverty;
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
    });

    //2.5 Create x scaling function relative to chosen axis
    let xLinearScale = updateXScale(csvData, xAxisChoice);

    //2.6 Create y scaling function relative to chosen axis:
    let yLinearScale = updateYScale(csvData, yAxisChoice);

    //2.8 Create axes:
    const bottomAxis= d3.axisBottom(xLinearScale);
    const leftAxis= d3.axisLeft(yLinearScale);

    //2.9 Initiate x axis:
    let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    //3.0 Initiate y axis:
    let yAxis = chartGroup.append('g')
        .call(leftAxis);

    //3.1 Initiate Circles:
    let circlesGroup = chartGroup.append('g')
        .selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d[xAxisChoice]))
        .attr("cy",  d=> yLinearScale(d[yAxisChoice]))
        .attr("r", 15)
        .attr('opacity', '.75')
        .classed('stateCircle', true);

    //3.2 Add state abbreviations inside circles
    let circlesText = chartGroup.append('g')
        .selectAll('text')
        .data(csvData)
        .enter()
        .append("text")
        .text(d=>d.abbr)
        .attr("x", d=> xLinearScale(d[xAxisChoice]))
        .attr("y",  d=> yLinearScale(d[yAxisChoice]))
        .attr('font-size', '8px')
        .attr('text-anchor', 'middle');

    //3.3  Create axes labels groups & labels
    //create y labels
    const yAxisLabels = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    const smokesLabel= yAxisLabels.append('text')
        .attr('x', 0-(chartHeight / 2))
        .attr('y', 0- margin.left + 20)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('value', 'smokes')
        .classed('aText', true)
        .classed('active', true)
        .text("Smokes (%)");

    const healthcareLabel= yAxisLabels.append('text')
        .attr("x", 0-(chartHeight / 2))    
        .attr("y", 0 - margin.left +40)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('value', 'healthcare')
        .classed('aText', true)
        .classed('inactive', true)
        .text("Lacks Healthcare (%)");

    const obesityLabel= yAxisLabels.append('text')
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 0 - margin.left +60)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('value', 'obesity')
        .classed('aText', true)
        .classed('inactive', true)
        .text("Obesity (%)");

    // create xlabels groups and labels
    const xAxisLabels= chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight+20})`)
        
    const ageLabel= xAxisLabels.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('value', 'age')
        .classed('stateText', true)
        .classed('active', true)
        .text("Age (Median)");

    const incomeLabel = xAxisLabels.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('fill', 'black')
        .attr('value', 'income')
        .classed('aText', true)
        .classed('inactive', true)
        .text("Houshold Income (Median)");
  
    const povertyLabel = xAxisLabels.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('fill', 'black')
        .attr("value", 'poverty')
        .classed('aText', true)
        .classed("inactive", true)
        .text("Poverty (%)");
        
   
    //3.3 Call on update Tooltip Function:
    circlesGroup= updateToolTip(xAxisChoice, yAxisChoice, circlesGroup);

    //3.4 Create x-labels event listener:
    xAxisLabels.selectAll("text")
        .on("click", function(){
            const xVal = d3.select(this).attr('value')
            console.log(`xval: ${xVal}`);
            if (xVal !== xAxisChoice){
                //update xAxisChoice:
                xAxisChoice = xVal;
                //update xLinearScale:
                xLinearScale = updateXScale(csvData, xAxisChoice);
                //update and transition xaxis:
                xAxis = updateXAxis(xLinearScale, xAxis);
                //update circles group with new x
                circlesGroup = updateXCircles(circlesGroup, xLinearScale, xAxisChoice);
                //update text within circles with new x:
                circlesText = updateXCircleText(circlesText, xLinearScale, xAxisChoice);
                // update tooltips with new x:
                circlesGroup = updateToolTip(xAxisChoice, yAxisChoice, circlesGroup);

                //Make the chosen axes bold:
                if(xAxisChoice ==='income'){
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (xAxisChoice ==='age'){
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                
            }
        });

    //3.5 Create y-labels event listener:
    yAxisLabels.selectAll("text")
        .on("click", function(){
            const yVal = d3.select(this).attr('value');
            console.log(`yval: ${yVal}`);
            if (yVal !== yAxisChoice){
                //update xAxisChoice:
                yAxisChoice = yVal;
                //update xLinearScale:
                yLinearScale = updateYScale(csvData, yAxisChoice);
                //update and transition xaxis:
                yAxis = updateYAxis(yLinearScale, yAxis);
                //update circles group with new x
                circlesGroup = updateYCircles(circlesGroup, yLinearScale, yAxisChoice);
                //update text within circles with new x:
                circlesText = updateYCircleText(circlesText, yLinearScale, yAxisChoice);
                // update tooltips with new x:
                circlesGroup = updateToolTip(xAxisChoice, yAxisChoice, circlesGroup);
                
                //Make the chosen axes bold:
                if(yAxisChoice ==='healthcare'){
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else if (yAxisChoice ==='obesity'){
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                
            }
        
        });
   
}).catch(function(error) {
    console.log(error);
    });