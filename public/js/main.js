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

    let balanceNoInterest = initialAmount;
    let balanceWithInterest = initialAmount;
    let months = 0;
    let monthsWithInterest = 0;
    let dataNoInterest = [initialAmount];
    let dataWithInterest = [initialAmount];
    let dates = [new Date()];

    // Calculate until both scenarios reach target
    while (balanceNoInterest < targetAmount || balanceWithInterest < targetAmount) {
        months++;
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + months);
        dates.push(currentDate);

        // No interest scenario
        balanceNoInterest += monthlySavings;
        dataNoInterest.push(balanceNoInterest);

        // With interest scenario
        balanceWithInterest += monthlySavings;
        let interest = balanceWithInterest * interestRate;
        balanceWithInterest += interest;
        dataWithInterest.push(balanceWithInterest);

        // Record when target is first hit with interest
        if (balanceWithInterest >= targetAmount && monthsWithInterest === 0) {
            monthsWithInterest = months;
        }
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => date.toLocaleDateString()),
            datasets: [{
                label: 'Without Interest',
                data: dataNoInterest,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true
            }, {
                label: 'With Interest',
                data: dataWithInterest,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Time to reach target: ${monthsWithInterest} months with interest, ${months} months without`
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

    const targetDateWithInterest = new Date();
    targetDateWithInterest.setMonth(targetDateWithInterest.getMonth() + monthsWithInterest);
    
    const targetDateNoInterest = new Date();
    targetDateNoInterest.setMonth(targetDateNoInterest.getMonth() + months);

    alert(
        `With interest, you'll reach your goal of ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(targetAmount)} by ${targetDateWithInterest.toLocaleDateString()}.\n` +
        `Without interest, it would take until ${targetDateNoInterest.toLocaleDateString()}.`
    );
}