const allRanges = document.querySelectorAll(".range-wrap");

allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const output = wrap.querySelector(".output");

  range.addEventListener("input", () => {
    setOutput(range, output);
        const changeColor = document.querySelector('#color');
        const red = document.getElementById("rangeRed").value;
        const green = document.getElementById("rangeGreen").value;
        const blue = document.getElementById("rangeBlue").value;
        changeColor.style.background = "rgb(" + red +", " + green +", " + blue +")"; 
  });
  setOutput(range, output);
  
});

function setOutput(range, output) {
  const valueRange = range.value;
  output.innerHTML = valueRange;
}
