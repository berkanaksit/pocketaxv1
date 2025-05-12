export interface TaxSummary {
  income: number
  taxableIncome: number
  incomeTax: number
  class2NI: number
  class4NI: number
  totalTax: number
}

export function calcIncomeTax(income: number, taxFreeAllowance: number = 12570): number {
  const taxableIncome = Math.max(0, income - taxFreeAllowance)
  let tax = 0

  if (taxableIncome > 150000) {
    tax += (taxableIncome - 150000) * 0.45 // Additional rate
    tax += (150000 - 50270) * 0.40 // Higher rate
    tax += 50270 * 0.20 // Basic rate
  } else if (taxableIncome > 50270) {
    tax += (taxableIncome - 50270) * 0.40 // Higher rate
    tax += 50270 * 0.20 // Basic rate
  } else {
    tax += taxableIncome * 0.20 // Basic rate
  }

  return tax
}

export function calcClass2NI(profit: number): number {
  return profit > 11908 ? 3.15 * 52 : 0 // £3.15 per week if over threshold
}

export function calcClass4NI(profit: number): number {
  let ni = 0
  const lowerThreshold = 11908
  const upperThreshold = 50270

  if (profit > lowerThreshold) {
    ni += Math.min(profit - lowerThreshold, upperThreshold - lowerThreshold) * 0.0925
    if (profit > upperThreshold) {
      ni += (profit - upperThreshold) * 0.0325
    }
  }

  return ni
}

export function buildTaxSummary(income: number): TaxSummary {
  const taxFreeAllowance = 12570
  const taxableIncome = Math.max(0, income - taxFreeAllowance)
  const incomeTax = calcIncomeTax(income, taxFreeAllowance)
  const class2NI = calcClass2NI(income)
  const class4NI = calcClass4NI(income)
  const totalTax = incomeTax + class2NI + class4NI

  return {
    income,
    taxableIncome,
    incomeTax,
    class2NI,
    class4NI,
    totalTax,
  }
}