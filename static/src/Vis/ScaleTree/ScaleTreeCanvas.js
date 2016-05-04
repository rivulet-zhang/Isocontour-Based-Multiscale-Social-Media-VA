ScaleTreeCanvas = function(){

	this.canvas = null;

	this.scaleBounds = [];

	this.init();
}

ScaleTreeCanvas.prototype.init = function() {
	
	this.canvas = d3.select(ScaleTreeCanvas.div)
			    	.append("svg")
			    	.attr("id", "ScaleTreeCanvasSvg")
			    	.attr("width", ScaleTreeCanvas.width)
			    	.attr("height", ScaleTreeCanvas.height)
			    	;
};

ScaleTreeCanvas.prototype.setBbox = function(){

	var level = DataCenter.instance().getTree().getHeight();

	var centerX = ScaleTreeCanvas.width/2;
	var centerY = ScaleTreeCanvas.height / level / 2;
	var w = ScaleTreeCanvas.width/2 - ScaleTreeCanvas.treeMarginX;
	var h = ScaleTreeCanvas.height / level / 2;

	//initial bbox
	var bbox = new BBox(centerX, centerY, w, h);
	DataCenter.instance().getTree().setBbox(bbox);

};

ScaleTreeCanvas.prototype.drawRect = function(id, bbox){

	var that = this;

	var node = DataCenter.instance().getTree().getNodeById(id);
	var color = statColor()(node.cluster['score']);
	//draw node;
	var rectangle = this.canvas.append("rect")
								.attr("id", "node_"+id)
								.attr("class", "treeNode")
	                            .attr("x", bbox.getLeft())
	                            .attr("y", bbox.getTop())
	                            .attr("width", bbox.getWidth())
	                            .attr("height", bbox.getHeight())
	                            .attr("stroke", ScaleTreeCanvas.nodeStroke)
	                            .attr("fill", color)
	                            .on("click", function(){
	                            	alert(this.id);
	                            })
	                            // .on("mouseover", function(){
	                            // 	$('[ng-controller="app_controller"]').scope().addHlNode(id);
	                            // })
	                            // .on("mouseout", function(){
	                            // 	$('[ng-controller="app_controller"]').scope().removeHlNode(id);
	                            // })
	                            .on('contextmenu', d3.contextMenu(that.get_menu(id)) );
};

ScaleTreeCanvas.prototype.get_menu = function(id){

	var that = this;

	var menu = [
		{
			title: 'set',
			action: function() {
	            $('[ng-controller="app_controller"]').scope().addHlNode(id);
			}
		},
		{
			title: 'unset',
			action: function() {
				$('[ng-controller="app_controller"]').scope().removeHlNode(id);
			}
		},
		{
			title: 'moveTo',
			action: function() {

				var node = DataCenter.instance().getTree().getNodeById(id);

				$('[ng-controller="map_controller"]').scope().getMap().moveTo(node.cluster.center.lon, node.cluster.center.lat, node.cluster.zoom);
			}
		},
		{
			title: 'cancel',
			action: function() {
			}
		}
	];

	return menu;

};

//two methods to draw edge in the tree:
ScaleTreeCanvas.prototype.drawBCurve = function(pid, cid, pts){

	var lineType = ScaleTreeCanvas.linkType == 0 ? 'basis' : 'linear';

	var lineFunction = d3.svg.line()
		                      .x(function(d) { return d[0]; })
		                      .y(function(d) { return d[1]; })
		                      .interpolate(lineType);
    
    var lineGraph = this.canvas.append("path")
    							.attr("id", "link__"+pid+"__"+cid)
    							.attr("class", "treeLinkage")
		                        .attr("d", lineFunction(pts))
		                        .attr("stroke", ScaleTreeCanvas.linkStroke)
		                        .attr("stroke-width", 1)
		                        .attr("fill", "none")
		                        .attr("opacity", 1);

};

