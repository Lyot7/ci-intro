<?php
declare(strict_types=1);

namespace Mtech\Tests;

use PHPUnit\Framework\TestCase;
use Mtech\Calculator;

final class CalculatorTest extends TestCase
{
    public function testAdditionPositiveNumbers(): void
    {
        $this->assertSame(5, Calculator::add(2, 3));
    }

    /*
    // Test volontairement erroné pour l'activité "Erreur et correction"
    public function testAdditionNegativeNumbers(): void
    {
        $this->assertSame(-4, Calculator::add(-2, -3)); // échouera (résultat attendu: -5)
    }*/
}