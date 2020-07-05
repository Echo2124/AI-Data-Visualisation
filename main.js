// AI Data Visualisation. Created by Josh S 2020.

// Global Vars
  var mini = true;

function init() {
  console.log("Initialising...");

  var cookies = document.cookie;
  console.log("Cookies: " +cookies)
  if (cookies == "") {
      splashscreen("First time setup! Initialising")
  } else {
    //  splashscreen("Loading")
  }
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

function splashscreen(msg) {
  document.getElementById("splashscreen").style.display = "block";
  var progressbar = document.getElementById("splash-progress");
  var splash_text = document.getElementById("splash-text");
  var curText = splash_text.innerText
  splash_text.innerText = msg;
  var progress = 0;
  // fix up ... animation later
  /*
  var loadanim = setInterval(function() {
    if (splash_text.innerHTML += '.').length == 4)
        splash_text.innerHTML = '';
}, 500);
*/
  setInterval(function () {
    var salt = Math.floor(Math.random() * 10);
    progress += 3 + salt;
    $(progressbar)
    .css("width", progress + "%")
    .attr("aria-valuenow", progress)
    progressbar.setAttribute("aria-valuenow", progress);
    if (progress >= 100) {
      clearInterval(this);
    //  clearInterval(loadanim);
    }
  }, 150)
  setTimeout(function() {
    document.getElementById("splashscreen").classList.add("fadeout-anim")
    setTimeout(function() {
      document.getElementById("splashscreen").style.display = "none";
    }, 500)
  }, 3000)

}


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
        console.log("Called!")
        console.log(data.chartData[0].contents[0].datasets[0].backgroundColor)
        // True = Generate charts; False = Just returns data
        if (state == true) {
        var t = 1;
        for (var i = 0; i < data.chartData.length; i++) {
            generateChart("chart-node-" + t, data.chartData[i])
            t++

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
        console.log("Bang!")
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
      text.innerText = data.contents[0].text;
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
  var data = chart.contents[0].datasets.map(function (j) {
    return j
  })
  var chartOptions = chart.contents[0].options.map(function (a) {
    return a
  })
  console.log(chartOptions)
  var standard_config = {
    // The type of chart we want to create
    type: chart.type,
    // The data for dataset

    data: {
      labels: chart.contents[0].labels,
      datasets: data,

    },

    // Configuration options go here
    options: chartOptions[0],
  }
  var chart = new Chart(ctx, standard_config);
$(targetNode).prepend(currentNode)
}
