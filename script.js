// Bucks2Bar: Tab logic, data collection, and Chart.js rendering

const months = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

let barChart = null;

// --- Buckets 3D Animation Logic ---
function renderBuckets() {
	const { income, expense } = getDataFromInputs();
	const maxVal = Math.max(...income, ...expense, 1); // avoid div by zero
	const container = document.getElementById('bucketsContainer');
	if (!container) return;
	let html = '<div class="bucket-legend">' +
		'<div class="bucket-legend-item"><span class="bucket-legend-color bucket-legend-income"></span> Income</div>' +
		'<div class="bucket-legend-item"><span class="bucket-legend-color bucket-legend-expense"></span> Expense</div>' +
		'</div>';
	html += '<div class="d-flex flex-wrap justify-content-center gap-4">';
	for (let i = 0; i < 12; i++) {
		// Income bucket
		html += `<div class="d-flex flex-column align-items-center">
			<div class="bucket-label">${months[i]}</div>
			<div class="bucket-3d">
				<div class="bucket-water" id="income-water-${i}" style="height:0%"></div>
				<div class="bucket-outline"></div>
				<div class="bucket-top"></div>
				<div class="bucket-value">₹${income[i]}</div>
			</div>
			<div style="font-size:0.95rem;color:#4e9af1;font-weight:500;">Income</div>
		</div>`;
		// Expense bucket
		html += `<div class="d-flex flex-column align-items-center">
			<div class="bucket-label">${months[i]}</div>
			<div class="bucket-3d">
				<div class="bucket-water expense" id="expense-water-${i}" style="height:0%"></div>
				<div class="bucket-outline"></div>
				<div class="bucket-top"></div>
				<div class="bucket-value">₹${expense[i]}</div>
			</div>
			<div style="font-size:0.95rem;color:#e63946;font-weight:500;">Expense</div>
		</div>`;
	}
	html += '</div>';
	container.innerHTML = html;

	// Animate water fill
	setTimeout(() => {
		for (let i = 0; i < 12; i++) {
			const incomeHeight = Math.round((income[i] / maxVal) * 100);
			const expenseHeight = Math.round((expense[i] / maxVal) * 100);
			const incomeEl = document.getElementById(`income-water-${i}`);
			const expenseEl = document.getElementById(`expense-water-${i}`);
			if (incomeEl) incomeEl.style.height = incomeHeight + '%';
			if (expenseEl) expenseEl.style.height = expenseHeight + '%';
		}
	}, 100);
}

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
	// Username form validation and message rendering

	// Show tab: render buckets on tab show
	const showTab = document.getElementById('show-tab');
	if (showTab) {
		showTab.addEventListener('shown.bs.tab', renderBuckets);
	}
	// Also update buckets if data changes and Show tab is active
	const dataInputs = document.querySelectorAll("[name^='income-'], [name^='expense-']");
	dataInputs.forEach(input => {
		input.addEventListener('input', function () {
			if (document.getElementById('show').classList.contains('active')) {
				renderBuckets();
			}
		});
	});
	const usernameForm = document.getElementById('usernameForm');
	const usernameInput = document.getElementById('usernameInput');
	let usernameMsg = document.getElementById('usernameMsg');
	if (!usernameMsg) {
		usernameMsg = document.createElement('div');
		usernameMsg.id = 'usernameMsg';
		usernameMsg.className = 'mt-2';
		usernameForm.appendChild(usernameMsg);
	}
	usernameForm.addEventListener('submit', function (e) {
		e.preventDefault();
		const value = usernameInput.value.trim();
		const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
		if (regex.test(value)) {
			usernameInput.classList.remove('is-invalid');
			usernameInput.classList.add('is-valid');
			usernameMsg.textContent = 'Username is valid!';
			usernameMsg.style.color = '#28a745';
		} else {
			usernameInput.classList.remove('is-valid');
			usernameInput.classList.add('is-invalid');
			usernameMsg.textContent = 'Invalid username. Please follow the requirements.';
			usernameMsg.style.color = '#dc3545';
		}
	});

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
