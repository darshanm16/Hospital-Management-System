// Initialize the inventory
const inventory = {
  Paracetamol: { quantity: 100, price: 10, expiryDate: "2025-12-31" },
  Ibuprofen: { quantity: 50, price: 15, expiryDate: "2024-06-30" },
  Amoxicillin: { quantity: 30, price: 20, expiryDate: "2024-11-15" },
  Drisdol: { quantity: 45, price: 30, expiryDate: "2025-05-25" },
  Motrin: { quantity: 86, price: 100, expiryDate: "2026-12-24" },
  Zyrtec: { quantity: 123, price: 70, expiryDate: "2024-04-01" },
  Zithromax: { quantity: 75, price: 60, expiryDate: "2025-03-04" },
  Keflex: { quantity: 56, price: 80, expiryDate: "2027-12-16" },
  Cetirizine: { quantity: 231, price: 10, expiryDate: "2025-02-03" },
  Amoxicillin: { quantity: 94, price: 90, expiryDate: "2025-01-10" },
};

// Display inventory on page load
window.onload = function () {
  displayInventory();
  populateMedicineSelect();
};

// Display the current state of the inventory
function displayInventory() {
  const inventoryBody = document.getElementById("inventory-body");
  inventoryBody.innerHTML = ""; // Clear existing rows

  for (const medicine in inventory) {
    const row = document.createElement("tr");

    // If the quantity is less than 20, add the 'low-stock' class to the row
    if (inventory[medicine].quantity < 20) {
      row.classList.add("low-stock");
    }

    // If the medicine is expired, add the 'expired' class to the row
    const today = new Date();
    const expiryDate = new Date(inventory[medicine].expiryDate);
    if (expiryDate < today) {
      row.classList.add("expired");
    }

    row.innerHTML = `
            <td>${medicine}</td>
            <td>${inventory[medicine].quantity}</td>
            <td>${inventory[medicine].price}</td>
            <td>${inventory[medicine].expiryDate}</td>
        `;
    inventoryBody.appendChild(row);
  }
}

// Populate the medicine select dropdown
function populateMedicineSelect() {
  const medicineSelect = document.getElementById("medicine-select");
  medicineSelect.innerHTML = ""; // Clear existing options

  for (const medicine in inventory) {
    const option = document.createElement("option");
    option.value = medicine;
    option.textContent = `${medicine} (Expiry: ${inventory[medicine].expiryDate})`;
    medicineSelect.appendChild(option);
  }

  // Enable the button if there are options available
  document.getElementById("add-medicine-button").disabled =
    medicineSelect.options.length === 0;
}

