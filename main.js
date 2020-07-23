// AI Data Visualisation. Created by Josh S 2020.

/*
Purpose: This handles most of the functionality behind the website
Current state: this code is mostly functional however it is not neat.
Meaning that a rewrite of specific areas could be needed in order to make it run more smoothly.

More important notes:
Create a backup of current dependecies in local repository if remote ones are unable to be accessed
might to create a single function to retreive json information instead of using two in order to streamline code.
*/

/* candidate chart colours

#E05759,#4D89CA,#149B51,#D66A31
*/

// Global Vars
var sidebar_mini = true;
var default_config = {
	style: "dark", // options = dark, light
	gradient: "default", // options = default...
	loading_screen_anim: "particle", // options = polygonal, particle
	night_mode: true
}
// used as a simple cache for later uses of the data such as the node panels
var dataCache;

function init() {
		$(document).ready(function () {
	console.log("Initialising...");
	var cookies = document.cookie;
	var cookies_state;
	console.log("Cookies: " + cookies)
	if (cookies == "null" || cookies == "" || cookies == null) {
		splashscreen("First time setup! Initialising", default_config.loading_screen_anim)
		append_settings(default_config);
		cookies_state = false;
	} else {
    splashscreen("Loading", fetchCustomSettings("settings").loading_screen_anim)
		append_settings(fetchCustomSettings("settings"));
	}
	// Appends overview menu by default when page is loaded
	appendContainer("sidebar-Home", "container-overview");
		if (window.location.protocol !== "file:") {
			// typical method
				fetchJSONdata()
		} else {
			// alt method
			getLocalJSONData()
		}
	document.getElementById("discard").addEventListener("click", function () {
		if (cookies_state == false) {
			// overrides existings settings with default as there are no custom settings
			append_settings(default_config)
		} else {
			append_settings(fetchCustomSettings("settings"))
		}
		appendContainer("sidebar-Home", "container-overview");
	}, false)
	prepNodePanels();
	document.getElementById("apply").addEventListener("click", writeCustomSettings, false);
	});
};
init();

	// grabs from cookies
  function fetchCustomSettings(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
      }
      return null;
  }
	// Note: Might want to check for an invalid cookie here then lodge warning then go back to default settings

function append_settings(config) {
	document.getElementById("themes").value = config.style;
	document.getElementById("gradient").value = config.gradient;
	document.getElementById("load_screen").value = config.loading_screen_anim;
	document.getElementById("night_mode").checked = config.night_mode;
	apply_settings(config);
}

function writeCustomSettings() {
  console.log("Writing Custom Settings...");
  var opt_themes = document.getElementById("themes").value;
  var opt_gradient = document.getElementById("gradient").value;
  var opt_load = document.getElementById("load_screen").value;
  var opt_night_mode = document.getElementById("night_mode").checked;
  var config_object = {
    "style":opt_themes,
    "gradient":opt_gradient,
    "loading_screen_anim": opt_load,
    "night_mode": opt_night_mode
  };
  var cur = new Date();
  cur.setFullYear(cur.getFullYear() + 1);
  document.cookie = "settings=" + JSON.stringify(config_object) + ";" + "expires=" + cur.toUTCString();
  location.reload();
}

function apply_settings(config) {

	// apply settings here
	var panels = [
		"navbar",
		"mySidebar",
		"chart-node-1",
		"chart-node-2",
		"chart-node-3",
		"chart-node-4",
		"chart-node-5",
		"about",
		"settings-con",
		"theme-settings",
		"adv-settings",
		"bottom-credits"
	];

	switch (config.style) {
	case "dark":
		for (var i = 0; i < panels.length; i++) {
			document.getElementById(panels[i]).classList.add("dark_panels");
		}
		break;
	case "white":
		for (var i = 0; i < panels.length; i++) {
			document.getElementById(panels[i]).classList.add("light_panels");
		}
	}

	switch (config.gradient) {
	case "default":
		document.getElementsByTagName("body")[0].classList.add("default_gradient");
		break;
		// set to whatever other gradient
	case "white":
		for (var i = 0; i < panels.length; i++) {
			document.getElementById(panels[i]).classList.add("light_panels");
		}
	}
	if (config.night_mode == true) {
		var offset = 0; // offset value (for testing)
		var today = new Date();
		var time = today.getHours()
			// changes at 6:00pm
		if (time >= 18) {
			for (var i = 0; i < panels.length; i++) {
				document.getElementById(panels[i]).classList.add("dark_panels");
			}
		}
	};
};

