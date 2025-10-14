const { addition } = require('../app');

// Test qui devrait passer
test('addition de 2 + 3 = 5', () => {
  expect(addition(2, 3)).toBe(5);
});

/*
// Test volontairement erroné (pour l’activité "Erreur et correction")
test('addition de nombres négatifs', () => {
  expect(addition(-2, -3)).toBe(-4); // ceci va échouer (résultat = -5)
});
*/
