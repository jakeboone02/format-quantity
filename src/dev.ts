import formatQuantity from '.';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerText = JSON.stringify(formatQuantity(1.5, true));
