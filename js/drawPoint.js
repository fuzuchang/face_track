var DrawPoint = {};

DrawPoint.setPoint = function (x, y) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
};
DrawPoint.clearPoint = function () {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
};