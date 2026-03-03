// Bucks2Bar: Tab logic, data collection, and Chart.js rendering

const months = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

let barChart = null;

function getDataFromInputs() {
	const income = [], expense = [];
	for (let i = 0; i < 12; i++) {
		income.push(Number(document.querySelector(`[name='income-${i}']`).value) || 0);
		expense.push(Number(document.querySelector(`[name='expense-${i}']`).value) || 0);
	}
	return { income, expense };
}

function renderChart() {
	const ctx = document.getElementById('barChart').getContext('2d');
	const { income, expense } = getDataFromInputs();
	if (barChart) {
		barChart.data.datasets[0].data = income;
		barChart.data.datasets[1].data = expense;
		barChart.update();
		return;
	}
	barChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: months,
			datasets: [
				{
					label: 'Income',
					data: income,
					backgroundColor: 'rgba(40, 167, 69, 0.7)',
				},
				{
					label: 'Expense',
					data: expense,
					backgroundColor: 'rgba(220, 53, 69, 0.7)',
				}
			]
		},
		options: {
			responsive: true,
			plugins: {
				legend: { position: 'top' },
				title: { display: true, text: 'Income vs Expense (2026)' }
			},
			scales: {
				y: { beginAtZero: true }
			}
		}
	});
}

// Update chart when switching to Chart tab
document.addEventListener('DOMContentLoaded', function () {
	const chartTab = document.getElementById('chart-tab');
	chartTab.addEventListener('shown.bs.tab', function () {
		renderChart();
	});

	// Update chart if data changes while on Chart tab
	document.getElementById('dataForm').addEventListener('input', function () {
		if (document.getElementById('chart').classList.contains('active')) {
			renderChart();
		}
	});

	// Download chart as PNG
	const downloadBtn = document.getElementById('downloadChart');
	if (downloadBtn) {
		downloadBtn.addEventListener('click', function () {
			if (!barChart) renderChart();
			const link = document.createElement('a');
			link.href = barChart.toBase64Image();
			link.download = 'bucks2bar-chart.png';
			link.click();
		});
	}
});
