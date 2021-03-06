configs.prosym01 = {
 nodes: {
  styleEncoding: {
    size: {
      attr: "",
      range: [10, 20],
      scaleType: "linear"
    }
  }
},

edges: {
  styleEncoding: {
    size: {
      attr: "weight",
      range: [.5, 2]
    }
  }
},
    identifier: "id", //Unique identifier
    lat: "lat",
    lng: "lng",
    categories: ["cutZip"]
  }
  dataprep.prosym01 = function(ntwrk) {
    geo = 0;
    notgeo = 0;
    prosym01.isPopupShowing = false;  
    ntwrk.map={}


    if (ntwrk.DataService.mapDatasource[ntwrk.attrs.ngDataField].toProcess) {
      var processedData = processAuthorSpec(ntwrk.filteredData);
      ntwrk.filteredData.nodes = processedData.nodes;
      ntwrk.filteredData.edges = processedData.edges;
    }

    ntwrk.filteredData.nodes.data.forEach(function(d, i) {
      d.cutZip = d.zip.toString().slice(0, 4);
    });


    ntwrk.PrimaryDataAttr = "nodes";
    ntwrk.filteredData.authors.data.forEach(function(d,i){

      if((d.lat!=null) 
        && (d.lng!=null))
      {
        geo++;
        d.type="Feature";
        d.id = i;
        d.properties = {};
        d.geometry = {};
        d.properties.LAT = d.lat;
        d.properties.LON = d.lng;

        d.geometry.type="Point";
        d.geometry.coordinates=[]
        d.geometry.coordinates[0] =  d.lng;
        d.geometry.coordinates[1] =  d.lat;   

      }
      else
      {
        notgeo++;
        d.type="Feature";
        d.id = i;
        d.properties = {};
        d.geometry = {};
        d.properties.LAT = 0;
        d.properties.LON = 0;

        d.geometry.type="Point";
        d.geometry.coordinates=[]
        d.geometry.coordinates[0] =  0;
        d.geometry.coordinates[1] =  0;


      }

      ntwrk.map[d.idd] = d.author;



      })




  ntwrk.filteredData.authors.data.forEach(function(d1,i1){// $("#zip-name").text(d.key + "_");
  tableData = [];
   ntwrk.filteredData.records.data.forEach(function(d2, i2) {

    d2.author_ids.forEach(function(idd){
              if (idd == d1.idd ) {
                      var authNames = [];
                      d2.author_ids.forEach(function(d3, i3) {
                          authNames.push(ntwrk.filteredData.authors.data.find(function(d4, i4) {
                              return d4.idd == d3;
                          }).author)
                      })
                              tableData.push({
                          authors: authNames.join("; "),
                          year: d2.year,
                          title: d2.title,
                          journal: d2.journal
                      })

                          } 
        })
  })


   d1.tableD = tableData;

 })


    document.getElementById("geocoded").innerHTML = geo;
    document.getElementById("notgeocoded").innerHTML = notgeo;
    ntwrk.filteredData.arcs = [];
     //i=0;
     ntwrk.filteredData.edges.data.forEach(function(d){


      if((ntwrk.filteredData.authors.data[d.source].latitude!=null) 
        && (ntwrk.filteredData.authors.data[d.source].longitude!=null)
        && (ntwrk.filteredData.authors.data[d.target].latitude!=null)
        &&  (ntwrk.filteredData.authors.data[d.target].longitude!=null))
      {
        d.flow = 1;
      }
      else d.flow = 1;

    })





   }
   events.prosym01 = function(ntwrk) {

        nodeSize.setTitle("Node Degree")
        nodeSize.setNote("Based on zoom level (" + Utilities.round(ntwrk.zoom.scale(), 1) + "x)")
        nodeSize.updateNodeSize(configs.prosym01.nodes.styleEncoding.size.range);
        nodeSize.updateTextFromFunc(function(d) {
            return prosym01.Scales.nodeSizeScale(d) / ntwrk.zoom.scale();
        });



   }