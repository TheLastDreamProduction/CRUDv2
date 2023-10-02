document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const priceInput = document.getElementById('price');
    const timeOfOrderInput = document.getElementById('timeOfOrder');
    const productNameInput = document.getElementById('productName');
    const imageInput = document.getElementById('image');
    const orderTable = document.getElementById('order-table');
    const orderList = document.getElementById('order-list');

    // Load orders from local storage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let editingIndex = -1; // Initialize as -1 to indicate no active editing

    // Function to update local storage
    function updateLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Function to add an order
    function addOrder(orderData) {
        orders.push(orderData);
        updateLocalStorage();
        renderOrders();
        clearForm();
    }

    // Event listener for form submission
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderData = {
            name: nameInput.value,
            address: addressInput.value,
            phoneNumber: phoneNumberInput.value,
            price: priceInput.value,
            timeOfOrder: timeOfOrderInput.value,
            productName: productNameInput.value,
            image: URL.createObjectURL(imageInput.files[0])
        };
        addOrder(orderData);
    });

    // Function to delete an order
    function deleteOrder(index) {
        orders.splice(index, 1);
        updateLocalStorage();
        renderOrders();
    }

    // Function to render orders in the table
    function renderOrders() {
        orderList.innerHTML = '';
        orders.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.name}</td>
                <td>${order.address}</td>
                <td>${order.phoneNumber}</td>
                <td>${order.price}</td>
                <td>${order.timeOfOrder}</td>
                <td>${order.productName}</td>
                <td><img src="${order.image}" alt="Order Image" style="max-width: 100px;"></td>
                <td>
                    <button class="download-btn" data-index="${index}">Download</button>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            orderList.appendChild(row);
        });

        // Attach event listeners for download, edit, and delete buttons
        const downloadButtons = document.querySelectorAll('.download-btn');
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        downloadButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const imageUrl = orders[index].image;
                downloadImage(imageUrl);
            });
        });

        editButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                editOrder(index);
            });
        });

        deleteButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteOrder(index);
            });
        });
    }

    // Function to download an image
    function downloadImage(imageUrl) {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = 'order_image.jpg'; // You can customize the file name here
        a.target = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Function to edit an order
    function editOrder(index) {
        editingIndex = index; // Set the editing index
        const order = orders[index];

        // Populate the form fields with the order details for editing
        nameInput.value = order.name;
        addressInput.value = order.address;
        phoneNumberInput.value = order.phoneNumber;
        priceInput.value = order.price;
        timeOfOrderInput.value = order.timeOfOrder;
        productNameInput.value = order.productName;

        // Hide the submit button and show the update button
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('update-btn').style.display = 'block';

        // Scroll to the top of the form for better visibility
        document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
    }

    // Function to update an order
    function updateOrder(index) {
        if (editingIndex !== -1) {
            const updatedOrder = {
                name: nameInput.value,
                address: addressInput.value,
                phoneNumber: phoneNumberInput.value,
                price: priceInput.value,
                timeOfOrder: timeOfOrderInput.value,
                productName: productNameInput.value,
                image: orders[editingIndex].image, // Preserve the existing image
            };

            orders[editingIndex] = updatedOrder;
            updateLocalStorage();
            renderOrders();
            clearForm();

            // Reset editing state
            editingIndex = -1;

            // Show the submit button and hide the update button
            document.getElementById('submit-btn').style.display = 'block';
            document.getElementById('update-btn').style.display = 'none';
        }
    }

    // Event listener for the Update button
    document.getElementById('update-btn').addEventListener('click', () => {
        updateOrder(editingIndex);
    });

    // Function to clear the form
    function clearForm() {
        orderForm.reset();
    }

    // Function to save orders as a JSON backup file
    function backupOrders() {
        const backupData = JSON.stringify(orders, null, 2); // Convert orders to JSON with 2-space indentation

        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders_backup.json';
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

document.getElementById('backup-btn').addEventListener('click', backupOrders);

    renderOrders();
});
