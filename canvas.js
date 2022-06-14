window.addEventListener("load", () => {
  // Canvas
  const canvas = document.querySelector("#canvas");
  const canvas_border = 2;
  const offset_y = canvas.getBoundingClientRect().y + canvas_border;
  // In-memory canvas
  var in_mem_canvas = document.createElement("canvas");
  var in_mem_ctx = in_mem_canvas.getContext("2d");

  // Cursor
  const cursor_svg = document.querySelector("#cursor_svg");
  const cursor_circle = document.querySelector("#cursor_circle");
  const stroke_width = parseInt(cursor_circle.getAttribute("stroke-width"));

  // Options
  const width_picker = document.querySelector("#width_picker");
  const height_picker = document.querySelector("#height_picker");
  const radius_picker = document.querySelector("#radius_picker");
  const color_picker = document.querySelector("#color_picker");
  const clear = document.querySelector("#clear");
  const download = document.querySelector("#download");

  // Variables
  let painting = false;
  let color = color_picker.value;
  let radius = parseInt(cursor_circle.getAttribute("r"));

  // Set up
  const ctx = canvas.getContext("2d");
  canvas.width = width_picker.value;
  canvas.height = height_picker.value;

  // Functions
  function showBrush() {
    cursor_svg.style.visibility = "visible";
  }

  function hideBrush() {
    cursor_svg.style.visibility = "hidden";
  }

  function startPosition(e) {
    painting = true;
    draw(e);
  }

  function finishedPosition() {
    painting = false;
    ctx.beginPath();
  }

  function move(e) {
    const offset = stroke_width / 2 + radius;
    cursor_svg.style.left = e.pageX - window.scrollX - offset + "px";
    cursor_svg.style.top = e.pageY - window.scrollY - offset + "px";

    if (painting) draw(e);
  }

  function draw(e) {
    ctx.lineWidth = radius * 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    const x = e.clientX + window.scrollX - canvas_border;
    const y = e.clientY + window.scrollY - offset_y;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function resize(width, height) {
    in_mem_canvas.width = canvas.width;
    in_mem_canvas.height = canvas.height;
    in_mem_ctx.drawImage(canvas, 0, 0);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(in_mem_canvas, 0, 0);
  }

  function changeWidth(e) {
    let width = parseInt(e.target.value);
    const min = parseInt(width_picker.getAttribute("min"));
    const max = parseInt(width_picker.getAttribute("max"));
    if (width > max) {
      width = max;
      width_picker.value = width;
    } else if (width < min) {
      width = min;
      width_picker.value = width;
    }
    resize(width, canvas.height);
  }

  function changeHeight(e) {
    let height = parseInt(e.target.value);
    const min = parseInt(height_picker.getAttribute("min"));
    const max = parseInt(height_picker.getAttribute("max"));
    if (height > max) {
      height = max;
      height_picker.value = height;
    } else if (height < min) {
      height = min;
      height_picker.value = height;
    }
    resize(canvas.width, e.target.value);
  }

  function changeRadius(e) {
    radius = parseInt(e.target.value);

    const min = parseInt(radius_picker.getAttribute("min"));
    const max = parseInt(radius_picker.getAttribute("max"));
    if (radius > max) {
      radius = max;
      radius_picker.value = radius;
    } else if (radius < min) {
      radius = min;
      radius_picker.value = radius;
    }

    const length = radius * 2 + stroke_width;
    const pos = radius + stroke_width / 2;
    cursor_svg.setAttribute("height", length);
    cursor_svg.setAttribute("width", length);
    cursor_circle.setAttribute("cx", pos);
    cursor_circle.setAttribute("cy", pos);
    cursor_circle.setAttribute("r", radius);
  }

  function changeColor(e) {
    color = e.target.value;
    cursor_circle.style.fill = color;
  }

  function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function downloadImage() {
    const link = document.createElement("a");
    link.download = "download.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  }

  // Event Listeners
  canvas.addEventListener("mouseenter", showBrush);
  canvas.addEventListener("mouseleave", hideBrush);
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", move);

  width_picker.addEventListener("change", changeWidth);
  height_picker.addEventListener("change", changeHeight);
  radius_picker.addEventListener("change", changeRadius);
  color_picker.addEventListener("change", changeColor);
  clear.addEventListener("mousedown", clearScreen);
  download.addEventListener("mousedown", downloadImage);
});
