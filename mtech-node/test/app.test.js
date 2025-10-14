const { addition } = require('../app');

// Test qui devrait passer
test('addition de 2 + 3 = 5', () => {
  expect(addition(2, 3)).toBe(5);
});


test('addition de nombres négatifs', () => {
  expect(addition(-2, -3)).toBe(-5);
});

