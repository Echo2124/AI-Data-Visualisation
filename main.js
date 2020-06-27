// AI Data Visualisation. Created by Josh S 2020.

// Global Vars
  var mini = true;

function init() {
  console.log("Initialising...");
  // test charts
  generateChart("chart-node-1", "")
  generateChart("chart-node-2", "")
  generateChart("chart-node-3", "")
  generateChart("chart-node-4", "")
  generateChart("chart-node-5", "")
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

function appendContainer(id,container) {
  var curContainer = document.getElementById(container);
  var containers = document.getElementsByClassName("main-container");
  for (var i = 0; i < containers.length; i++) {
    containers[i].style.display = "none";
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

function generateChart(nodeName, data) {
  var targetNode = document.getElementById(nodeName)
  var currentNode = document.createElement("canvas");
  currentNode.classList.add("node-graph");
  var ctx = currentNode.getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
});

targetNode.appendChild(currentNode)
}
