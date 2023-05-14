var edge_list_data = "";
var imageContainer2 = document.getElementById("imageContainer");
class Graph {
    constructor() {
        this.AdjList = new Map();
        this.weightedAdjList = new Map();
    }
    addVertex(v) {
        this.AdjList.set(v, []);
        this.weightedAdjList.set(v, []);
    }
    addEdge(v, w) {
        if (edge_list_data != "") {
            edge_list_data += '\n';
        }
        edge_list_data += document.getElementById(v).innerHTML;
        edge_list_data += ' ';
        edge_list_data += document.getElementById(w).innerHTML;
        this.AdjList.get(v).push(w);
        this.AdjList.get(w).push(v);
    }
    addWeightedEdge(v, w, weight) {
        this.weightedAdjList.get(v).push({ node: w, weight: weight });
        this.weightedAdjList.get(w).push({ node: v, weight: weight });
    }
}
var g = new Graph();

let playground = document.getElementById('playground');
console.log(document);
let startEdgeX, startEdgeY, endEdgeX, endEdgeY, node1, node2;
let currentState = 0;
let currentNodeCount = 1;
let isDijkstra = 0;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function drawline() {
    let line = document.createElement('div');
    let xmid = (startEdgeX + endEdgeX) / 2;
    let ymid = (startEdgeY + endEdgeY) / 2;
    let distance = Math.sqrt((endEdgeY - startEdgeY) * (endEdgeY - startEdgeY) + (endEdgeX - startEdgeX) * (endEdgeX - startEdgeX));
    let leftval = xmid - distance / 2
    line.setAttribute('class', 'edge');
    line.style.left = leftval.toString() + 'px';
    line.style.top = ymid.toString() + 'px';
    line.style.width = distance.toString() + 'px';

    line.setAttribute('id', node1 + '_' + node2);
    if (isDijkstra) {
        let newButton = document.createElement('button');
        newButton.innerHTML = 'Add Value';
        newButton.setAttribute('id', 'value-trigger');
        document.getElementById('buttons').appendChild(newButton);
        let weight = document.createElement('h1');
        let valueTrigger = document.getElementById('value-trigger');
        valueTrigger.addEventListener('click', async () => {
            let value = document.getElementById('value');
            weight.innerHTML = value.value;
            console.log(Number(value.value));
            line.appendChild(weight);
            console.log(value.value);
            g.addWeightedEdge(node1, node2, Number(value.value));
            let slopeinRadian = Math.atan2(endEdgeY - startEdgeY, endEdgeX - startEdgeX);
            let slopeinDegree = (slopeinRadian * 180) / Math.PI;
            line.style.transform = "rotate(" + slopeinDegree + "deg)";
            await playground.appendChild(line);
            valueTrigger.remove();
        });


    } else {
        g.addEdge(node1, node2);
        let slopeinRadian = Math.atan2(endEdgeY - startEdgeY, endEdgeX - startEdgeX);
        let slopeinDegree = (slopeinRadian * 180) / Math.PI;
        line.style.transform = "rotate(" + slopeinDegree + "deg)";
        await playground.appendChild(line);
    }
}


let ignoreCreation = 0;
playground.addEventListener('click', (event) => {

    if (ignoreCreation > 0) {
        return;
    }

    if (toggleedge.innerHTML == 'Add Edge') {
        g.addVertex(currentNodeCount.toString());
        let newNode = document.createElement('div');
        newNode.setAttribute('class', 'node');
        let x_cord = event.pageX - 30;
        let y_cord = event.pageY - 30;
        let img = document.getElementById("image");
        // y_cord = img.width - y_cord;
        newNode.style.left = x_cord.toString() + 'px';
        newNode.style.color = 'white';
        newNode.setAttribute('id', currentNodeCount);
        console.log(newNode.style.left);
        newNode.innerHTML = currentNodeCount;
        currentNodeCount++;
        newNode.style.backgroundColor = 'black';
        newNode.style.top = y_cord.toString() + 'px';
        playground.appendChild(newNode);
        newNode.addEventListener('click', async (event) => {
            if (toggleedge.innerHTML == 'Add Node') {
                console.log('I was clicked');
                console.log(currentState);
                if (currentState == 0) {
                    startEdgeX = event.pageX;
                    startEdgeY = event.pageY;
                    currentState = 1;
                    node1 = event.target.id;
                }
                else {
                    endEdgeX = event.pageX;
                    endEdgeY = event.pageY;
                    node2 = event.target.id;
                    if (node2 != node1) {
                        await drawline();
                        currentState = 0;
                    }
                }
            }
            else {
                if(ignoreCreation == 0){
                    ignoreCreation = 1;
                    const input = document.createElement('input');
                    input.type = 'text';
                    newNode.appendChild(input);
                    input.focus();
                    input.addEventListener('keydown', function (event) {
                        if (event.keyCode === 13) {
                            const inputValue = input.value;
                            const newText = document.createTextNode(inputValue);
                            newNode.innerHTML = '';
                            newNode.appendChild(newText);
                            ignoreCreation=  0;
                        }
                    });
                }
            }
        })
    }
});

let nodes = document.getElementsByClassName('node');


let toggleedge = document.getElementById('toggleedge');
toggleedge.addEventListener('click', (event) => {
    if (toggleedge.innerHTML == 'Add Edge') {
        toggleedge.innerHTML = 'Add Node';
    }
    else {
        toggleedge.innerHTML = 'Add Edge';
    }
})

const download_coordinates = document.createElement("a");
download_coordinates.classList.add("button-container");
download_coordinates.style.width = "200px";
download_coordinates.style.margin = "auto";
document.body.appendChild(download_coordinates);
download_coordinates.innerHTML = "Download Coordinates";


const download_edge_list = document.createElement("a");
download_edge_list.classList.add("button-container");
download_edge_list.style.width = "200px";
download_edge_list.style.margin = "auto";
document.body.appendChild(download_edge_list);
download_edge_list.innerHTML = "Download Edge list";
function writeFile() {

    for (var [key, value] of g.AdjList) {
        console.log(`Key: ${key}, Value: ${value}`);
    }
    let coordinates = "";
    const nodes = document.querySelectorAll('.node');
    for (let i = 0; i < nodes.length; i++) {
        let x_cord = Number((nodes[i].style.left).slice(0, -2)) + 22;
        let y_cord = document.getElementById("image").clientHeight - Number((nodes[i].style.top).slice(0, -2)) - 22;

        coordinates += (nodes[i].innerHTML + " " + x_cord + " " + y_cord);

        if (i != nodes.length - 1) {
            coordinates += '\n';
        }
    }
    const file = new Blob([edge_list_data], { type: 'text/plain' });
    const url = URL.createObjectURL(file);

    const file2 = new Blob([coordinates], { type: 'text/plain' });
    const url2 = URL.createObjectURL(file2);
    download_edge_list.href = url;
    download_edge_list.download = "Edge_list.txt";
    download_coordinates.href = url2;
    download_coordinates.download = "Coordinates.txt";
}

async function displayImage() {
    var nameInput = document.getElementById("nameInput").value;
    var imageContainer = document.getElementById("image");
    
    
    var image = new Image();
    image.onload = function() {
      imageContainer.setAttribute("src",nameInput + ".jpg");
    };
    image.onerror = function() {
        console.log("Error!");
        imageContainer2.innerHTML = "Picture Not found!"
        imageContainer.setAttribute("src","");
      setTimeout(function() {
      }, 3000);
    };
    image.src = nameInput + '.jpg';
  }
  