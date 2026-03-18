/**
 * PrepNova — Organic Professional Charts
 */

const COLORS = {
    primary: '#4B6F44',      /* Sage Green */
    primaryDark: '#3A5A34',
    secondary: '#2C3E2D',    /* Forest Green */
    accent: '#BC6C4D',       /* Terracotta */
    warm: '#E5E1DA',         /* Sand */
    sunny: '#D4AF37',        /* Gold */
    cloudy: '#A0A9A1',
    rainy: '#6B8E23',        /* Olive */
    stormy: '#4F4F4F',
    bg: '#FDFCF9',
    grid: '#E5E1DA',
    text: '#2C3E2D',
    text_secondary: '#5C6B5D',
    text_muted: '#A0A9A1'
};

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
                color: COLORS.text,
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: { family: "'Inter', sans-serif", size: 12, weight: '600' }
            }
        },
        tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: COLORS.text,
            bodyColor: COLORS.text_secondary,
            borderColor: COLORS.grid,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            usePointStyle: true,
            font: { family: "'Inter', sans-serif" }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: COLORS.text_muted, font: { family: "'Inter', sans-serif", size: 11 } }
        },
        y: {
            grid: { color: COLORS.grid, drawBorder: false, borderDash: [4, 4] },
            ticks: { color: COLORS.text_muted, font: { family: "'Inter', sans-serif", size: 11 }, padding: 10 }
        },
    },
};

async function loadCharts() {
    try {
        const res = await fetch('/api/analytics-summary');
        if (!res.ok) throw new Error('Failed to fetch analytics data');
        const data = await res.json();

        // 1. Weekday Chart
        const ctxWeekday = document.getElementById('chart-weekday').getContext('2d');
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        new Chart(ctxWeekday, {
            type: 'bar',
            data: {
                labels: dayOrder,
                datasets: [{
                    label: 'Avg Meals',
                    data: dayOrder.map(d => data.day_means[d]?.toFixed(1) || 0),
                    backgroundColor: COLORS.primary,
                    borderRadius: 4,
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
                    borderRadius: 4,
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
                labels: ['Standard', 'Event'],
                datasets: [{
                    label: 'Avg Meals',
                    data: [
                        data.festival_means['0']?.toFixed(1) || 0,
                        data.festival_means['1']?.toFixed(1) || 0,
                    ],
                    backgroundColor: [COLORS.warm, COLORS.primary],
                    borderRadius: 4,
                }],
            },
            options: {
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
            },
        });

        // 4. Scatter Chart
        const scatterData = data.scatter.customers.map((c, i) => ({
            x: c,
            y: data.scatter.meals[i],
        }));
        new Chart(document.getElementById('chart-scatter'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Customers vs Meals',
                    data: scatterData,
                    backgroundColor: COLORS.primary,
                    pointRadius: 4,
                }],
            },
            options: {
                ...chartDefaults,
                scales: {
                    x: { ...chartDefaults.scales.x, title: { display: true, text: 'Expected Foot Traffic' } },
                    y: { ...chartDefaults.scales.y, title: { display: true, text: 'Meals Consumed' } },
                },
            },
        });

        // 5. Model Comparison
        const modelNames = Object.keys(data.model_results);
        new Chart(document.getElementById('chart-models'), {
            type: 'line',
            data: {
                labels: modelNames,
                datasets: [
                    {
                        label: 'Mean Error (MAE)',
                        data: modelNames.map(n => data.model_results[n].MAE.toFixed(1)),
                        borderColor: COLORS.primary,
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 4,
                    },
                    {
                        label: 'RMSE',
                        data: modelNames.map(n => data.model_results[n].RMSE.toFixed(1)),
                        borderColor: COLORS.accent,
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 4,
                    },
                ],
            },
            options: chartDefaults,
        });
    } catch (e) {
        console.error("Error loading charts:", e);
    }
}

loadCharts();
