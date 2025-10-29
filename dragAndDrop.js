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
    target.addEventListener("drop", function (event) {
        let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
        this.appendChild(myElement);
        this.style.border = "2px dashed #7f7fe9";
    }, false);
}