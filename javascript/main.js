//order page javascripting

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const orderTableBody = document.querySelector('#orderTable tbody');
    const totalPriceElement = document.getElementById('totalPrice');

    let order = [];
    let favourites = [];

    function updateOrder() {
        order = [];
        orderTableBody.innerHTML = '';
        let totalPrice = 0;

        const inputs = orderForm.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            const amount = parseFloat(input.value) || 0;
            if (amount > 0) {
                const category = input.getAttribute('data-category');
                const price = parseFloat(input.getAttribute('data-price'));
                const item = input.previousSibling.nodeValue.trim();
                const itemPrice = amount * price;
                order.push({ item, category, amount, price: itemPrice });

                const row = document.createElement('tr');
                row.innerHTML = `<td>${item}</td><td>${category}</td><td>${amount}</td><td>$${itemPrice.toFixed(2)}</td>`;
                orderTableBody.appendChild(row);

                totalPrice += itemPrice;
            }
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    function saveFavourites() {
        localStorage.setItem('favourites', JSON.stringify(order));
        alert('Order saved as favourites!');
    }

    function applyFavourites() {
        favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites.forEach(fav => {
            const inputs = orderForm.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.previousSibling.nodeValue.trim() === fav.item) {
                    input.value = fav.amount;
                }
            });
        });
        updateOrder();
    }

    orderForm.addEventListener('input', updateOrder);
    document.getElementById('addToFavourites').addEventListener('click', saveFavourites);
    document.getElementById('applyFavourites').addEventListener('click', applyFavourites);
    document.getElementById('buyNow').addEventListener('click', function() {
        if (order.length > 0) {
            localStorage.setItem('order', JSON.stringify(order));
            window.location.href = 'checkout.html';
        } else {
            alert('Please add items to your order.');
        }
    });
});

//checkout page javascripting 

document.addEventListener('DOMContentLoaded', function() {
    const summaryTableBody = document.querySelector('#summaryTable tbody');
    const summaryTotalPrice = document.getElementById('summaryTotalPrice');

    const order = JSON.parse(localStorage.getItem('order')) || [];
    let totalPrice = 0;

    order.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.item}</td><td>${item.category}</td><td>${item.amount}</td><td>$${item.price.toFixed(2)}</td>`;
        summaryTableBody.appendChild(row);
        totalPrice += item.price;
    });

    summaryTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

    document.getElementById('payButton').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;
        const card = document.getElementById('card').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (name && email && address && city && zip && card && expiry && cvv) {
            if (document.getElementById('card').checkValidity() &&
                document.getElementById('expiry').checkValidity() &&
                document.getElementById('cvv').checkValidity()) {
                
                const deliveryDate = new Date();
                deliveryDate.setDate(deliveryDate.getDate() + 5);
                alert(`Thank you for your purchase! Your order will be delivered by ${deliveryDate.toDateString()}.`);
                
            } else {
                alert("Please enter valid details.");
            }
        } else {
            alert("Please fill out all required fields.");
        }
        
    });
});