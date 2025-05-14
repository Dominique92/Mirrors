const inputEls = document.getElementsByTagName('input'),
  divEl = document.getElementsByTagName('div')[0],
  spanEls = document.getElementsByTagName('span'),
  sPars = location.search.match(/s=([0-9]+)/) || [0, 4],
  dPars = location.search.match(/d=([1-9])/) || [0, 2],
  size = inputEls[0].value = parseInt(sPars[1]),
  size1 = size + 1,
  density = (inputEls[1].value = dPars[1]) / 10;

// Display input values
function display() {
  inputEls[0].parentNode.children[2].innerHTML = inputEls[0].value;
  inputEls[1].parentNode.children[2].innerHTML = inputEls[1].value;
}
display();

for (let x = 0; x < size + 2; x++) {
  const trEl = document.createElement('p');
  divEl.appendChild(trEl);

  for (let y = 0; y < size + 2; y++) {
    const tdEl = document.createElement('span');
    trEl.appendChild(tdEl);
    tdEl.innerHTML = '&nbsp;';

    if (x % size1 && y % size1) {
      tdEl.style.backgroundImage = 'url("cases.svg")';
      tdEl.onclick = clickMirror;
      tdEl.style.cursor = 'pointer';
      tdEl.status = 0;
    }
    if (x % size1 === 0 ^ y % size1 === 0) {
      tdEl.style.backgroundImage = "url('cases.svg')";
      tdEl.style.backgroundPositionX = '32px';
      tdEl.innerHTML = '&#128367;';
      tdEl.onclick = clickLight;
      tdEl.style.cursor = 'pointer';
    }
  }
}

function displayCases() {
  Array.from(spanEls).forEach(el => {
    if (typeof el.status !== 'undefined' &&
      el.status < 3)
      el.style.backgroundPositionY = el.status * 32 + 'px';
    else {
      /*DCMM*/console.log(el.status);
    }
  });
}

function clickMirror(evt) {
  if (evt.ctrlKey)
    evt.target.status = 3;
  else if (evt.target.status < 3)
    evt.target.status = ++evt.target.status % 3;

  displayCases();
}

function clickLight(evt) {
  /*DCMM*/console.log(evt.target.style);
}