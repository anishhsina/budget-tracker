document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");
    const balanceEl = document.getElementById("balance");
    const searchBar = document.getElementById("search-bar");
    const themeToggle = document.getElementById("theme-toggle");
    const goalInput = document.getElementById("goal");
    const goalStatus = document.getElementById("goal-status");

    let transactions = [];
    let monthlyGoal = 0;

    const chartCtx = document.getElementById("chart").getContext("2d");
    let chart;

    const updateUI = () => {
        const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expense;

        totalIncomeEl.textContent = income.toFixed(2);
        totalExpenseEl.textContent = expense.toFixed(2);
        balanceEl.textContent = balance.toFixed(2);

        updateChart(income, expense);

        if (monthlyGoal > 0) {
            if (balance >= monthlyGoal) {
                goalStatus.textContent = "Goal achieved!";
                goalStatus.classList.remove("text-danger");
                goalStatus.classList.add("text-success");
            } else {
                goalStatus.textContent = `You need ₹${(monthlyGoal - balance).toFixed(
                    2
                )} more to achieve your goal.`;
                goalStatus.classList.remove("text-success");
                goalStatus.classList.add("text-danger");
            }
        }
    };

    const updateChart = (income, expense) => {
        if (chart) chart.destroy();

        chart = new Chart(chartCtx, {
            type: "doughnut",
            data: {
                labels: ["Income", "Expense"],
                datasets: [
                    {
                        label: "Spending Overview",
                        data: [income, expense],
                        backgroundColor: ["#28a745", "#dc3545"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
            },
        });
    };

    const addTransactionToList = (transaction) => {
        const li = document.createElement("li");
        li.className = `list-group-item ${transaction.type}`;
        li.innerHTML = `
            ${transaction.description} 
            <span>₹${transaction.amount.toFixed(2)} (${transaction.category})</span>
            <div>
                <button class="btn btn-primary btn-sm edit-btn">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </div>
        `;

        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            transactions = transactions.filter((t) => t.id !== transaction.id);
            li.remove();
            updateUI();
        });

        const editBtn = li.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => {
            document.getElementById("description").value = transaction.description;
            document.getElementById("amount").value = transaction.amount;
            document.getElementById("category").value = transaction.category;
            document.getElementById("type").value = transaction.type;

            transactions = transactions.filter((t) => t.id !== transaction.id);
            li.remove();
            updateUI();
        });

        transactionList.appendChild(li);
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value;
        const type = document.getElementById("type").value;

        const transaction = {
            id: Date.now(),
            description,
            amount,
            category,
            type,
        };

        transactions.push(transaction);
        addTransactionToList(transaction);

        form.reset();
        updateUI();
    });

    searchBar.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase();
        transactionList.innerHTML = "";

        transactions
            .filter((t) => t.description.toLowerCase().includes(keyword))
            .forEach((transaction) => addTransactionToList(transaction));
    });
});
