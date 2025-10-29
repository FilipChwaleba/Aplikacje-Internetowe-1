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
