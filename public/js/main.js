function calculate() {
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const monthlySavings = parseFloat(document.getElementById('monthlySavings').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Monthly interest rate
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);

    // Validate inputs
    if (isNaN(initialAmount) || isNaN(monthlySavings) || isNaN(interestRate) || isNaN(targetAmount)) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    let balance = initialAmount;
    let months = 0;
    let data = [initialAmount];
    let dates = [new Date()];
    let targetMonth = 0;

    // Calculate until reaching target
    while (balance < targetAmount) {
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

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
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
                    text: `Months to reach target: ${targetMonth}`
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

    alert(
        `You'll reach your goal of ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(targetAmount)} by ${targetDate.toLocaleDateString()}.`
    );
}