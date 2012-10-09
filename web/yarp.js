
function renderPort(port) {
    var uber = $("#port");
    uber.html("");
    var target = $("<div />");
    target.addClass("port-info");
    target.append("<h3>" + port.name + "</h3>");
    if (typeof port.inputs != "undefined") {
	target.append("Inputs: ");
	target.append(port.inputs.join(", "));
	target.append("<br />");
    }
    if (typeof port.outputs != "undefined") {
	target.append("Outputs: ");
	target.append(port.outputs.join(", "));
	target.append("<br />");
    }

    target.append("Address: ");
    var addr = "http://" + port.ip + ":" + port.port_number;
    target.append(" ");
    target.append(port.ip);
    target.append(" ");
    target.append(port.port_number);
    target.append(" ");
    target.append(port.carrier);
    target.append(" (");
    var link_direct = $("<a />");
    link_direct.attr('href', addr);
    link_direct.text("connect");
    target.append(link_direct);
    target.append(")");
    target.append("<br />");

    if (typeof port.responding != "undefined") {
	target.append("Responding: ");
	target.append(port.responding ? "yes" : "no");
	target.append("<br />");
    }

    if (typeof port.update_time != "undefined") {
	target.append("<span class='timestamp'>updated: " + port.update_time + "</span>");
	target.append("<br />");
    }

    uber.append(target);
}

function listPart(port,request,next) {
    $.ajax({
	url: "http://" + port.ip + ":" + port.port_number + request + "?format=json&admin=true",
	dataType: 'json',
	timeout: 2000,
	success: function(data) {
	    port.linker.removeClass("dud");
	    port.responding = true;
	    port.update_time = new Date();
	    next(data);
	},
	error: function() {
	    //alert("Failed to connect to port " + port.name);
	    port.linker.addClass("dud");
	    port.responding = false;
	    port.update_time = new Date();
	}
    });
}

function selectPort(port) {
    renderPort(port);
    listPart(port,"/list/in",function(data) {
	port.inputs = data;
	renderPort(port);
	listPart(port,"/list/out",function(data) {
	    port.outputs = data;
	    renderPort(port);
	})
    });
    $("#port").show();
}


function addPort(port) {
    if (port.carrier=="mcast") return;
    var uber = $("#ports");
    var target = $("<div />");
    var link = $("<a />");
    var addr = "http://" + port.ip + ":" + port.port_number;
    link.attr('href', addr);
    link.text(port.name);
    link.mouseenter(function (e) {
	e.stopPropagation();
	selectPort(port);
	return false;
    });
    link.click(function (e) {
	e.stopPropagation();
	selectPort(port);
	return false;
    });
    target.append(link);
    target.append("<br />");
    uber.append(target);
    port.linker = target;
}

function scanPorts() {
    $.ajax({
	url: "/list?format=json",
	dataType: 'json',
	success: function(data) {
            var key = data.shift();
            if (key!="ports") {
		alert("Failed to get port list");
		return;
	    }
	    $("#ports").html("");
	    for (var i=0; i<data.length; i++) {
		addPort(data[i]);
	    }
	},
	error: function() {
	    alert("Failed to list ports");
	}
    });
}

$(function() {
    scanPorts();
});
