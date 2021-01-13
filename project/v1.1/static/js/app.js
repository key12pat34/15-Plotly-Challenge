// ***********************************************************************
// ************ initilizing the drop down menu and homepage **************
// ***********************************************************************

// initilizing the dropdown menu / homepage on load
function initialize(){
  
  // Selects the dropdown menu
  var dropDownMenu = d3.select("#selDataset");

  //  Reading the samples.json file and getting each item
  d3.json('samples.json').then((item) => {
    // printing each item
    console.log(item);

    // for each item.name append each "name" item into the dropdown menu
    item.names.forEach((name) =>{
      dropDownMenu.append("option")
                  .text(name)
                  .property("value", name);
    });

    // getting item.name[0] and initiating the graphs and Demographics Info panel
    let initid = item.names[0];
    console.log(`initial id: ${initid}`);

    plotFunction(initid);
    getinfoFunction(initid);  
  })
};

// sends dropdown menu values to functions 
function optionChanged(value){
  console.log(`optionchanged value: ${value}`);
  getinfoFunction(value);
  plotFunction(value);
};


// **********************************************************************
// ***** Reading the Metadata and building Demographic Info Panel ******
// **********************************************************************

// Demographics panel Function
function getinfoFunction(value){
  
  //reading samples.json file and getting metadata 
  d3.json('samples.json').then((item) => {
    let metaData = item.metadata;
    console.log(metaData);

    // filter metaData by id
    let resultid = metaData.filter((item) => item.id == value)[0];
    console.log(resultid);

    // setup to put data into the #sample-metadata div
    let demographicInfoPanel = d3.select("#sample-metadata");
    demographicInfoPanel.html("");

    // gets data for the id and appends it into the panel
    Object.entries(resultid).forEach(([key, value]) =>{
      demographicInfoPanel.append("h6").text(key.toUpperCase() + ": " + value);
    })
  });
};



// Graphing function
function plotFunction(value){

  d3.json('samples.json').then((item) => {
    console.log(item);

    // ********************************************************
    // ************** BAR CHART *******************************
    // ********************************************************

    // gets sample values for each id active
    let SAMPLE = item.samples.filter((sam) => sam.id == value)[0];
    // console.log(SAMPLE);
    
    // gets the top 10 sample_values and reverses the order per id active
    let sampleValue = SAMPLE.sample_values.slice(0,10).reverse();

    // gets the top 10 otu_ids, reverses, and maps it for labeling purposes
    let otu_id = SAMPLE.otu_ids.slice(0,10).reverse();
    let otu_map = (otu_id).map((id)=> "OTU_"+ id);
    
    //  Otu labels for graph hover texts
    let otu_label = SAMPLE.otu_labels.slice(0,10);


    // Use sample_values as the values for the bar chart.
    // Use otu_ids as the labels for the bar chart.
    // Use otu_labels as the hovertext for the chart.
    
    var bartrace = {type: 'bar',
                    x: sampleValue,
                    y: otu_map,
                    orientation: 'h',
                    text: otu_label
                  };

    var bardata = [bartrace];

    var barlayout = {
      title: 'Top 10 OTUs',
      xaxis:{title: "OTU Count"}
    };

    Plotly.newPlot('bar', bardata, barlayout);


    // ********************************************************
    // ************** BUBBLE CHART ****************************
    // ********************************************************


    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

    var bubbletrace = {
          x: SAMPLE.otu_ids,
          y: SAMPLE.sample_values,
          text: SAMPLE.otu_labels,
          mode: 'markers',
          marker: {
            color: SAMPLE.otu_ids,
            size: SAMPLE.sample_values
          }
    };

    var bubbledata = [bubbletrace];
      
    var bubblelayout = {
      title: "Bubble Chart",
      xaxis:{title: "OTU IDs"},
      yaxis:{title: "Sample Values"},
      showlegend: false,
      height: 600,
      width: 1000
    };
      
    Plotly.newPlot('bubble', bubbledata, bubblelayout);


    // ********************************************************
    // ************** GUAGE CHART ****************************
    // ********************************************************

    // Getting the washing frequency
    let washingfreqresult = item.metadata.filter((item) => {
      return item.id == value
    });

    let washingfreq = washingfreqresult[0].wfreq;
    

    var gaugedata = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(washingfreq),
        title: { text: "Belly button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge:{
          axis: {range: [null, 9]},
          steps: [
            {range: [0,1], color:"black"},
            {range: [1,2], color:"cyan"},
            {range: [2,3], color:"yellow"},
            {range: [3,4], color:"orange"},
            {range: [4,5], color:"violet"},
            {range: [5,6], color:"lime"},
            {range: [6,7], color:"teal"},
            {range: [7,8], color:"blue"},
            {range: [8,9], color:"purple"},
            {range: [9,10], color:"red"},
          ]
        }
      }
    ];
    
    var gaugelayout = {
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 } 
    };
    
    Plotly.newPlot('gauge', gaugedata, gaugelayout);
  });
};

// initilizing the homepage
initialize();



