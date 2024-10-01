document.addEventListener("DOMContentLoaded", function () {
  const locationSelect = document.getElementById("locationSelect");
  const hospitalSelect = document.getElementById("hospitalSelect");
  const specialistSelect = document.getElementById("specialistSelect");
  const doctorSelect = document.getElementById("doctorSelect");
  const dateSelect = document.getElementById("dateSelect");
  const timeSelect = document.getElementById("timeSelect");
  const bookingForm = document.getElementById("bookingForm");
  const appointmentList = document.getElementById("appointments");
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const clearButton = document.getElementById("clearButton");

  // Hospital list by location
  const hospitalsByLocation = {
    Bangalore: [
      "Manipal Hospital",
      "Fortis Hospital",
      "Apollo Hospital",
      "Narayana Health",
      "Columbia Asia Hospital"
    ],
    Mysore: [
      "JSS Hospital",
      "Apollo BGS Hospitals",
      "Columbia Asia Hospital"
    ],
    Hyderabad: [
      "KIMS Hospitals",
      "Yashoda Hospitals"
    ],
    Delhi: [
      "Fortis Escorts Heart Institute",
      "Sir Ganga Ram Hospital",
      "AIIMS"
    ]
  };

  // Doctor list by specialization
  const doctors = {
    cardiology: [
      { value: "dr_smith", name: "Dr. Smith" },
      { value: "dr_jane", name: "Dr. Jane" }
    ],
    neurology: [
      { value: "dr_clark", name: "Dr. Clark" },
      { value: "dr_emily", name: "Dr. Emily" }
    ],
    orthopedics: [
      { value: "dr_lee", name: "Dr. Lee" },
      { value: "dr_aaron", name: "Dr. Aaron" }
    ]
  };

  // Time slots
  const timeSlots = [
    "09:00 AM", "09:10 AM", "09:20 AM", "09:30 AM", "09:40 AM", "09:50 AM",
    "10:00 AM", "10:10 AM", "10:20 AM", "10:30 AM", "10:40 AM", "10:50 AM",
    "11:00 AM", "11:10 AM", "11:20 AM", "11:30 AM", "11:40 AM", "11:50 AM",
    "12:00 PM"
  ];

  // Step 1: Select location and populate hospital options
  locationSelect.addEventListener("change", function () {
    const location = locationSelect.value;
    hospitalSelect.innerHTML = '<option value="">--Select Hospital--</option>'; // Reset hospital list
    specialistSelect.disabled = true;
    doctorSelect.disabled = true;
    dateSelect.disabled = true;
    timeSelect.disabled = true;
    submitButton.disabled = true;

    if (location && hospitalsByLocation[location]) {
      hospitalsByLocation[location].forEach((hospital) => {
        const option = document.createElement("option");
        option.value = hospital;
        option.textContent = hospital;
        hospitalSelect.appendChild(option);
      });
      hospitalSelect.disabled = false;
    }
  });

  // Step 2: Select hospital and enable specialist selection
  hospitalSelect.addEventListener("change", function () {
    if (hospitalSelect.value) {
      specialistSelect.disabled = false;
    } else {
      specialistSelect.disabled = true;
      doctorSelect.disabled = true;
      dateSelect.disabled = true;
      timeSelect.disabled = true;
      submitButton.disabled = true;
    }
  });

  // Step 3: Select specialist and enable doctor selection
  specialistSelect.addEventListener("change", function () {
    const specialist = specialistSelect.value;
    doctorSelect.innerHTML = '<option value="">--Select Doctor--</option>'; // Reset doctor list
    dateSelect.disabled = true;
    timeSelect.disabled = true;
    submitButton.disabled = true;

    if (specialist && doctors[specialist]) {
      doctors[specialist].forEach((doctor) => {
        const option = document.createElement("option");
        option.value = doctor.value;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
      });
      doctorSelect.disabled = false;
    }
  });

  // Step 4: Select doctor and enable date selection
  doctorSelect.addEventListener("change", function () {
    if (doctorSelect.value) {
      dateSelect.disabled = false;
    } else {
      dateSelect.disabled = true;
      timeSelect.disabled = true;
      submitButton.disabled = true;
    }
  });

  // Step 5: Select date and populate time slots
  dateSelect.addEventListener("change", function () {
    if (dateSelect.value) {
      timeSelect.innerHTML = ""; // Reset time slots
      timeSlots.forEach((slot) => {
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });
      timeSelect.disabled = false;
      submitButton.disabled = false;
    } else {
      timeSelect.disabled = true;
      submitButton.disabled = true;
    }
  });

  // Step 6: Booking form submission
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const location = locationSelect.options[locationSelect.selectedIndex].text;
    const hospital = hospitalSelect.options[hospitalSelect.selectedIndex].text;
    const specialist = specialistSelect.options[specialistSelect.selectedIndex].text;
    const doctor = doctorSelect.options[doctorSelect.selectedIndex].text;
    const date = dateSelect.value;
    const time = timeSelect.value;

    // Add booked appointment to the list
    const listItem = document.createElement("li");
    listItem.textContent = `Location: ${location}, Hospital: ${hospital}, Specialist: ${specialist}, Doctor: ${doctor} | Date: ${date} | Time: ${time}`;
    appointmentList.appendChild(listItem);

    // Remove the selected time slot after booking
    timeSelect.remove(timeSelect.selectedIndex);

    alert("Appointment booked successfully!");
  });

  // Step 7: Clear button functionality
  clearButton.addEventListener("click", function () {
    // Reset form fields
    bookingForm.reset();

    // Reset hospital select
    hospitalSelect.innerHTML = '<option value="">--Select Hospital--</option>';
    hospitalSelect.disabled = true;

    // Reset specialist select
    specialistSelect.innerHTML = '<option value="">--Select Specialist--</option>';
    specialistSelect.disabled = true;

    // Reset doctor select
    doctorSelect.innerHTML = '<option value="">--Select Doctor--</option>';
    doctorSelect.disabled = true;

    // Reset date and time slots
    dateSelect.disabled = true;
    timeSelect.innerHTML = "";
    timeSelect.disabled = true;

    // Disable submit button
    submitButton.disabled = true;
  });
});