// Function to add medicine to bill
function addMedicineToBill() {
  const medicineSelect = document.getElementById("medicine-select");
  const quantityInput = document.getElementById("quantity-input");
  const billBody = document.getElementById("bill-body");
  const totalElement = document.getElementById("total");
  let total = parseFloat(totalElement.innerText.replace("Total: Rs ", "")) || 0;

  const selectedMedicine = medicineSelect.value;
  const enteredQuantity = parseInt(quantityInput.value);

  if (selectedMedicine && enteredQuantity > 0) {
    const today = new Date();
    const expiryDate = new Date(inventory[selectedMedicine].expiryDate);

    if (expiryDate < today) {
      alert(
        `The selected medicine, ${selectedMedicine}, is expired and cannot be added to the bill.`
      );
      return; // Exit the function to prevent adding expired medicine
    }

    if (enteredQuantity <= inventory[selectedMedicine].quantity) {
      const price = inventory[selectedMedicine].price;
      const medicineTotal = price * enteredQuantity;

      // Update inventory quantity
      inventory[selectedMedicine].quantity -= enteredQuantity;

      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${selectedMedicine}</td>
              <td>${enteredQuantity}</td>
              <td>${price}</td>
              <td>${medicineTotal}</td>
          `;
      billBody.appendChild(row);
      total += medicineTotal;

      // Refresh inventory display
      displayInventory();

      // Update total amount
      totalElement.innerText = `Total: Rs ${total.toFixed(2)}`;

      // Show print and new bill buttons
      document.getElementById("print-bill").style.display = "block";
      document.getElementById("new-bill-button").style.display = "block";
    } else {
      alert(
        `Not enough stock for ${selectedMedicine}. Available: ${inventory[selectedMedicine].quantity}`
      );
    }
  }

  // Reset the input fields
  document.getElementById("quantity-input").value = "";
}

// Generate the bill summary and print it
function generateBill() {
  const patientName = document.getElementById("patient-name").value;
  const patientAge = document.getElementById("patient-age").value;

  // Validate patient details
  if (!patientName || !patientAge) {
    alert("Please enter both patient name and age.");
    return;
  }

  const billBody = document.getElementById("bill-body");
  const totalElement = document.getElementById("total");
  let total = parseFloat(totalElement.innerText.replace("Total: Rs ", "")) || 0;

  const patientInfoElement = document.getElementById("patient-info");
  patientInfoElement.innerHTML = `Patient Name: ${patientName}, Age: ${patientAge}`; // Display patient info

  // Create a bill summary with patient info and bill details
  const summary = `
    <div>
      <h2>Bill Summary</h2>
      <p>Patient Name: ${patientName}</p>
      <p>Patient Age: ${patientAge}</p>
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${billBody.innerHTML}
        </tbody>
      </table>
      <h3>Total: Rs ${total.toFixed(2)}</h3>
    </div>
  `;

  // Create a new window to print the bill
  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          h2 { text-align: center; }
          h3 { text-align: right; }
        </style>
      </head>
      <body>
        ${summary}
        <script>
          window.print();
          window.onafterprint = function() {
            // Reset the bill details after printing
            window.opener.document.getElementById("bill-body").innerHTML = "";
            window.opener.document.getElementById("total").innerText = "Total: $0";
            window.opener.document.getElementById("patient-info").innerHTML = "";
            window.opener.document.getElementById("print-bill").style.display = "none";
            window.opener.document.getElementById("new-bill-button").style.display = "none";
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();

  // Reset the form after submission
  document.getElementById("billing-form").reset(); // Reset form after submission
  document.getElementById("print-bill").style.display = "none"; // Hide print button
  document.getElementById("new-bill-button").style.display = "none"; // Hide new bill button
}

// Attach event listeners to buttons
document.getElementById("add-medicine-button").onclick = addMedicineToBill;
document.getElementById("print-bill").onclick = function () {
  generateBill(); // Trigger bill generation and print
};
document.getElementById("new-bill-button").onclick = function () {
  // Clear current bill
  document.getElementById("bill-body").innerHTML = "";
  document.getElementById("total").innerText = "Total: $0";

  // Hide the print and new bill buttons
  document.getElementById("print-bill").style.display = "none";
  document.getElementById("new-bill-button").style.display = "none";

  // Reset the form
  document.getElementById("billing-form").reset();
  // Reset the medicine select options
  populateMedicineSelect();
};

// New functionality to check inventory
document.getElementById("check-inventory-button").onclick = function () {
  const today = new Date();

  for (const medicine in inventory) {
    const item = inventory[medicine];
    const expiryDate = new Date(item.expiryDate);

    // Check if the medicine is expired
    if (expiryDate < today) {
      alert(`Medicine ${medicine} is expired. Please remove from inventory.`);
      // Optionally, remove the expired medicine from the inventory
      delete inventory[medicine];
    } else if (item.quantity < 20) {
      const reorder = confirm(
        `Stock for ${medicine} is low. Do you want to reorder?`
      );
      if (reorder) {
        alert(`The medicine ${medicine} will arrive tomorrow.`);
        // Update the inventory after 5 minutes
        setTimeout(() => {
          // Simulate reordering by increasing the quantity
          item.quantity += 50; // Example: add 50 units
          displayInventory(); // Refresh inventory display
        }, 300000); // 5 minutes in milliseconds
      }
    }
  }

  displayInventory(); // Refresh inventory display
};
