function calculate() {
    // Get input values
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const monthlySavings = parseFloat(document.getElementById('monthlySavings').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Monthly interest rate
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);

    // Validate inputs with helpful messages
    if (isNaN(initialAmount)) {
        alert('Please enter a valid number for Initial Amount');
        document.getElementById('initialAmount').focus();
        return;
    }
    if (isNaN(monthlySavings)) {
        alert('Please enter a valid number for Monthly Savings');
        document.getElementById('monthlySavings').focus();
        return;
    }
    if (isNaN(interestRate)) {
        alert('Please enter a valid interest rate percentage');
        document.getElementById('interestRate').focus();
        return;
    }
    if (isNaN(targetAmount)) {
        alert('Please enter a valid Target Amount');
        document.getElementById('targetAmount').focus();
        return;
    }
    if (targetAmount <= initialAmount) {
        alert('Target Amount must be greater than Initial Amount');
        document.getElementById('targetAmount').focus();
        return;
    }

    // Show loading indicator
    const calculateButton = document.querySelector('button[onclick="calculate()"]');
    const originalButtonText = calculateButton.textContent;
    calculateButton.textContent = 'Calculating...';
    calculateButton.disabled = true;

    let balance = initialAmount;
    let months = 0;
    let data = [initialAmount];
    let dates = [new Date()];
    let targetMonth = 0;

    // Calculate until reaching target
    while (balance < targetAmount && months < 600) { // Add safety limit of 50 years
        months++;
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + months);
        dates.push(currentDate);

        balance += monthlySavings;
        let interest = balance * interestRate;
        balance += interest;
        data.push(balance);

        if (balance >= targetAmount && targetMonth === 0) {
            targetMonth = months;
        }
    }

    // Check if goal is achievable
    if (months >= 600) {
        alert('With current savings and interest rate, it will take over 50 years to reach your goal. Consider increasing your monthly savings or adjusting your target amount.');
        calculateButton.textContent = originalButtonText;
        calculateButton.disabled = false;
        return;
    }

    // Clear any existing chart
    const chartContainer = document.getElementById('myChart').getContext('2d');
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Create new chart
    window.myChart = new Chart(chartContainer, {
        type: 'line',
        data: {
            labels: dates.map(date => date.toLocaleDateString()),
            datasets: [{
                label: 'Account Balance',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true
            }, {
                label: 'Target Amount',
                data: Array(dates.length).fill(targetAmount),
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [5, 5],
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Time to reach target: ${Math.floor(targetMonth/12)} years and ${targetMonth%12} months`
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Balance ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            }
        }
    });

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + targetMonth);

    // Format numbers for better readability
    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
    const totalInterest = formatter.format(balance - (initialAmount + (monthlySavings * targetMonth)));
    const totalContributions = formatter.format(initialAmount + (monthlySavings * targetMonth));

    // Show results in a more informative way
    const resultMessage = `
        Goal Achievement Summary:
        • Target Date: ${targetDate.toLocaleDateString()}
        • Time to Goal: ${Math.floor(targetMonth/12)} years and ${targetMonth%12} months
        • Total Contributions: ${totalContributions}
        • Total Interest Earned: ${totalInterest}
    `;

    alert(resultMessage);

    // Reset button state
    calculateButton.textContent = originalButtonText;
    calculateButton.disabled = false;
}