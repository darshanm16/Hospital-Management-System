document.getElementById("place").addEventListener("change", function () {
  updateHospitalOptions();
});

function updateHospitalOptions() {
  const place = document.getElementById("place").value;
  const hospitalSelect = document.getElementById("hospital");

  // Clear the existing hospital options
  hospitalSelect.innerHTML = '<option value="" disabled selected>Select Hospital</option>';

  // Data for hospitals based on the selected city
  const hospitalsByCity = {
    "Bangalore": ["Manipal Hospital", "Fortis Hospital", "Apollo Hospital", "Narayana Health", "Columbia Asia Hospital"],
    "Mysore": ["JSS Hospital", "Apollo BGS Hospitals", "Columbia Asia Hospital"],
    "Hyderabad": ["KIMS Hospitals", "Yashoda Hospitals"],
    "Delhi": ["Fortis Escorts Heart Institute", "Sir Ganga Ram Hospital", "AIIMS"],
  };

  // Get hospitals for the selected city
  const hospitals = hospitalsByCity[place];

  // Populate the hospital select options
  if (hospitals) {
    hospitals.forEach(function (hospital) {
      const option = document.createElement("option");
      option.value = hospital;
      option.textContent = hospital;
      hospitalSelect.appendChild(option);
    });
  }
}

document.getElementById("hospital-form").addEventListener("submit", function (e) {
  e.preventDefault();
  checkBedAvailability();
});

function checkBedAvailability() {
  const place = document.getElementById("place").value;
  const hospital = document.getElementById("hospital").value;
  const bedType = document.getElementById("bedType").value;
  const admissionDate = document.getElementById("admissionDate").value;
  const admissionTime = document.getElementById("admissionTime").value;

  // Mock data for bed availability
  const availableBeds = {
    AC: true,
    General: false,
    ICU: true,
    FirstClass: false,
  };

  // Checking bed availability
  if (availableBeds[bedType]) {
    document.getElementById(
      "availabilityMessage"
    ).textContent = `The ${bedType} bed is available at ${hospital} in ${place}.`;
    document.getElementById("confirmAdmission").classList.remove("hidden");
    document.getElementById("confirmAdmission").onclick = function () {
      admitPatient(bedType, admissionDate, admissionTime, hospital, place);
    };
  } else {
    document.getElementById(
      "availabilityMessage"
    ).textContent = `The ${bedType} bed is not available at ${hospital} in ${place}.`;
    document.getElementById("nearbyHospitals").classList.remove("hidden");
    document.getElementById("sendRequest").classList.remove("hidden");
  }

  document.getElementById("availability").classList.remove("hidden");
}

function admitPatient(bedType, date, time, hospital, place) {
  alert(`Patient admitted to ${bedType} bed at ${hospital} in ${place} on ${date} at ${time}`);
  updateBedStatus(bedType, "occupied");
  clearForm();
}

function updateBedStatus(bedType, status) {
  console.log(`${bedType} bed status updated to: ${status}`);
}

function clearForm() {
  document.getElementById("place").value = "";
  document.getElementById("hospital").value = "";
  document.getElementById("bedType").value = "";
  document.getElementById("admissionDate").value = "";
  document.getElementById("admissionTime").value = "";

  document.getElementById("availability").classList.add("hidden");
  document.getElementById("confirmAdmission").classList.add("hidden");
  document.getElementById("nearbyHospitals").classList.add("hidden");
  document.getElementById("availabilityMessage").textContent = "";
}

document.getElementById("sendRequest").addEventListener("click", function () {
  showNearbyHospitalBeds(); // Show nearby hospitals with bed availability
});

function showNearbyHospitalBeds() {
  const bedType = document.getElementById("bedType").value;

  // Mock data for nearby hospitals and bed availability
  const nearbyHospitals = [
    { name: "City Hospital", available: true },
    { name: "Greenfield Hospital", available: false },
    { name: "Sunshine Clinic", available: true },
  ];

  let availableHospitals = nearbyHospitals.filter(
    (hospital) => hospital.available
  );

  if (availableHospitals.length > 0) {
    let hospitalsList = availableHospitals
      .map((hospital) => hospital.name)
      .join(", ");
    document.getElementById(
      "availabilityMessage"
    ).textContent = `Beds available in: ${hospitalsList}`;

    // Allow the user to confirm admission in another hospital
    document.getElementById("confirmAdmission").classList.remove("hidden");
    document.getElementById("confirmAdmission").onclick = function () {
      admitPatient(bedType, "Nearby Hospital", "As per availability", "Nearby", "Nearby");
    };
  } else {
    document.getElementById("availabilityMessage").textContent =
      "No beds available in nearby hospitals.";
  }

  document.getElementById("nearbyHospitals").classList.add("hidden"); // Hide nearby hospital message
}
