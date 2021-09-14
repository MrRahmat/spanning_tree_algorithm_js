var path;

var vertices = [];

// For visual part
var verticesLayer = new Layer();
var edgesLayer = new Layer();
var mstLayer = new Layer();

// Put dot on click and upload coordinates to vertices
function onMouseDown(event) {
  verticesLayer.activate();
  path = new Path();
  path.strokeColor = 'black';

  var circle = new Path.Circle({
    center: event.point,
    radius: 10
  });
  // Light
  circle.strokeColor = 'white';
	circle.fillColor = 'black';

  //Dark
  // circle.strokeColor = 'black';
	// circle.fillColor = 'white';

  // Add coordinates of dot to vertices
  vertices.push(new Vertex(event.point.x, event.point.y));
};

// Compute btn
$('#btn-compute').click(function() {

  if (vertices.length == 0) {
    return;
  }

  // Disable computer and reset buttons until animation is finished
  $('#btn-compute').attr('disabled', true);
  $('#btn-reset').attr('disabled', true);

  primsAlgorithm(vertices, function(mst) {
    if (!mst || typeof mst == 'undefined') {
      return;
    }
    mstLayer.activate();
    mstLayer.removeChildren();
    drawEdges(mst, 0);
  });
  
});

// Reset btn
$('#btn-reset').click(function() {
  verticesLayer.removeChildren();
  mstLayer.removeChildren();
  paper.view.draw();
  vertices = [];
  edges = [];
});

// Recursively draw edges
function drawEdges(mst, i) {
  console.log(mst)
  if (i >= mst.length) {
    $('#btn-compute').attr('disabled', false);
    $('#btn-reset').attr('disabled', false);
    return;
  }

  setTimeout(function() {
    var edge = mst[i];
    var a = new Point(edge.a.x, edge.a.y);
    var b = new Point(edge.b.x, edge.b.y);
    var mstPath = new Path.Line(a, b);
    mstPath.strokeColor = '#3674ff';
    mstPath.strokeWidth = 4;

    drawEdges(mst, i+1);
  }, 50);
}


function primsAlgorithm(vertices, callback) {
  var mst = [];
  var mstVertices = [];

  // Initialize all adjacency lists
  for (var i = 0; i < vertices.length; i++) {
    var current = vertices[i];
    for (var j = 0; j < vertices.length; j++) {
      if (j == i) {
        continue;
      }
      current.addToAdj(new Edge(current, vertices[j]));
    }
  }
  //start with first dot
  mstVertices.push(vertices[0]);

  while (mstVertices.length != vertices.length) {
    var minEdge = false;
    var minEdgeWeight = Number.MAX_VALUE;

    for (var i = 0; i < mstVertices.length; i++) {
      for (var j = 0; j < mstVertices[i].adj.length; j++) {
        var edge = mstVertices[i].adj[j];
        var vertex = edge.b;

        // Found smaller edge weight
        if (edge.weight() < minEdgeWeight) {
          // Make sure that vertex not already in MST
          if (includesVertex(mstVertices, vertex)) {
            continue;
          }

          minEdge = edge;
          minEdgeWeight = edge.weight();
        }
      }
    }

    mstVertices.push(minEdge.b);
    mst.push(minEdge);
  }

  callback(mst);
  return;
}

function includesVertex(vertices, vertex) {
  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].equals(vertex)) {
      return true;
    }
  }
  return false;
}

function includesEdge(edges, edge) {
  for (var i = 0; i < edges.length; i++) {
    if (edges[i].contains(edge.a) && edges[i].contains(edge.b)) {
      return true;
    }
  }
  return false;
}