ScaleTreeCanvas.prototype.drawScaleBound = function(){

	var init_level = case_study[default_case].startLevel + case_study[default_case].zoom;
	var end_level = case_study[default_case].endLevel + case_study[default_case].zoom;
	var level = end_level - init_level + 1;

	for(var i=init_level; i<=end_level; i++){

		var yMargin = 5;

		var centerX = ScaleTreeCanvas.width/2;
		var centerY = ScaleTreeCanvas.height / level * (i - init_level + 0.5);
		var w = ScaleTreeCanvas.width/2;
		var h = ScaleTreeCanvas.height / level * 0.5 - yMargin;
		
		var bbox = new BBox(centerX, centerY, w, h);

		var color = contourColorFill()(i);
		var opac = 0.2;

		/**************************************************/
		/***********mode 1: entire fill********************/
		/**************************************************/

		// this.canvas.append("rect")
  //                   .attr("x", bbox.getLeft())
  //                   .attr("y", bbox.getTop())
  //                   .attr("width", bbox.getWidth())
  //                   .attr("height", bbox.getHeight())
  //                   .attr("stroke", color)
  //                   .attr("fill", color)
  //                   .attr("stroke-width", 1)
  //                   .attr("opacity", 0.3);


  		/**************************************************/
		/***********mode 2: side-by-side box***************/
		/**************************************************/

		var bw = 5;
		var boxLeft = new BBox(centerX * bw / w, centerY, bw, h);
		var boxRight = new BBox( 2*w - centerX * bw / w, centerY, bw, h);

		this.canvas.append("rect")
	                  .attr("x", boxLeft.getLeft())
	                  .attr("y", boxLeft.getTop())
	                  .attr("width", boxLeft.getWidth())
	                  .attr("height", boxLeft.getHeight())
	                  .attr("stroke", color)
	                  .attr("fill", color)
	                  .attr("stroke-width", 1)
	                  .attr("opacity", 0.3);

	    this.canvas.append("rect")
	                  .attr("x", boxRight.getLeft())
	                  .attr("y", boxRight.getTop())
	                  .attr("width", boxRight.getWidth())
	                  .attr("height", boxRight.getHeight())
	                  .attr("stroke", color)
	                  .attr("fill", color)
	                  .attr("stroke-width", 1)
	                  .attr("opacity", 0.3);
		
		/**************************************************/
		/***********mode 3: color gradient******************/
		/**************************************************/
		
        //mode 3: color gradient;
  //       var gradient = this.canvas.append("defs")
		//   .append("linearGradient")
		//     .attr("id", "backGrad")
		//     .attr("x1", "0%")
		//     .attr("x2", "100%")
		//     .attr("spreadMethod", "pad");

		// gradient.append("stop")
		//     .attr("offset", "0%")
		//     .attr("stop-color", color)
		//     .attr("stop-opacity", opac);

		// gradient.append("stop")
		//     .attr("offset", "5%")
		//     .attr("stop-color", "#fff")
		//     .attr("stop-opacity", opac);

		// gradient.append("stop")
		//     .attr("offset", "95%")
		//     .attr("stop-color", "#fff")
		//     .attr("stop-opacity", opac);

		// gradient.append("stop")
		//     .attr("offset", "100%")
		//     .attr("stop-color", color)
		//     .attr("stop-opacity", opac);

		// this.canvas.append("rect")
		// 			.attr("x", bbox.getLeft())
		// 			.attr("y", bbox.getTop())
		// 			.attr("width", bbox.getWidth())
		// 			.attr("height", bbox.getHeight())
		// 		    .style("fill", "url(#backGrad)");

	}

};


ScaleTreeCanvas.prototype.drawNode = function(){

	this.setBbox();
	DataCenter.instance().getTree().drawNode();

	this.hoverNode();
};

