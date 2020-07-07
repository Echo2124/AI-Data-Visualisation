// AI Data Visualisation. Created by Josh S 2020.
// Global Vars
var mini = true;
var default_config = {
	style: "dark", // options = dark, light
	gradient: "default", // options = default...
	loading_screen_anim: "particle", // options = polygonal, particle
	night_mode: true
}

function init() {
	console.log("Initialising...");
	var cookies = document.cookie;
	var cookies_state;
	console.log("Cookies: " + cookies)
	if (cookies == "") {
		splashscreen("First time setup! Initialising", default_config.loading_screen_anim)
		append_settings(default_config);
		cookies_state = false;
	} else {
    splashscreen("Loading", fetchCustomSettings("settings").loading_screen_anim)
		append_settings(fetchCustomSettings("settings"));
	}
	// Appends overview menu by default when page is loaded
	appendContainer("sidebar-Home", "container-overview");
	fetchChartData(true);
	document.getElementById("discard").addEventListener("click", function () {
		if (cookies_state == false) {
			// overrides existings settings with default as there are no custom settings
			append_settings(default_config)
		} else {
			append_settings(fetchCustomSettings)
		}
	}, false)

	document.getElementById("apply").addEventListener("click", writeCustomSettings, false);
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
  document.cookie = "settings=" + JSON.stringify(config_object);
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
	if (mini) {
		document.getElementById("mySidebar").style.width = "200px";
		var icon_texts = document.getElementsByClassName("icon-text");
		for (var i = 0; i < icon_texts.length; i++) {
			icon_texts[i].style.display = "initial";
		}
		document.getElementById("main").style.marginLeft = "200px";
		this.mini = false;
	} else {
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
	$(document).ready(function () {
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

function appendContainer(id, container) {
	var curContainer = document.getElementById(container);
	var containers = document.getElementsByClassName("main-container");
	for (var i = 0; i < containers.length; i++) {
		containers[i].style.display = "none";
		containers[i].addClass
	}
	curContainer.style.display = "initial";
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

// TODO: Clean this function up and use a seperate function for fetch the JSON data
function generateNodePanelInfo(NodeID) {
	var node_modal_Title = document.getElementsByClassName("modal-title")[0];
	var node_modal_Body = document.getElementsByClassName("modal-body")[0];

	$(document).ready(function () {
		fetch('data.json')
			.then(response => response.json())
			.then(data => {
				console.log("Bang!")
				switch (NodeID) {
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
