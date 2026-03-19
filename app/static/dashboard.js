/**
 * PrepNova — Operational Dashboard JS
 * Renders Accuracy Trends (Actual vs Predicted)
 */

async function initDashboard() {
    const ctx = document.getElementById('dashboard-chart');
    if (!ctx) return;

    try {
        const res = await fetch('/api/dashboard-data');
        const data = await res.json();

        if (!data.timestamps || data.timestamps.length === 0) {
            document.getElementById('accuracy-stat').textContent = 'No verified data yet';
            return;
        }

        // Calculate Accuracy (1 - MAPE)
        let totalError = 0;
        let validPoints = 0;
        data.actuals.forEach((act, i) => {
            if (act > 0) {
                totalError += Math.abs(data.predictions[i] - act) / act;
                validPoints++;
            }
        });
        const accuracy = validPoints > 0 ? (100 * (1 - totalError / validPoints)).toFixed(1) : 'N/A';
        document.getElementById('accuracy-stat').textContent = `System Accuracy: ${accuracy}%`;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.timestamps,
                datasets: [
                    {
                        label: 'AI Prediction',
                        data: data.predictions,
                        borderColor: '#3949ab',
                        backgroundColor: 'rgba(57, 73, 171, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                    },
                    {
                        label: 'Actual Consumed',
                        data: data.actuals,
                        borderColor: '#00bfa5',
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 4,
                        pointStyle: 'rectRot',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { font: { family: 'Inter', weight: '700' } } },
                    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Inter' } }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { font: { family: 'Inter' } },
                        title: { display: true, text: 'Meals' }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Dashboard Error:', err);
        document.getElementById('accuracy-stat').textContent = 'Error loading analytics';
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
