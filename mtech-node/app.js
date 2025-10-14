function addition(a, b) {
  return a + b;


  
}

function soustraction(a, b) {
  return a - b;
}

function multiplication(a, b) {
  return a * b;
}

function division(a, b) {
  if (b === 0) {
    throw new Error('Division par zéro impossible');
  }
  return a / b;
}

function puissance(a, exposant) {
  return Math.pow(a, exposant);
}

function carre(a) {
  return a * a;
}

function cube(a) {
  return a * a * a;
}

module.exports = {
  addition,
  soustraction,
  multiplication,
  division,
  puissance,
  carre,
  cube
};
