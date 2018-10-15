import * as d3 from "d3";
require ("../../css/components/d3-circle-and-animations.scss");

export default class{
    constructor(el){
        this.el = el;
        this.charWidth = window.innerWidth;
        this.charHeight = 500;
        this.chart = d3.select("[data-controller=d3-circle-and-animations] .chart").attr("width", this.charWidth).attr("height", this.charHeight);
        this.maxCircles = 10;
        this.delay = 2000;
        this.update();
    }

    getRandomData(){
        const totCircle = 1 + Math.random()*this.maxCircles;
        let data = [];
        for(let a = 0; a < totCircle; a++){
             data.push(Math.random()*(1-0.1)+0.1);
         }
         return data;
    }

    update(){
        const data = this.getRandomData();
        let maxCircleRadius = this.charWidth/data.length/2;
        this.selection = this.chart.selectAll("g").data(data);
        this.exitElements();    
        this.updateElements(maxCircleRadius);
        this.enterElements(maxCircleRadius);
        setTimeout(this.update.bind(this), this.delay);
    }

    exitElements(){
        // https://stackoverflow.com/questions/26461840/how-to-remove-parent-dom-node-after-d3-selection-exit?rq=1
        this.selection.exit()
            .transition()
            .duration(200)
            .remove()
            .select("circle")
            .attr("r", (d) => { return 0; });
    }

    enterElements(radius){
        this.selection.enter().append("g")
            .attr("transform", (d, i) => { 
                return "translate(" + (radius*2*i) + ",0)";
            })
            .append("circle")
            .attr("cy", (d) => { return this.charHeight*0.5; })
            .attr("cx", (d) => { return radius; })
            .attr("r", (d) => { return radius*0.001; })
            .transition()
            .duration(300)
            .attr("r", (d) => { return radius*d; });
    }

    updateElements(radius){
        this.selection
            .transition()
            .duration(300)
            .attr("transform", (d, i) => { 
                    return "translate(" + (radius*2*i) + ",0)";
            })
            .select("circle")
            .attr("cy", (d) => { return this.charHeight*0.5; })
            .attr("cx", (d) => { return radius; })
            .attr("r", (d) => { return radius*d; });
    }
}