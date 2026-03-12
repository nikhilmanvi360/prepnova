/**
 * Smart Food Waste Prediction System — Charts
 * Fetches analytics data from /api/analytics-data and renders Chart.js charts.
 */

const COLORS = {
    primary: '#1a237e',
    primaryLight: '#3949ab',
    secondary: '#5c6bc0',
    accent: '#00bfa5',
    warm: '#ff7043',
    sunny: '#FFB300',
    cloudy: '#78909C',
    rainy: '#42A5F5',
    stormy: '#5C6BC0',
    bg: 'rgba(26, 35, 126, 0.08)',
    grid: 'rgba(0,0,0,0.06)',
};

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: { labels: { font: { family: 'Inter', size: 12 } } },
    },
    scales: {
        x: { grid: { color: COLORS.grid }, ticks: { font: { family: 'Inter' } } },
        y: { grid: { color: COLORS.grid }, ticks: { font: { family: 'Inter' } } },
    },
};

async function loadCharts() {
    const res = await fetch('/api/analytics-data');
    const data = await res.json();

    // 1. Weekday Chart
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    new Chart(document.getElementById('chart-weekday'), {
        type: 'bar',
        data: {
            labels: dayOrder,
            datasets: [{
                label: 'Avg Meals',
                data: dayOrder.map(d => data.day_means[d]?.toFixed(1) || 0),
                backgroundColor: dayOrder.map((_, i) =>
                    `hsla(${230 + i*8}, 60%, ${40 + i*5}%, 0.85)`
                ),
                borderRadius: 8,
                borderSkipped: false,
            }],
        },
        options: {
            ...chartDefaults,
            plugins: { ...chartDefaults.plugins, legend: { display: false } },
        },
    });

    // 2. Weather Chart
    const weatherOrder = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];
    const weatherColors = [COLORS.sunny, COLORS.cloudy, COLORS.rainy, COLORS.stormy];
    new Chart(document.getElementById('chart-weather'), {
        type: 'bar',
        data: {
            labels: weatherOrder,
            datasets: [{
                label: 'Avg Meals',
                data: weatherOrder.map(w => data.weather_means[w]?.toFixed(1) || 0),
                backgroundColor: weatherColors,
                borderRadius: 8,
                borderSkipped: false,
            }],
        },
        options: {
            ...chartDefaults,
            plugins: { ...chartDefaults.plugins, legend: { display: false } },
        },
    });

    // 3. Festival Chart
    new Chart(document.getElementById('chart-festival'), {
        type: 'bar',
        data: {
            labels: ['Non-Festival', 'Festival'],
            datasets: [{
                label: 'Avg Meals',
                data: [
                    data.festival_means['0']?.toFixed(1) || 0,
                    data.festival_means['1']?.toFixed(1) || 0,
                ],
                backgroundColor: [COLORS.secondary, COLORS.warm],
                borderRadius: 8,
                borderSkipped: false,
            }],
        },
        options: {
            ...chartDefaults,
            plugins: { ...chartDefaults.plugins, legend: { display: false } },
        },
    });

    // 4. Scatter Chart
    const weatherColorMap = { Sunny: COLORS.sunny, Cloudy: COLORS.cloudy, Rainy: COLORS.rainy, Stormy: COLORS.stormy };
    const scatterData = data.scatter.customers.map((c, i) => ({
        x: c,
        y: data.scatter.meals[i],
    }));
    const scatterColors = data.scatter.weather.map(w => weatherColorMap[w] || COLORS.secondary);
    new Chart(document.getElementById('chart-scatter'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Customers vs Meals',
                data: scatterData,
                backgroundColor: scatterColors,
                pointRadius: 4,
                pointHoverRadius: 6,
            }],
        },
        options: {
            ...chartDefaults,
            scales: {
                x: { ...chartDefaults.scales.x, title: { display: true, text: 'Expected Customers', font: { family: 'Inter' } } },
                y: { ...chartDefaults.scales.y, title: { display: true, text: 'Meals Consumed', font: { family: 'Inter' } } },
            },
        },
    });

    // 5. Model Comparison
    const modelNames = Object.keys(data.model_results);
    new Chart(document.getElementById('chart-models'), {
        type: 'bar',
        data: {
            labels: modelNames,
            datasets: [
                {
                    label: 'MAE',
                    data: modelNames.map(n => data.model_results[n].MAE.toFixed(1)),
                    backgroundColor: COLORS.primaryLight,
                    borderRadius: 6,
                },
                {
                    label: 'RMSE',
                    data: modelNames.map(n => data.model_results[n].RMSE.toFixed(1)),
                    backgroundColor: COLORS.warm,
                    borderRadius: 6,
                },
            ],
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { position: 'top', labels: { font: { family: 'Inter', size: 12 } } },
            },
        },
    });
}

loadCharts();
