const {
  addition,
  soustraction,
  multiplication,
  division,
  puissance,
  carre,
  cube
} = require('../app');

// Tests Addition
describe('Addition', () => {
  test('addition de 2 + 3 = 5', () => {
    throw new Error('test');
    expect(addition(2, 3)).toBe(5);
  });

  test('addition de nombres négatifs', () => {
    expect(addition(-2, -3)).toBe(-5);
  });

  test('addition avec zéro', () => {
    expect(addition(5, 0)).toBe(5);
  });
});

// Tests Soustraction
describe('Soustraction', () => {
  test('soustraction de 5 - 3 = 2', () => {
    expect(soustraction(5, 3)).toBe(2);
  });

  test('soustraction avec résultat négatif', () => {
    expect(soustraction(3, 5)).toBe(-2);
  });

  test('soustraction de nombres négatifs', () => {
    expect(soustraction(-5, -3)).toBe(-2);
  });
});

// Tests Multiplication
describe('Multiplication', () => {
  test('multiplication de 4 * 3 = 12', () => {
    expect(multiplication(4, 3)).toBe(12);
  });

  test('multiplication par zéro', () => {
    expect(multiplication(5, 0)).toBe(0);
  });

  test('multiplication de nombres négatifs', () => {
    expect(multiplication(-3, -4)).toBe(12);
  });

  test('multiplication avec un nombre négatif', () => {
    expect(multiplication(3, -4)).toBe(-12);
  });
});

// Tests Division
describe('Division', () => {
  test('division de 10 / 2 = 5', () => {
    expect(division(10, 2)).toBe(5);
  });

  test('division avec résultat décimal', () => {
    expect(division(7, 2)).toBe(3.5);
  });

  test('division de nombres négatifs', () => {
    expect(division(-10, -2)).toBe(5);
  });

  test('division par zéro doit lever une erreur', () => {
    expect(() => division(10, 0)).toThrow('Division par zéro impossible');
  });
});

// Tests Puissance
describe('Puissance', () => {
  test('puissance de 2^3 = 8', () => {
    expect(puissance(2, 3)).toBe(8);
  });

  test('puissance de 5^2 = 25', () => {
    expect(puissance(5, 2)).toBe(25);
  });

  test('puissance avec exposant 0', () => {
    expect(puissance(5, 0)).toBe(1);
  });

  test('puissance avec exposant négatif', () => {
    expect(puissance(2, -2)).toBe(0.25);
  });
});

// Tests Carré
describe('Carré', () => {
  test('carré de 4 = 16', () => {
    expect(carre(4)).toBe(16);
  });

  test('carré de -3 = 9', () => {
    expect(carre(-3)).toBe(9);
  });

  test('carré de 0 = 0', () => {
    expect(carre(0)).toBe(0);
  });
});

// Tests Cube
describe('Cube', () => {
  test('cube de 3 = 27', () => {
    expect(cube(3)).toBe(27);
  });

  test('cube de -2 = -8', () => {
    expect(cube(-2)).toBe(-8);
  });

  test('cube de 0 = 0', () => {
    expect(cube(0)).toBe(0);
  });
});

