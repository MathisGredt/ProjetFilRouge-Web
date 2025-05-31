document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('statsChart')?.getContext('2d');
    if (!ctx) {
        console.error('Canvas element not found.');
        return;
    }

    if (!window.dashboardData || !Array.isArray(window.dashboardData)) {
        console.error('Dashboard data is not available or invalid.');
        return;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Utilisateurs', 'Offres', 'Enchères'],
            datasets: [{
                label: 'Nombre',
                data: window.dashboardData,
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
});