ScaleTreeCanvas.prototype.drawBgRect = function(bbox){

	var that = this;

	var color = "#ccc";
	//draw node;
	var rectangle = this.canvas.append("rect")
								.attr("class", "nodeBG")
	                            .attr("x", bbox.getLeft())
	                            .attr("y", bbox.getTop())
	                            .attr("width", bbox.getWidth())
	                            .attr("height", bbox.getHeight())
	                            .attr("stroke", "none")
	                            .attr("fill", color)
	                            .attr("fill-opacity", 0.4);      
};

ScaleTreeCanvas.prototype.drawBackground = function(){

	var acNodes = $('[ng-controller="app_controller"]').scope().getAcNodes();	
	DataCenter.instance().getTree().drawBackground(acNodes);

};

ScaleTreeCanvas.prototype.hoverNode = function(){

	var acNodes = $('[ng-controller="app_controller"]').scope().getAcNodes();
	var hlNodes = $('[ng-controller="app_controller"]').scope().getHlNodes();

	var defaultOpac = 0.3;
	var hlOpac = 1.0;

	d3.selectAll(".treeNode")
		.attr("stroke-opacity", defaultOpac)
		.attr("fill-opacity", defaultOpac);

	acNodes.forEach(function(val){
		
		d3.select("#node_"+val)
			.attr("stroke-opacity", hlOpac)
			.attr("fill-opacity", hlOpac);
	});

	// hlNodes = intersect_arrays(acNodes, hlNodes);

	// hlNodes.forEach(function(val){
		
	// 	d3.select("#node_"+val)
	// 		.attr("stroke-opacity", hlOpac)
	// 		.attr("fill-opacity", hlOpac);
	// });

};


ScaleTreeCanvas.prototype.drawLinkage = function(){

	DataCenter.instance().getTree().drawLinkage();

	this.hoverLinkage();
};

ScaleTreeCanvas.prototype.hoverLinkage = function(){
	
	var acNodes = $('[ng-controller="app_controller"]').scope().getAcNodes();
	var hlNodes = $('[ng-controller="app_controller"]').scope().getHlNodes();

	var defaultOpac = 0.3;
	var hlOpac = 1.0;

	d3.selectAll(".treeLinkage")
		.attr("stroke-opacity", function(){
			
			var tks = this.id.split("__");
			var pid = tks[1];
			var cid = tks[2];
			if( acNodes.indexOf(pid) != -1 && acNodes.indexOf(cid) != -1 )
				return hlOpac;
			else
				return defaultOpac;

		})
		.attr("fill-opacity", function(d){

			var tks = this.id.split("__");
			var pid = tks[1];
			var cid = tks[2];
			if( acNodes.indexOf(pid) != -1 && acNodes.indexOf(cid) != -1 )
				return hlOpac;
			else
				return defaultOpac;

		});


};

ScaleTreeCanvas.prototype.update = function(){

	//clear canvas;
	this.canvas.selectAll("*").remove();

	this.drawScaleBound();
	
	//this.drawBackground();

	this.drawNode();
	this.drawLinkage();

};

ScaleTreeCanvas.width = 700;
ScaleTreeCanvas.height = 500;
ScaleTreeCanvas.nodeHeight = 40;
ScaleTreeCanvas.div = "#ScaleTreeCanvasView";

ScaleTreeCanvas.treeMarginX = 30;

ScaleTreeCanvas.hLNodeStroke = "#313695";
ScaleTreeCanvas.hLNodeFill = "#abd9e9";

ScaleTreeCanvas.nodeStroke = "#4575b4";
ScaleTreeCanvas.nodeFill = "#e0f3f8";

ScaleTreeCanvas.deAcNodeStroke = "#737373";
ScaleTreeCanvas.deAcNodeFill = "#f7f7f7";

ScaleTreeCanvas.linkStroke = "#b2182b";
ScaleTreeCanvas.linkType = 1; // 0 for B curve, 1 for linear line;


ScaleTreeCanvas.NODE_VIS_MODE = { GEO_FILTER:0, STAT:1 };

ScaleTreeCanvas.node_vis = ScaleTreeCanvas.NODE_VIS_MODE.GEO_FILTER;

/***********************************************************************************/