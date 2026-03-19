/**
 * Smart Food Waste Prediction System — Charts
 * Fetches analytics data and renders Farm UI Chart.js charts.
 */

// Farm-inspired lush green palette
const COLORS = {
    primary: '#1b4332',     // Dark forest green
    foreground: '#2d6a4f',  // Emerald
    accent1: '#52b788',     // Light emerald
    accent2: '#d8f3dc',     // Soft mint 
    muted: '#a8a29e',       // stone-400
    grid: 'rgba(0,0,0,0.04)',
    paper: '#f5f5f4',       // stone-100

    // Semantic
    cloudy: '#94a3b8',
    rainy: '#60a5fa',
    stormy: '#818cf8',
    sunny: '#fbbf24',

    festival: '#fcd34d',
    regular: '#1b4332'
};

const fontConfig = {
    family: "'Inter', sans-serif",
    size: 11,
    weight: '500',
    color: COLORS.muted
};

// Shadcn aesthetic: No X grid, dashed Y grid, hidden axes lines
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(28, 25, 23, 0.95)', // stone-900
            titleColor: '#fafaf9',
            titleFont: { family: "'Inter', sans-serif", weight: 'bold', size: 12 },
            bodyColor: '#e7e5e4',
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            displayColors: false,
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1
        }
    },
    scales: {
        x: {
            grid: { display: false, drawBorder: false },
            border: { display: false },
            ticks: { font: fontConfig, color: COLORS.muted, padding: 8 }
        },
        y: {
            grid: {
                color: COLORS.grid,
                drawBorder: false,
                tickLength: 0,
                tickColor: 'transparent',
                // Make grid lines dashed for a cleaner data-viz look
                borderDash: [5, 5]
            },
            border: { display: false },
            ticks: {
                font: fontConfig,
                color: COLORS.muted,
                padding: 12,
                maxTicksLimit: 6
            },
            beginAtZero: true
        }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
};

// Gradient generator
const createGradient = (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch Analytics Summary if on Analytics Page
    if (document.getElementById('chart-weekday')) {
        fetch('/api/analytics-summary')
            .then(res => res.json())
            .then(data => {
                if (data.day_means) renderWeekdayChart(data.day_means);
                if (data.weather_means) renderWeatherChart(data.weather_means);
                if (data.festival_means) renderFestivalChart(data.festival_means);
                if (data.scatter) renderScatterChart(data.scatter);
                if (data.model_results) renderModelComparisonChart(data.model_results);
            })
            .catch(err => console.error("Error fetching analytics summary:", err));
    }

    // 2. Fetch Dashboard Data if on History Page
    if (document.getElementById('chart-history')) {
        fetch('/api/dashboard-data')
            .then(res => res.json())
            .then(data => {
                renderHistoricalChart(data);
            })
            .catch(err => console.error("Error fetching dashboard data:", err));
    }
});

function renderWeekdayChart(data) {
    const ctx = document.getElementById('chart-weekday').getContext('2d');
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dayOrder,
            datasets: [{
                label: 'Avg Yield',
                data: dayOrder.map(d => data[d] || 0),
                backgroundColor: COLORS.primary,
                borderRadius: 6,
                borderSkipped: false,
                barPercentage: 0.6,
                maxBarThickness: 40
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `Avg Yield: ${Math.round(ctx.raw)} Meals`
                    }
                }
            }
        }
    });
}

function renderWeatherChart(data) {
    const ctx = document.getElementById('chart-weather').getContext('2d');
    const weatherOrder = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];
    const weatherColors = [COLORS.sunny, COLORS.cloudy, COLORS.rainy, COLORS.stormy];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weatherOrder,
            datasets: [{
                label: 'Avg Meals',
                data: weatherOrder.map(w => data[w] || 0),
                backgroundColor: weatherColors,
                borderRadius: 6,
                borderSkipped: false,
                barPercentage: 0.6,
                maxBarThickness: 40
            }]
        },
        options: chartDefaults
    });
}

function renderFestivalChart(data) {
    const ctx = document.getElementById('chart-festival').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Routine Day', 'Festival Day'],
            datasets: [{
                data: [data['0'] || 0, data['1'] || 0],
                backgroundColor: [COLORS.muted, COLORS.primary],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', // sleek thin doughnut
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 24,
                        font: fontConfig,
                        color: COLORS.muted
                    }
                },
                tooltip: chartDefaults.plugins.tooltip
            }
        }
    });
}

function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderScatterChart(data) {
    const ctx = document.getElementById('chart-scatter').getContext('2d');

    // Add visual jitter to X-axis to break apart strict rigid columns from synthetic data
    const scatterPoints = data.customers.map((c, i) => {
        const jitter = (Math.random() - 0.5) * (c * 0.08); // +/- 4% jitter
        return {
            x: Math.round(c + jitter),
            y: data.meals[i],
            originalX: c // keep original for tooltip
        };
    });

    // Color by weather map
    const weatherColorsMap = {
        'Cloudy': COLORS.cloudy,
        'Rainy': COLORS.rainy,
        'Stormy': COLORS.stormy,
        'Sunny': COLORS.sunny,
    };

    // Convert to hex with opacity to show overlap density clearly
    const pointColors = data.weather.map(w => hexToRgba(weatherColorsMap[w] || COLORS.primary, 0.6));

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Operational Points',
                data: scatterPoints,
                backgroundColor: pointColors,
                pointBorderColor: 'white',
                pointBorderWidth: 1.5,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                ...chartDefaults.scales,
                x: {
                    ...chartDefaults.scales.x,
                    title: {
                        display: true,
                        text: 'Expected Footfall (People)',
                        font: fontConfig,
                        color: COLORS.muted,
                        padding: { top: 10 }
                    }
                },
                y: {
                    ...chartDefaults.scales.y,
                    title: {
                        display: true,
                        text: 'Actual Consumption (Meals)',
                        font: fontConfig,
                        color: COLORS.muted,
                        padding: { bottom: 10 }
                    }
                }
            },
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `Expected: ${ctx.raw.originalX} » Actual: ${ctx.raw.y}`
                    }
                }
            }
        }
    });
}

function renderModelComparisonChart(data) {
    const ctx = document.getElementById('chart-models').getContext('2d');

    const labels = Object.keys(data);
    const maeData = labels.map(model => data[model].MAE);
    const rmseData = labels.map(model => data[model].RMSE);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'MAE',
                    data: maeData,
                    backgroundColor: COLORS.primary,
                    borderRadius: 4,
                    barPercentage: 0.4
                },
                {
                    label: 'RMSE',
                    data: rmseData,
                    backgroundColor: COLORS.muted,
                    borderRadius: 4,
                    barPercentage: 0.4
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

function renderHistoricalChart(data) {
    const ctx = document.getElementById('chart-history').getContext('2d');
    const gradientFill = createGradient(ctx, 'rgba(45, 106, 79, 0.4)', 'rgba(45, 106, 79, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.timestamps,
            datasets: [{
                label: 'Target Yield',
                data: data.recommendations,
                borderColor: COLORS.foreground,
                borderWidth: 2.5,
                backgroundColor: gradientFill,
                fill: true,
                pointBackgroundColor: COLORS.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4 // Smooth splines
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: (ctx) => `Target Yield: ${Math.round(ctx.raw)} Meals`
                    }
                }
            }
        }
    });
}
