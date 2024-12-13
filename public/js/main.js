function calculate() {
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const monthlySavings = parseFloat(document.getElementById('monthlySavings').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Monthly interest rate
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);

    let balance = initialAmount;
    let months = 0;
    let monthsWithInterest = 0;
    let dataNoInterest = [];
    let dataWithInterest = [];

    while (balance < targetAmount) {
        months++;
        balance += monthlySavings;
        dataNoInterest.push(balance);

        let interest = balance * interestRate;
        balance += interest;
        dataWithInterest.push(balance);
        if (balance >= targetAmount && monthsWithInterest == 0) monthsWithInterest = months;
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: months}, (_, i) => i + 1),
            datasets: [{
                label: 'Without Interest',
                data: dataNoInterest,
                borderColor: 'blue',
                fill: false
            }, {
                label: 'With Interest',
                data: dataWithInterest,
                borderColor: 'green',
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: `Months to Target: No Interest - ${months}, With Interest - ${monthsWithInterest}`
            },
            scales: {
                x: {
                    title: { display: true, text: 'Months' }
                },
                y: {
                    title: { display: true, text: 'Balance' }
                }
            }
        }
    });

    alert(`With interest, you'll reach your goal in ${monthsWithInterest} months. Without interest, it would take ${months} months.`);
}