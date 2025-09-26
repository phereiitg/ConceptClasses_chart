function init() {
  let subject = 'chemistry';
  const API_BASE = window.API_BASE || "http://localhost:8000";
  const $ = go.GraphObject.make;

  const myDiagram = $(go.Diagram, "myDiagramDiv", {
    layout: $(go.TreeLayout, { angle: 0, layerSpacing: 40 }),
    initialContentAlignment: go.Spot.LeftCenter
  });

  // Node template with expand button
  myDiagram.nodeTemplate = $(go.Node, "Auto",
    new go.Binding("isTreeExpanded", "isTreeExpanded"),
    $(go.Shape, "RoundedRectangle", { fill: "lightblue", stroke: "darkblue" }),
    $(go.Panel, "Horizontal",
      $("Button",
        {
          click: function(e, button) {
            const node = button.part;
            if (!node) return;
            const d = node.data;
            if (d._loading) return;

            if (!d.fetched && d.hasChildren) {
              myDiagram.model.setDataProperty(d, "_loading", true);
              fetch(`${API_BASE}/tree/${subject}/children/${d.key}`)
                .then(res => res.json())
                .then(children => {
                  myDiagram.startTransaction("addChildren");
                  children.forEach(c => myDiagram.model.addNodeData(c));
                  myDiagram.model.setDataProperty(d, "fetched", true);
                  myDiagram.commitTransaction("addChildren");

                  myDiagram.model.setDataProperty(d, "_loading", false);
                  myDiagram.model.setDataProperty(d, "isTreeExpanded", true);
                })
                .catch(err => {
                  console.error(err);
                  myDiagram.model.setDataProperty(d, "_loading", false);
                });
            } else {
              myDiagram.model.setDataProperty(d, "isTreeExpanded", !d.isTreeExpanded);
            }
          }
        },
        $(go.TextBlock, new go.Binding("text", "isTreeExpanded", function(e) {
          return e ? "−" : "+";
        }).ofObject())
      ),
      $(go.TextBlock,
        { margin: 6, font: "bold 14px sans-serif", stroke: "black" },
        new go.Binding("text", "name"),
        new go.Binding("stroke", "color")
      )
    )
  );

  // Load root node
  fetch(`${API_BASE}/tree/${subject}/root`)
    .then(r => r.json())
    .then(root => {
      myDiagram.model = new go.TreeModel(root);
    })
    .catch(err => console.error(err));
}

// Run init after DOM is loaded
window.addEventListener("DOMContentLoaded", init);
