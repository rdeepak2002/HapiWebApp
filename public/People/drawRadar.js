function draw(className, anger, disgust, fear, joy, sadness) {      
      var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(428, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);


      var data = [
          [
            {axis:"Anger",value:anger},
            {axis:"Disgust",value:disgust},
            {axis:"Fear",value:fear},
            {axis:"Joy",value:joy},
            {axis:"Sadness",value:sadness}
          ]
        ];


      var color = d3.scale.ordinal()
        //.range(["#EDC951","#CC333F","#00A0B0"]);
        .range(["#51D2B7","#CC333F","#00A0B0"]);
        
      var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 1.0,
        levels: 4,
        roundStrokes: false,
        color: color
      };
      //Call function to draw the Radar chart
      RadarChart(className, data, radarChartOptions);
}