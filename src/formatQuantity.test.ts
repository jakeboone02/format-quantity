import { formatQuantity } from './formatQuantity';
import { formatQuantityTests } from './formatQuantityTests';

for (const [description, expects] of formatQuantityTests) {
  it(description, () => {
    for (const [quantity, result, options] of expects) {
      expect(formatQuantity(quantity, options)).toBe(result);
    }
  });
}
