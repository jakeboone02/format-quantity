import { formatQuantity } from './formatQuantity';
import { formatQuantityTests } from './formatQuantityTests';

formatQuantityTests.forEach(([description, expects]) =>
  it(description, () =>
    expects.forEach(([quantity, result, options]) =>
      expect(formatQuantity(quantity, options)).toBe(result)
    )
  )
);
