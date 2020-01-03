// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from CSV
d3.csv("assets/data/data.csv").then(function(hwData) {
  
    console.log(hwData);
  
    // log a list of names
    hwData.forEach(function(data) {
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log(data.abbr, data.poverty, data.healthcare);
    });

    var xLinearScale = d3.scaleLinear()
        .domain([7, d3.max(hwData, d => d.poverty + 2)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([3, d3.max(hwData, d => d.healthcare + 2)])
        .range([height, 0]);

    // create axes
    // =============================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append the axes to the chartGroup
    // ==============================================
    // add bottomAxis
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

    // add leftAxis to the left side of the display
    chartGroup.append("g").call(leftAxis);

    // create circlesGroups
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(hwData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "13")
        .attr("class", "stateCircle");

    // add text to circles
    var circlesGroup = chartGroup.selectAll()
        .data(hwData)
        .enter()
        .append("text")
        .text(d => (d.abbr))
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare - (0.25)));

    // initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
          return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });

    // create tooltip in the chart
    chartGroup.call(toolTip);

    // create event listeners to display and hide tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
      // onMouseOut event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      })
    
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "aText")
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

}).catch(function(error) {
      console.log(error);
});
