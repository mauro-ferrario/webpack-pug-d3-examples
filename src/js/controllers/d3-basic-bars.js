import * as d3 from "d3";
require ("../../css/components/d3-basic-bars.scss");


// Base code from: https://bost.ocks.org/mike/bar

export default class{
    constructor(el){
        this.el = el;   
        this.chartWidth = window.innerWidth;
        this.barHeight = 20;
        this.convertIntoRange =  d3.scaleLinear().range([0, this.chartWidth]);
        // this.drawFirstBars(); 
        this.drawBarsFromFile();  
    }

    drawBarsFromFile(){
        d3.tsv("data/data.csv", this.type).then((data) => {
            const chart = d3.select(".chart-from-file");
            this.drawChart(chart, data, (d) => {
                return d.value;
            });
        });
    }

    drawFirstBars(){
        const chart = d3.select(".chart");
        const data = [4, 8, 15, 16, 23, 42];
        this.drawChart(chart, data, (d) => {
            return d;
        });
    }

    createBars(chart, data, barHeight){
        return chart.selectAll("g")
            .data(data)
            .enter().append("g")
                .attr("transform", (d, i) => { return "translate(0," + i * barHeight + ")"; });
    }

    createRect(bars, valueFunc){
        bars.append("rect")
            .attr("width", (d) => { return this.convertIntoRange(valueFunc(d)); })
            .attr("height", this.barHeight - 1);
    }
    
    addText(bars, valueFunc){
        bars.append("text")
            .attr("x", (d) => { return this.convertIntoRange(valueFunc(d)) - 3; })
            .attr("y", this.barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return valueFunc(d); });
    }

    // Force value to be a number and not a string
    type(d) {
        d.value = +d.value; // coerce to number
        return d;
    }

    setChartSize(chart, width, height){
        chart.attr("width", width)
        .attr("height", height);
    }

    drawChart(chart, data, valueFunc){
        this.convertIntoRange.domain([0, d3.max(data, function(d)  { return valueFunc(d); })]);
        // Set chart width and height
        const chartHeight = this.barHeight * data.length;
        this.setChartSize(chart, this.chartWidth, chartHeight);
        // Create the bars and add a "g" container
        const bars = this.createBars(chart, data, this.barHeight);
        // Addd the "background" rectangle
        this.createRect(bars, valueFunc);
        // Add text
        this.addText(bars, valueFunc);
    }
}