function resetWebsite() {
  console.log("Resetting website...");
  document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload();
};


// point of the splashscreen is to allow time for the interface to properly load-in
function splashscreen(msg, effect) {
  var temp_object = {};
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

	// MIGHT WANT TO DESTROY THESE OBJECTS AFTER SPLASHSCREEN HAS STOPPED AS THEY USE RESOURCES WHICH COULD BE FREED.
	switch (effect) {
	case "particle":
		$(document).ready(function () {
		temp_object.particle =	$('.splash_anim_bg').animatedbg({
				colors: ["#7dcbd4", "#fdc014", "#acd573", "#fff"],
				numParticles: 50
			});
		});
		break;
	case "polygonal":
		var target = document.getElementById("splashscreen")
		var canvas = document.createElement("canvas");
		canvas.id = "splash_canvas";
		canvas.style.position = "fixed"
		canvas.style.zIndex = "3"
		canvas.style.minHeight = "100%";
		canvas.style.minWidth = "100%";
		$(target).prepend(canvas);
		console.log("Loading Screen Style = Polygonal")
		$('#splash_canvas').particles();
	temp_object.polygonal = $('#splash_canvas').particles({
			connectParticles: true,
			color: '#ffffff',
			size: 3,
			maxParticles: 80,
			speed: 1.8
		});
		break;
	}

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
	setTimeout(function () {
		document.getElementById("splashscreen").classList.add("fadeout-anim")
		setTimeout(function () {
			document.getElementById("splashscreen").style.display = "none";
		}, 500)

    // Purges the objects that belong to the splashscreen
    delete temp_object.polygonal;
    delete temp_object.particle;
	}, 3000)
}


function toggleSidebar() {
	if (sidebar_mini) {
		document.getElementById("mySidebar").style.width = "200px";
		var icon_texts = document.getElementsByClassName("icon-text");
		for (var i = 0; i < icon_texts.length; i++) {
			icon_texts[i].style.display = "initial";
		}
		document.getElementById("main").style.marginLeft = "200px";
		this.sidebar_mini = false;
	} else {
		// Note might wanna create a class for this and just add the class to the elements instead to clean up the code
		document.getElementById("mySidebar").style.width = "60px";
		var icon_texts = document.getElementsByClassName("icon-text");
		document.getElementById("main").style.marginLeft = "60px";
		document.getElementById("navbar").style.marginLeft = "60px";
		this.sidebar_mini = true;
		for (var i = 0; i < icon_texts.length; i++) {
			icon_texts[i].style.display = "none";
		}
	}
}


// If the website is running locally using file uri protocol
function getLocalJSONData() {
	$('#local-client').modal('toggle');
	var btnConfirm = document.getElementById("local-confirm").addEventListener("click", function() {
	var input = document.createElement('input');
input.type = 'file';
input.setAttribute("accept", ".json");
input.onchange = e => {
var file = e.target.files[0];
var reader = new FileReader();
reader.readAsText(file,'UTF-8');
reader.onload = readerEvent => {
var content = JSON.parse(readerEvent.target.result)
// caches data for future uses in current session
dataCache = content;
		var t = 1;
		for (var i = 0; i < content.chartData.length; i++) {
			generateChart("chart-node-" + t, content.chartData[i])
			t++
		}
}
}
input.click();
	}, false);
}


// If the website is hosted on a server then use this method
function fetchJSONdata() {
	$(document).ready(function () {
					console.log("Detected on running on server");
					fetch('data.json')
  				.then(response => response.json())
  				.then(data => {
						var t = 1;
						for (var i = 0; i < data.chartData.length; i++) {
							generateChart("chart-node-" + t, data.chartData[i])
							t++
						}
						dataCache = data;
					});
			console.log("Jsondata value:")
})
}

