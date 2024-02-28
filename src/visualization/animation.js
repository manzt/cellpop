import * as d3 from "d3";

import { getUpperBound } from "./util";

export function showAnimation(data) {
    let data2 = {
        countsMatrix: data.countsMatrix,
        rowNames: data.rowNames,
        colNames: data.colNames,
    }
    createStackedBar(data2);


}

// test data
// let data2 = {
    //     countsMatrix: [{row: 'sampleA', col: 'cellZ', value: 10},
    //              {row: 'sampleB', col: 'cellZ', value: 5},
    //             //  {row: 'sampleC', col: 'cellZ', value: 10},
    //              {row: 'sampleA', col: 'cellY', value: 20},
    //              {row: 'sampleB', col: 'cellY', value: 3},
    //              {row: 'sampleC', col: 'cellY', value: 15},
    //              {row: 'sampleA', col: 'cellX', value: 10},
    //              {row: 'sampleB', col: 'cellX', value: 5},
    //              {row: 'sampleC', col: 'cellX', value: 10},
    //              {row: 'sampleA', col: 'cellW', value: 20},
    //              {row: 'sampleB', col: 'cellW', value: 3},
    //              {row: 'sampleC', col: 'cellW', value: 15},],
    //     rowNames: ['sampleA', 'sampleB', 'sampleC'],
    //     colNames: ['cellZ', 'cellY', 'cellX', 'cellW']
    // }

function createStackedBar(data) {
    let width = 1000;
    let height = 1000;

    // determine the start and end of each rect for the stacked bar chart
    const rowValsCounter = [];
    for (const row of data.rowNames) {
        rowValsCounter.push({row: row, counter: 0});
    }

    for (const entry of data.countsMatrix) {
        let currVal = rowValsCounter.filter(r => r.row === entry.row)[0].counter;
        let newVal = currVal + entry.value;
        entry.start = currVal;
        entry.end = newVal;
        rowValsCounter.filter(r => r.row === entry.row)[0].counter = newVal;
    }

    // create new svg
    let svg = d3.select("#app")
        .append("svg")
            .attr("width", 2000)
            .attr("height", 2000)
        .append("g")
            .attr("class", "animate")
            .attr("transform", 
                 "translate(300,150)")

    // add x axis
    let x = d3.scaleBand()
        .domain(data.rowNames)
        .range([0,width])
        .padding([0.01])

    svg.append("g")
        .attr("class", "axisbottom")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add y axis
    let y = d3.scaleLinear()
        .domain([0, getUpperBound(rowValsCounter.map(d => d.counter))])
        .range([ height, 0 ]);
    
    svg.append("g")
        .attr("class", "axisleft")
        .call(d3.axisLeft(y));
    
    // add color
    var color = d3.scaleOrdinal()
        .domain(data.colNames)
        .range(["#1A2A22", "#79FFFC", "#8F5D4E", "#FFFF7C", "#FFFF7C", 
                "#C665BF", "#8AFF79", "#4E5C35", "#A4FCE5", "#FF8095", "#7A85FE"])


    // add all rectangles
    svg.append("g").selectAll()
        .attr("class", "bars")
        .data(data.countsMatrix, function(d) {return d.row+":"+d.col;})
        .enter()
        .append("rect")
            .attr("class", "bar-rects")
            .attr("x", function(d) {return x(d.row)})
            .attr("y", function(d) {return y(d.end)})
            .attr("width", x.bandwidth())
            .attr("height", function(d) {return y(d.start) - y(d.end)})
            .attr("fill", function(d) {return color(d.col)})


    // animations
    // rotate
    d3.select(".animate")
        .transition()
        .duration(2000)
        .delay(2000)
        // .attr("transform", "translate(500,0)")
        .attr("transform", "rotate(90, 650, 750)")

    // rotate x-labels the other way
    d3.select(".animate")
        .select(".axisbottom")
        .selectAll("text")
        .transition()
        .duration(2000)
        .delay(2000)
        .attr("transform", "translate(-15,130)rotate(-90)")

    // d3.selectAll(".animate")
    //     .select("g.axisleft")
    //         .transition()
    //         .delay(2000)
    //         .duration(1)
    //         .remove()
            

    let y2 = d3.scaleBand()
            .range([ height, 0 ])
            .domain(data.colNames)
            .padding(0.01);
    
    // call the new axis
    d3.selectAll(".animate")
        .select("g.axisleft")
        .transition()
        .delay(5000)
        .call(d3.axisLeft(y2))
        
    // move the rects
    d3.selectAll(".animate")
        .selectAll(".bar-rects")
        .transition()
        .delay(6000)
        .ease(d3.easeLinear)
        .attr("y", function(d) {return y2(d.col)})
        .attr("height", y2.bandwidth())


    // Color axis
	let colorRange = d3.scaleLinear()
        .range(["white", "#69b3a2"])
        .domain([0,2000])


    // change the color of the rects
    d3.selectAll(".animate")
        .selectAll(".bar-rects")
        .transition()
        .delay(7500)
        .attr("fill", function(d) {return colorRange(d.value)})
        
}