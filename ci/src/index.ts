import { formatQuantity } from 'format-quantity';
import { numbers } from './numbers';
import './styles.css';

const grid = document.querySelector('#grid')!;

const gridInnerHTML: string[] = [];

for (const num of numbers) {
  const run = [
    num,
    formatQuantity(num),
    formatQuantity(num, { vulgarFractions: true }),
    formatQuantity(num, { fractionSlash: true }),
    formatQuantity(num, { romanNumerals: true }),
  ];

  gridInnerHTML.push(...run.map(r => `<div>${JSON.stringify(r)}</div>`));
}

grid.innerHTML += gridInnerHTML.join('');
