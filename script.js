const TARGET = { cash:0.75, acwi:0.2375, crypto:0.0125 };
let portfolio = JSON.parse(localStorage.getItem('portfolio')) || { cash:0, acwi:0, crypto:0 };
let chart;

function updateUI() {
  document.getElementById('cashInput').value = portfolio.cash;
  document.getElementById('acwiInput').value = portfolio.acwi;
  document.getElementById('cryptoInput').value = portfolio.crypto;

  const total = portfolio.cash + portfolio.acwi + portfolio.crypto;
  if(total <= 0) return;

  const sollCash = total*TARGET.cash;
  const sollAcwi = total*TARGET.acwi;
  const sollCrypto = total*TARGET.crypto;

  const diffCash = (sollCash - portfolio.cash).toFixed(2);
  const diffAcwi = (sollAcwi - portfolio.acwi).toFixed(2);
  const diffCrypto = (sollCrypto - portfolio.crypto).toFixed(2);

  document.getElementById('output').innerHTML = `
    <h3>Rebalancing Ergebnis</h3>
    Gesamt: ${total.toFixed(2)} €<br>
    Cash: ${portfolio.cash} € → Soll: ${sollCash.toFixed(2)} € → <strong>${diffCash} €</strong><br>
    ACWI: ${portfolio.acwi} € → Soll: ${sollAcwi.toFixed(2)} € → <strong>${diffAcwi} €</strong><br>
    Krypto: ${portfolio.crypto} € → Soll: ${sollCrypto.toFixed(2)} € → <strong>${diffCrypto} €</strong><br>
  `;

  renderChart();
}

function saveValues() {
  portfolio.cash = parseFloat(document.getElementById('cashInput').value) || 0;
  portfolio.acwi = parseFloat(document.getElementById('acwiInput').value) || 0;
  portfolio.crypto = parseFloat(document.getElementById('cryptoInput').value) || 0;

  localStorage.setItem('portfolio', JSON.stringify(portfolio));
  updateUI();
}

function renderChart() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Cash','ACWI','Krypto'],
      datasets:[{ data:[portfolio.cash,portfolio.acwi,portfolio.crypto], backgroundColor:['#007aff','#34c759','#ff9500'] }]
    },
    options: { responsive:true }
  });
}

function rebalanceCrypto() {
  const totalCrypto = portfolio.crypto;
  const btcPercent = parseFloat(document.getElementById('btcPercent').value) || 0;
  const ethPercent = parseFloat(document.getElementById('ethPercent').value) || 0;

  if(btcPercent + ethPercent !== 100) {
    alert("Die Anteile müssen zusammen 100% ergeben!");
    return;
  }

  const btcAmount = (totalCrypto * btcPercent / 100).toFixed(2);
  const ethAmount = (totalCrypto * ethPercent / 100).toFixed(2);

  document.getElementById('cryptoOutput').innerHTML = `
    <h4>Krypto Rebalancing</h4>
    Bitcoin: ${btcAmount} €<br>
    Ethereum: ${ethAmount} €
  `;
}

window.onload = updateUI;