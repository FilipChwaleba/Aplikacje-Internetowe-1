let items = document.querySelectorAll('.item');
for (let item of items) {
    item.addEventListener("dragstart", function(event) {
        this.style.border = "5px solid #38f351ff";
        event.dataTransfer.setData("text", this.id);
    });

    item.addEventListener("dragend", function(event) {
        this.style.borderWidth = "0";
    });
}

let expectedIndex = 1;
const totalPieces = 16;
    
let targets = document.querySelectorAll(".drag-target");
for (let target of targets) {
    target.addEventListener("dragenter", function (event) {
        this.style.border = "2px solid #7FE9D9";
    });
    target.addEventListener("dragleave", function (event) {
        this.style.border = "2px dashed #7f7fe9";
    });
    target.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    // updated drop logic: enforce order and notify on completion
    target.addEventListener("drop", function (event) {
        event.preventDefault();
        const id = event.dataTransfer.getData('text');
        const myElement = document.querySelector("#" + id);

        // If this is the puzzle drop target (main .drag-target), require correct order
        // (If you have multiple drop targets and only one is puzzle, ensure only that one enforces order)
        if (this.classList.contains('drag-target')) {
            if (id === `draggable-item-${expectedIndex}`) {
                this.appendChild(myElement);
                this.style.border = "2px dashed #7f7fe9";
                expectedIndex++;

                // If completed all pieces, notify user
                if (expectedIndex > totalPieces) {
                    setTimeout(() => {
                        alert("Układanka ukończona.");
                    }, 100);
                }
            } else {
                // brief visual feedback for wrong piece
                const prev = this.style.border;
                this.style.border = "2px solid red";
                setTimeout(() => {
                    this.style.border = prev || "2px dashed #7f7fe9";
                }, 400);
            }
        } else {
            // fallback: allow drop to other targets
            this.appendChild(myElement);
            this.style.border = "2px dashed #7f7fe9";
        }
    }, false);
}


window.addEventListener("DOMContentLoaded", () => {
    const draggableItems = document.querySelectorAll(".draggable");
    const sprite = new Image();
    sprite.src = "fractalTexture.png";

    sprite.addEventListener("load", () => {
        draggableItems.forEach(item => {
            
            const canvas = document.createElement("canvas");
            canvas.width = item.clientWidth;
            canvas.height = item.clientHeight;
            item.appendChild(canvas);

            const ctx = canvas.getContext("2d");

           
            ctx.drawImage(sprite, 0, 0, canvas.width, canvas.height);
        });
    });
});


function getLocation() {
    if(!navigator.geolocation){
        alert("Geolocation is not supported by your browser");
    }
     navigator.geolocation.getCurrentPosition((position) => {
                document.getElementById("latitude").innerText = position.coords.latitude;
                document.getElementById("longitude").innerText = position.coords.longitude;
            }, (positionError) => {
                console.error(positionError);
            }, {
                enableHighAccuracy: false
            });
        }

// Initialize the map
let map = L.map('map').setView([52.237049, 21.017532], 13);

// Add the default tile layer
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);

// Function to get user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to show position on map
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Update position info
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;
    
    // Update map view
    map.setView([lat, lon], 13);
    
    // Add marker
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Your location')
        .openPopup();
}

// Function to save map as image
function saveMap() {
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error('Error generating map image:', err);
            return;
        }
        
        // Don't set the full map as the drag-target background (no hint)
        // setDragTargetBackground(canvas); <-- removed

        // split into tiles and draw onto cubes
        splitMapIntoSquares(canvas);

        // shuffle cubes immediately after tiles have been set
        shuffleCubes();
    });
}

// replace previous setDragTargetBackground implementation with a no-op
function setDragTargetBackground(mapCanvas) {
    // intentionally left empty to avoid showing the full map as a hint
    // (keeps pieces visible when dropped/dragged)
}

function splitMapIntoSquares(mapCanvas) {
    // Use 4x4 grid (16 pieces)
    const cols = 4;
    const rows = 4;
    const squareWidth = Math.floor(mapCanvas.width / cols);
    const squareHeight = Math.floor(mapCanvas.height / rows);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = squareWidth;
    tempCanvas.height = squareHeight;

    let squareCount = 0;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            squareCount++;
            if (squareCount > totalPieces) break;
            
            tempCtx.clearRect(0, 0, squareWidth, squareHeight);
            tempCtx.drawImage(
                mapCanvas,
                x * squareWidth, y * squareHeight,
                squareWidth, squareHeight,
                0, 0,
                squareWidth, squareHeight
            );

            const draggableItem = document.getElementById(`draggable-item-${squareCount}`);
            if (!draggableItem) continue;

            // Create or get existing canvas for the draggable item
            let itemCanvas = draggableItem.querySelector('canvas');
            if (!itemCanvas) {
                itemCanvas = document.createElement('canvas');
                draggableItem.appendChild(itemCanvas);
            }
            
            // set item canvas to the visible size (match CSS 100x100)
            const visibleSize = 100;
            itemCanvas.width = visibleSize;
            itemCanvas.height = visibleSize;
            const itemCtx = itemCanvas.getContext('2d');
            // draw scaled tile into cube canvas
            itemCtx.clearRect(0,0,visibleSize,visibleSize);
            itemCtx.drawImage(tempCanvas, 0, 0, squareWidth, squareHeight, 0, 0, visibleSize, visibleSize);
        }
    }
}

function shuffleCubes() {
    // Shuffle the cubes in the source container so cubes appear mixed
    const source = document.querySelector('.cubes');
    if (!source) return;

    // Collect only the .item elements (keep their IDs and canvases)
    const nodes = Array.from(source.querySelectorAll('.item'));
    if (nodes.length === 0) return;

    // Fisher-Yates shuffle
    for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }

    // Re-append in shuffled order
    nodes.forEach(n => source.appendChild(n));
    
    // reset expectedIndex so user must place pieces in order again
    expectedIndex = 1;
}



