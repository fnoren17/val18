var width = 360,
  height = 600;

var projection = d3.geoMercator().scale(1000).translate([-160,1700]);
var path = d3.geoPath().projection(projection);
var mapsvg = d3.select("#map").append("svg").attr("class", "map");

var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .styles({"opacity": 0,"height": "auto"});

d3.json("sweden.topo.json", function(error, data) {
    if (error) throw error;
 mapsvg.append("g")
        .attr("id", "states")
        .attr("class", "map")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.states).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("d", path)
        .on("click", stateClicked)
        .on("mouseover", stateMouseover);
});


function stateMouseover(state){
    div.html(state.properties.name);
}

function stateClicked(state){
    d3.selectAll("g#kommuner").remove();
    console.log(state.properties.name);
    d3.json("kommun.json", function(error, data) {
    if (error) throw error;
 mapsvg.append("g")
        .attr("id", "kommuner")
        .attr("class", "map")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.kommuner).features)
        .enter()
        .append("path")
        .filter(function(d){return d.properties.state == state.properties.name;})
        .attr("id", function(d) { return d.id; })
        .attr("class", function(d){return d.properties.state;})
        .attr("d", path)
        .on("click", function(d){d3.selectAll("g#kommuner").remove();});
});
}

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 ,
    height = 500;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("sales.csv", function(error, data) {
  if (error) throw error;
  var colors = d3.scaleOrdinal()
    .domain(["M","C","L","KD","S","V","MP","SD","FI"])
    .range(["#004ED8", "#00983E", "#61B6E9","#222174","#F31D29","#B2000E","#81CD49","#DFDB35","#D01C67"]);
  // format the data
  data.forEach(function(d) {
    d.procent = +d.procent;
  });

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.parti; }));
  y.domain([0, d3.max(data, function(d) { return d.procent; })]);

  // append the rectangles for the bar chart

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.parti); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.procent); })
      .attr("height", function(d) { return height - y(d.procent); })
      .attr("fill",function(d,i){return colors(d.parti);});

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});

