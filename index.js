const inputEls = document.getElementsByTagName('input'),
  divEl = document.getElementsByTagName('div')[0],
  spanEls = document.getElementsByTagName('span'),
  sPars = location.search.match(/s=([0-9]+)/u) || [0, 4],
  dPars = location.search.match(/d=([1-9])/u) || [0, 2],
  size = inputEls[0].value = parseInt(sPars[1], 10),
  size1 = size + 1,
  density = (inputEls[1].value = dPars[1]) / 10;
let error = false;

// Display input values
function display() {
  inputEls[0].parentNode.children[2].innerHTML = inputEls[0].value;
  inputEls[1].parentNode.children[2].innerHTML = inputEls[1].value;
}
display();

// Build the table
for (let x = 0; x < size + 2; x++) {
  const trEl = document.createElement('p');
  divEl.appendChild(trEl);

  for (let y = 0; y < size + 2; y++) {
    const tdEl = document.createElement('span');
    trEl.appendChild(tdEl);
    tdEl.innerHTML = '&nbsp;';

    // Side boxes
    if (x % size1 === 0 ^ y % size1 === 0) {
      tdEl.style.backgroundImage = "url('boxes.svg')";
      tdEl.innerHTML = '&#128367;';
      tdEl.onclick = clickLight;
      tdEl.style.cursor = 'pointer';
      tdEl.mark = 3; // Open
    }
    // Central boxes
    if (x % size1 && y % size1) {
      tdEl.style.backgroundImage = 'url("boxes.svg")';
      tdEl.onclick = clickMirror;
      tdEl.style.cursor = 'pointer';
      tdEl.mark = 0; // Close
      tdEl.mirror = Math.max(0, Math.floor(Math.random() * 5 - 2));
      tdEl.mirror = Math.max(0, Math.floor(Math.random() * 5 - 2));
    }
    tdEl.laserH = 0;
    tdEl.laserV = 0;
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
  /*DCMM*/
  console.log(evt.target.style);
}

function clickMirror(evt) {
  if (evt.ctrlKey) {
    evt.target.mark = 3; // Open clicked box

    // Remove all free boxes
    if (evt.target.mirror) {
      error = true;

      Array.from(spanEls).forEach(el => {
        if (!el.mark && !el.mirror)
          el.mark = 3; // Open
      });
    }
  }
  // Switch marks
  else if (evt.target.mark < 3)
    evt.target.mark = ++evt.target.mark % 3;

  displayBoxes();
}