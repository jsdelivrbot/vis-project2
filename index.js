var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var filterTargets = [];

var x = d3.scale.linear()
    .range([0, width-150]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);
tooltip.append('div')
    .attr('class', 'team');
tooltip.append('div')
    .attr('class', 'record')
tooltip.append('div')
    .attr('class', 'touchdowns');

d3.csv("NFL.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.touchdowns = +d.touchdowns;
    d.wins = +d.wins;
  });

  x.domain(d3.extent(data, function(d) { return d.wins; })).nice();
  y.domain(d3.extent(data, function(d) { return d.touchdowns; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width-150)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Wins");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Touchdowns")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("division", function(d) { return d.division;})
      .attr("r", 30)
      .attr("cx", width/2-50)
      .attr("cy", -100)
      .style("fill", "white")
      .transition()
      .duration(3000)
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.wins); })
      .attr("cy", function(d) { return y(d.touchdowns); })
      .style("fill", function(d) { return color(d.division); });
 svg.selectAll(".dot")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

      svg.append("text")
        .attr("x", (width / 2.5))
        .attr("y", 10)
        .style("font-size", "18px") 
        .style("text-decoration", "underline")  
        .text("NFL 2016 Season")
     
     svg.append("text")
        .attr("x", (width / 2.5))
        .attr("y", 30)
        .style("font-size", "14px") 
        .text("Touchdowns vs Wins")

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width -10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "black")
      .style("stroke", color)
      .style("stroke-width", 4)
      .on("click", function(d){
        if (d3.select(this).attr("style").indexOf('white') >= 0){
          d3.select(this).style("fill", "black");
          d3.select(this).transition();
        }
        else{
          d3.select(this).style("fill", "white");
          d3.select(this).transition();
        }
        toggleFilter(d);
      });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});

function toggleFilter(d){
  console.log(d);
  var index = filterTargets.indexOf(d);
  if (index >= 0){
    filterTargets.splice(index, 1);
  }
  else{
    filterTargets.push(d)
  }
  d3.selectAll("circle")
    .each(function(d){
      if (filterTargets.indexOf(d3.select(this).attr("division"))>=0){
        //console.log("Filter: "+filterTargets);
        //console.log("Current Circle: "+d3.select(this).attr("name"));
        //console.log(filterTargets.indexOf(d3.select(this).attr("name")));
        d3.select(this)
        .transition()
        .duration(1500)
        .attr("cx",  width/2-50)
        .attr("cy", -100)
        .attr("r", "0");
      }
      else{
        d3.select(this)
        .transition()
        .duration(1500)
        .attr("cx", function(d) { return x(d.wins); })
        .attr("cy", function(d) { return y(d.touchdowns); })
        .attr("r", 6);
      }  
    })
}
function mouseover(d){
    tooltip.transition()
        .duration(300)
        .style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(500)
      .attr("r", 10);
}


function mousemove(d) {
    tooltip.select('.team').html('<b>' + d.team);
    var gamesLost = 16-d.wins
    tooltip.select('.record').html('Record: ' + d.wins+ '-' + gamesLost);
    tooltip.select('.touchdowns').html('Touchdowns: ' + d.touchdowns);
    tooltip.style("left", (d3.event.x) + 10 + "px")
        .style("top", (d3.event.y) + 10 + "px");
}

function mouseout(d){
    tooltip.transition()
        .duration(300)
        .style("opacity", 1e-6);
    d3.select(this)
      .transition()
      .duration(500)
      .attr("r", 6);
}
