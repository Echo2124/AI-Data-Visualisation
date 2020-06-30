// AI Data Visualisation. Created by Josh S 2020.

// Global Vars
  var mini = true;

function init() {
  console.log("Initialising...");
  // test charts
  /* generateChart("chart-node-1", "")
  generateChart("chart-node-2", "")
  generateChart("chart-node-3", "")
  generateChart("chart-node-4", "")
  generateChart("chart-node-5", "") */
  // Appends overview menu by default when page is loaded
  appendContainer("sidebar-Home", "container-overview");
  fetchChartData(true);
}; init();


function toggleSidebar() {
  if (mini) {
    document.getElementById("mySidebar").style.width = "200px";
    var icon_texts = document.getElementsByClassName("icon-text");
    for (var i = 0; i < icon_texts.length; i++) {
      icon_texts[i].style.display = "initial";
    }
    document.getElementById("main").style.marginLeft = "200px";
    this.mini = false;
  } else {
    // SHOULD COME UP WITH A BETTER SOLUTION TO GROUP MOVE MULTIPLES
    document.getElementById("mySidebar").style.width = "60px";
    var icon_texts = document.getElementsByClassName("icon-text");
    document.getElementById("main").style.marginLeft = "60px";
    document.getElementById("navbar").style.marginLeft = "60px";
    this.mini = true;
    for (var i = 0; i < icon_texts.length; i++) {
      icon_texts[i].style.display = "none";
    }
  }
}

function fetchChartData(state) {
  $(document).ready(function(){
/*    !async function(){
    let data = await fetch("data.json")
        .then((response) => response.json())
        .catch(error => {
            console.error(error);
        });

    console.log(data);
  }();
  */
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        console.log("Length: " + data.chartData.length)
        console.log(data.chartData[0].data)
        // True = Generate charts; False = Just returns data
        if (state == true) {
        //test
        for (var i = 0; i < 6; i++) {
          if (i == 0 ) {

          } else {
          generateChart("chart-node-" + i, data.chartData[0])
        }
        }
      }
        return data;
      })

  });

}

function appendContainer(id,container) {
  var curContainer = document.getElementById(container);
  var containers = document.getElementsByClassName("main-container");
  for (var i = 0; i < containers.length; i++) {
    containers[i].style.display = "none";
    containers[i].addClass
  }
  curContainer.style.display = "initial";
  console.debug("id: " + id)
  $(".material-icons").removeClass("icon-selected")
  switch(id) {
    case "sidebar-Home":
      document.getElementById("icon-Home").classList.add("icon-selected");
    break;
    case "sidebar-About":
      document.getElementById("icon-About").classList.add("icon-selected");
    break;
    case "sidebar-Settings":
      document.getElementById("icon-Settings").classList.add("icon-selected");

  }
}

// TODO: Clean this function up and use a seperate function for fetch the JSON data
function generateNodePanelInfo(NodeID) {
  var node_modal_Title = document.getElementsByClassName("modal-title")[0];
  var node_modal_Body = document.getElementsByClassName("modal-body")[0];

  $(document).ready(function(){
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        switch(NodeID) {
          case "chart-node-1":
            clearMdl()
            setupMdl()
            node_modal_Title.innerText = data.chartData[0].category;
            generateChart("graphCol", data.chartData[0]);
            appendText(NodeID, "textCol", data.chartData[0])
          break;
          case "chart-node-2":
          clearMdl()
          setupMdl()
            node_modal_Title.innerText = data.chartData[1].category;
            generateChart("graphCol", data.chartData[1]);
            appendText(NodeID, "textCol", data.chartData[1])
          break;
          case "chart-node-3":
          clearMdl()
          setupMdl()
            node_modal_Title.innerText = data.chartData[2].category;
            generateChart("graphCol", data.chartData[2]);
            appendText(NodeID, "textCol", data.chartData[2])
          break;
          case "chart-node-4":
          clearMdl()
          setupMdl()
            node_modal_Title.innerText = data.chartData[3].category;
            generateChart("graphCol", data.chartData[3]);
            appendText(NodeID, "textCol", data.chartData[3])
          break;
          case "chart-node-5":
          clearMdl()
          setupMdl()
            node_modal_Title.innerText = data.chartData[4].category;
            generateChart("graphCol", data.chartData[4]);
            appendText(NodeID, "textCol", data.chartData[4])
        }
    })
    function appendText(id, nodeName, data) {
      // adds the divider to the modal
      appendDivider()
      var target = document.getElementById(nodeName);
      var num = id.charAt(id.length - 1);
      console.log("num: " + num)
      var target = document.getElementById(nodeName)
      var text = document.createElement("p");
      text.innerText = data.text;
      target.appendChild(text)
    }

    function appendDivider() {
      var divider = document.createElement("div");
      divider.classList.add("vd");
      document.getElementById("divCol").appendChild(divider)
    }

    function clearMdl() {
      // clears everything-
      node_modal_Title.innerText = "";
        while (node_modal_Body.lastElementChild) {
          node_modal_Body.removeChild(node_modal_Body.lastElementChild);
        }
    }

    function setupMdl() {
      // generate grid
      var container = document.createElement("div");
      container.classList.add("container");
      container.classList.add("grid-container")
      var row = document.createElement("div");
      row.classList.add("row");
      var firstCol = document.createElement("div");
      firstCol.classList.add("col-12");
      firstCol.classList.add("col-md-8");
      firstCol.id = "graphCol";
      var secondCol = document.createElement("div");
      secondCol.classList.add("col-md-auto");
      secondCol.id = "divCol";
      var thirdCol = document.createElement("div");
      var infoTitle = document.createElement("h3");
      var divider = document.createElement("hr");
      divider.id = "mdl-h-divider"
      infoTitle.innerText = "Information";
      thirdCol.classList.add("col-3");
      thirdCol.classList.add("col-md-3")
      thirdCol.id = "textCol";
      thirdCol.appendChild(infoTitle);
      thirdCol.appendChild(divider)
      row.appendChild(firstCol);
      row.appendChild(secondCol);
      row.appendChild(thirdCol);
      container.appendChild(row);
      node_modal_Body.appendChild(container);
    }
  });
}


function generateChart(nodeName, chart) {
  var targetNode = document.getElementById(nodeName)
  var currentNode = document.createElement("canvas");
  currentNode.classList.add("node-graph");
  var ctx = currentNode.getContext('2d');
  var config = {
    // The type of chart we want to create
    type: chart.type,

    // The data for our dataset
    data: {
        labels: chart.labels,
        datasets: [{
            label: chart.label,
            backgroundColor: chart.backgroundColor,
            borderColor: chart.borderColor,
            data: chart.data
        }]
    },

    // Configuration options go here
    options: {}
  }
  var chart = new Chart(ctx, config);

$(targetNode).prepend(currentNode)
}
