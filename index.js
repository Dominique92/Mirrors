const inputEls = document.getElementsByTagName('input'),
  divEl = document.getElementsByTagName('div')[0],
  spanEls = document.getElementsByTagName('span'),
  sPars = location.search.match(/s=([0-9]+)/u) || [0, 4],
  dPars = location.search.match(/d=([1-9])/u) || [0, 2],
  size = inputEls[0].value = parseInt(sPars[1], 10),
  size1 = size + 1,
  density = (inputEls[1].value = dPars[1]) / 10;

let currentColor = 0,
  error = false;

// Display input values
function display() {
  inputEls[0].parentNode.children[2].innerHTML = inputEls[0].value;
  inputEls[1].parentNode.children[2].innerHTML = inputEls[1].value;
}
display();

// Build the table
for (let v = 0; v < size + 2; v++) {
  const trEl = document.createElement('p');
  divEl.appendChild(trEl);

  for (let h = 0; h < size + 2; h++) {
    const tdEl = document.createElement('span');
    trEl.appendChild(tdEl);
    tdEl.innerHTML = '&nbsp;';
    tdEl.laserH = 0;
    tdEl.laserV = 0;
    tdEl.x = h;
    tdEl.y = v;

    // Side boxes
    if (v % size1 === 0 ^ h % size1 === 0) {
      tdEl.style.backgroundImage = "url('boxes.svg')";
      tdEl.innerHTML = '&#128367;';
      tdEl.onclick = clickLight;
      tdEl.style.cursor = 'pointer';
      tdEl.mark = 3; // Open
    }
    // Central boxes
    if (v % size1 && h % size1) {
      tdEl.style.backgroundImage = 'url("boxes.svg")';
      tdEl.onclick = clickBox;
      tdEl.style.cursor = 'pointer';
      tdEl.mark = 0; // Close
      tdEl.mirror = Math.max(0, Math.floor(Math.random() * 5 - 2));
      //*DCMM*/tdEl.mirror = 0;
    }
  }
}

// .laserH, .laserV : 0=none 1=red 2=blue 3=yellow
// .mirror, .mark : 0:none 1:\ 2:/ 3:open

function displayBoxes() {
  Array.from(spanEls).forEach(el => {
    if (typeof el.mark === 'number') {
      if (el.mark === 3) {
        // Open boxes
        el.style.backgroundPositionX = -(el.mirror ? 4 : el.laserV) * 32 + 'px';
        el.style.backgroundPositionY = -(el.mirror ? 3 : el.laserH) * 32 + 'px';
      } else if (error && !el.mirror) {
        // Central boxes / open
        el.style.backgroundPositionX = -el.laserV * 32 + 'px';
        el.style.backgroundPositionY = -el.laserH * 32 + 'px';
      } else if (error) {
        // Central boxes / error
        el.style.backgroundPositionX = -(5 + el.mirror) * 32 + 'px';
        el.style.backgroundPositionY = -el.mark * 32 + 'px';
      } else {
        // Central boxes / game
        el.style.backgroundPositionX = '-128px';
        el.style.backgroundPositionY = -el.mark * 32 + 'px';
      }
    }
  });
}
displayBoxes();

function clickLight(evt) {
  currentColor = currentColor % 3 + 1;

  // Erase all laser same currentColor
  Array.from(spanEls).forEach(el => {
    if (el.laserH === currentColor)
      el.laserH = 0;
    if (el.laserV === currentColor)
      el.laserV = 0;
  });

  // Add laser & propagate
  if (evt.target.x === 0)
    setColorAndPropagate(0, evt.target.y, 1, 0);
  if (evt.target.x === size1)
    setColorAndPropagate(size1, evt.target.y, -1, 0);
  if (evt.target.y === 0)
    setColorAndPropagate(evt.target.x, 0, 0, 1);
  if (evt.target.y === size1)
    setColorAndPropagate(evt.target.x, size1, 0, -1);

  displayBoxes();
}

function setColorAndPropagate(x, y, dx, dy) {
  if (0 <= x && x <= size1 && 0 <= y && y <= size1) {
    const el = divEl.children[y].children[x];

    if (el.mirror === 1)
      setColorAndPropagate(x - dy, y - dx, -dy, -dx);
    else if (el.mirror === 2)
      setColorAndPropagate(x + dy, y + dx, dy, dx);
    else {
      // Set the laser in the box
      if (dx) el.laserH = currentColor;
      if (dy) el.laserV = currentColor;
      setColorAndPropagate(x + dx, y + dy, dx, dy);
    }
  }
}

function clickBox(evt) {
  if (evt.ctrlKey || evt.shiftKey) {
    evt.target.mark = 3; // Open clicked box

    // Remove all free boxes
    if (evt.target.mirror) {
      Array.from(spanEls).forEach(el => {
        if (!el.mark && !el.mirror)
          el.mark = 3; // Open
      });
      error = true;
    }
  }
  // Switch marks
  else if (evt.target.mark < 3)
    evt.target.mark = ++evt.target.mark % 3;

  displayBoxes();
}