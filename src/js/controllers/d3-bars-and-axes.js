import * as d3 from "d3";
require ("../../css/components/d3-bars-and-axes.scss");

// Base code from: https://bost.ocks.org/mike/bar/3/

export default class{
    constructor(el){
        this.el = el;
        this.margin = {top: 20, right: 0, bottom: 50, left: 50};
        this.charWidth = window.innerWidth;
        this.charHeight = 500;
        this.width = this.charWidth - this.margin.left - this.margin.right;
        this.height = this.charHeight - this.margin.top - this.margin.bottom;
        this.paddingPercSingleBar = 0.1;
        this.convertIntoRangeY = d3.scaleLinear().range([this.height, 0]);
        this.convertIntoRangeX =d3.scaleBand().rangeRound([0, this.width]).padding(this.paddingPercSingleBar);
        this.chart = d3.select("[data-controller=d3-bars-and-axes] .chart").attr("width", this.charWidth).attr("height", this.charHeight)
            .append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        
        var chart = d3.select(".chart")
        this.getData();
    }

    getData(){
        d3.tsv("data/dataVertical.tsv", this.type).then((data) => {
            this.convertIntoRangeX.domain(data.map(function(d) { return d.letter; }));
            this.convertIntoRangeY.domain([0, d3.max(data, function(d) { return d.frequency; })])
            this.drawChart(data);
            this.addAxis();
            this.addLabels();
        });
    }

    addLabels(){
        this.chart.append("g")
            .attr("class", "y axis")
            .call(this.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");
    }

    addAxis(){
        this.xAxis = d3.axisBottom(this.convertIntoRangeX).tickFormat((d) => {
            return d;
        })
        this.yAxis = d3.axisLeft(this.convertIntoRangeY).ticks(10, "%").tickPadding([14]);
        this.chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);
        
        this.chart.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);
    }

    drawChart(data){
        const barWidth = this.width/data.length;
        const bars = this.chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", (d) => { 
                return "translate(" + this.convertIntoRangeX(d.letter) + ",0)";
         });

        bars.append("rect")
            .attr("y", (d) => { return this.convertIntoRangeY(d.frequency); })
            .attr("height", (d) => { 
                return this.height - this.convertIntoRangeY(d.frequency); 
            })
            .attr("width", this.convertIntoRangeX.bandwidth());

        /*
        bars.append("text")
            .attr("x", (d) => { return this.convertIntoRangeX.bandwidth() / 2})
            .attr("y", (d) => { return this.convertIntoRangeY(d.frequency) + 3; })
            .attr("dy", ".75em")
            .text(function(d) { return d.frequency; });*/
    }

    // Force value to be a number and not a string
    type(d) {
        d.value = +d.value; // coerce to number
        return d;
    }
}