function appendContainer(id, container) {
	var curContainer = document.getElementById(container);
	var containers = document.getElementsByClassName("main-container");
	for (var i = 0; i < containers.length; i++) {
		containers[i].style.display = "none";
		containers[i].addClass
	}
	if (window.location.protocol == "file:" && container == "container-settings") {
		console.log("trigger")
		// trigger modal
		$("#local-client-settings").modal('show');
			curContainer.style.display = "initial";
} else {
	curContainer.style.display = "initial";
}
	console.debug("id: " + id)
	$(".material-icons").removeClass("icon-selected")
	switch (id) {
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

function prepNodePanels() {
	console.log("Testing")
	var charts = document.getElementsByClassName("node-containers");
for (var i = 0; i < charts.length; i++) {
	charts[i].addEventListener("dblclick", function(e) {
		var chart = e.currentTarget.id;
		console.log(chart)
		$('#node-panel').modal('show');
		generateNodePanelInfo(chart);
	}, false)
}
	// prep for double click
}

// TODO: Clean this function up and use a seperate function for fetch the JSON data
function generateNodePanelInfo(NodeID) {
	console.log("Generate panel")
	console.log("THis is node id" + NodeID)
	var data = dataCache;
	// check if there is any cached local data
	var node_modal_Title = document.getElementsByClassName("modal-title")[0];
	var node_modal_Body = document.getElementsByClassName("modal-body")[0];
	console.log("Displaying data:");
// call fetch data function
				switch (NodeID) {
				case "chart-node-1":
					setupMdl()
					node_modal_Title.innerText = data.chartData[0].category;
					generateChart("graphCol", data.chartData[0]);
					appendText(NodeID, "textCol", data.chartData[0])
					break;
				case "chart-node-2":
					setupMdl()
					node_modal_Title.innerText = data.chartData[1].category;
					generateChart("graphCol", data.chartData[1]);
					appendText(NodeID, "textCol", data.chartData[1])
					break;
				case "chart-node-3":
					setupMdl()
					node_modal_Title.innerText = data.chartData[2].category;
					generateChart("graphCol", data.chartData[2]);
					appendText(NodeID, "textCol", data.chartData[2])
					break;
				case "chart-node-4":
					setupMdl()
					node_modal_Title.innerText = data.chartData[3].category;
					generateChart("graphCol", data.chartData[3]);
					appendText(NodeID, "textCol", data.chartData[3])
					break;
				case "chart-node-5":
					setupMdl()
					node_modal_Title.innerText = data.chartData[4].category;
					generateChart("graphCol", data.chartData[4]);
					appendText(NodeID, "textCol", data.chartData[4])
				}

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


		function appendTabs() {
			var header = document.createElement("div");
			header.classList.add("btn-group");
			header.setAttribute("role", "group");
			header.setAttribute("aria-label", "View Switch")
			var tab_1 = document.createElement("button");
			tab_1.classList.add("btn");
			tab_1.classList.add("btn-secondary");
			tab_1.classList.add("active");
			tab_1.setAttribute("type", "button");
			tab_1.innerText = "Graph";
			var tab_2 = document.createElement("button");
			tab_2.classList.add("btn");
			tab_2.classList.add("btn-secondary");
			tab_2.setAttribute("type", "button");
			tab_2.innerText = "Table";
			tab_1.addEventListener("click", function() {
				// add table here
				var table;
				var graph = document.querySelector("#graphCol > canvas:nth-child(2)");
				graph.style.display = "unset"
				// might need to check if tab_1 is still selected in order to avoid running this unnecessarily
			}, false)
			tab_2.addEventListener("click", function() {
				// add table here
				var table;
				var graph = document.querySelector("#graphCol > canvas:nth-child(2)")
				console.log(graph)
				graph.style.display = "none";
				console.log("tab 2 hit")
			}, false)
			header.appendChild(tab_1);
			header.appendChild(tab_2);
			node_modal_Body.appendChild(header);
		};

		function clearMdl() {
			// clears everything-
			node_modal_Title.innerText = "";
			while (node_modal_Body.lastElementChild) {
				node_modal_Body.removeChild(node_modal_Body.lastElementChild);
			}
		}

		function setupMdl() {
			clearMdl();
			appendTabs();
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
}


function generateChart(nodeName, chart) {
	var targetNode = document.getElementById(nodeName)
	var currentNode = document.createElement("canvas");
	currentNode.classList.add("node-graph");
	//currentNode.responsive = true;
	var ctx = currentNode.getContext('2d');
	var data = chart.contents[0].datasets.map(function (j) {
		return j
	})
	var chartOptions = chart.contents[0].options.map(function (a) {
		console.log(a)
		return a
	})
	console.log(chartOptions)
	var config = {
		// The type of chart we want to create
		type: chart.type,
		// The data for dataset

		data: {
			labels: chart.contents[0].labels,
			datasets: data,

		},

	options: {
legend: {
    	display: false
    },
        title: {
            display: true,
            text: chart.category,
			position: "top",
			fontSize: 18
        }
    }
		// Configuration options go here
	}
	Chart.defaults.global.defaultFontFamily = "Quicksand"
	Chart.defaults.global.defaultFontStyle	= "normal"
	Chart.defaults.global.defaultFontColor = "#ffffff"
	var chart = new Chart(ctx, config);
	$(targetNode).prepend(currentNode)
}
