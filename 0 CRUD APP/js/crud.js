const menuIcon = document.getElementById("menu_icon"); // Menu icon
const sideBar = document.getElementById("sidebar"); // Sidebar
const mainContent = document.getElementById("main_content"); // Main content
const mediaQuery850To1400 = window.matchMedia("(min-width:850px) and (max-width:1400px)"); // Between 850px & 1400px media query
const userName = document.getElementById("user_name"); // Welcome message text
// ------------------ Table variables ------------------
const tableBody = document.querySelector("#table tbody"); // Table body
// ------------------ Modal variables ------------------
const modal = document.getElementById("data_modal"); // Data modal
const modalCard = document.querySelector("#data_modal .modal-card"); // Modal card
const modalOverlay = document.querySelector("#data_modal .modal-overlay"); // Modal overlay
const modalCardHeader = document.querySelector(".modal-card .modal-card-header"); // Modal card header
const modalCardBody = document.querySelector(".modal-card .modal-card-body"); // Modal card body
const modalCardFooter = document.querySelector(".modal-card .modal-card-footer"); // Modal card footer
const modalCardHeaderHeading = document.querySelector(".modal-card-header h3"); // Header heading
const modalCardHeaderCloseBtn = document.querySelector(".modal-card-header span"); // Header close button
// ------------------ Sidebar variable ------------------
const addRecordLink = document.getElementById("add_record_link"); // Add new record sidebar link
const viewRecordLink = document.getElementById("view_record_link"); // View record sidebar link
const updateRecordLink = document.getElementById("update_record_link"); // Update record sidebar link
const deleteRecordLink = document.getElementById("delete_record_link"); // Delete record sidebar link
const updateNameLink = document.getElementById("update_name_link"); // Update your name sidebar link
const deleteAllLink = document.getElementById("delete_all_link"); // Delete all records sidebar link
// ------------------ All Data ------------------
let all_record = []; // Array of object to hold all records
setPersonalName(); // Set personal name
noRecordToDisplayMsg(); // Set default message if user record isn't available

// ================= Events =================
// Menu icon click event listner, handle opening & closing of sidebar
menuIcon.addEventListener("click", () => {
  sideBar.classList.toggle("open"); //  Change width of sidebar
  mainContent.classList.toggle("open"); // Add margin left to main content
});

// Media query change event listner between 850px & 1400px, handle layout arrangment.
mediaQuery850To1400.addEventListener("change", (e) => {
  if (e.matches) {
    sideBar.classList.add("open"); //  Change width of sidebar
    mainContent.classList.add("open"); // Add margin left to main content
  } else {
    sideBar.classList.remove("open"); //  Change width of sidebar
    mainContent.classList.remove("open"); // Add margin left to main content
  }
});

// Open add new record modal (Add new link sidebar button click)
addRecordLink.addEventListener("click", () => {
  const title = "Add New Record";
  const inputFieldsData = [
    convertInputDataToObject("name", "Name", "Enter Name", "text", true, false, null), // Name input field data
    convertInputDataToObject("email", "Email", "Enter Email", "email", true, false, null), // Email input field data
  ];
  const formBtns = [
    convertFormButtonsToObject("button", "Cancel", ["modal-btn", "btn-cancel"]),
    convertFormButtonsToObject("submit", "Add Record", ["modal-btn", "btn-submit"]),
  ]; // Form cancel & submit buttons
  const form = createForm();
  createModal(title, inputFieldsData, formBtns); // Create add new record modal
  const emailField = document.querySelector(".modal-card-body input[type=email]"); // Email input field
  emailField.addEventListener("change", emailEventListner); // Input field change event for checking duplicate email
  form.addEventListener("submit", addRecord); // Form submit event listner
  showModal();
});

// Open search modal (View record by ID sidebar button click)
viewRecordLink.addEventListener("click", () => {
  const title = "Search Record";
  const inputFieldsData = [
    convertInputDataToObject("id", "Search Record", "Enter ID", "number", true, false, null), // Search input field & label
  ];
  const formBtns = [
    convertFormButtonsToObject("button", "Cancel", ["modal-btn", "btn-cancel"]),
    convertFormButtonsToObject("submit", "Search Record", ["modal-btn", "btn-submit"]),
  ]; // Form cancel & search buttons
  const form = createForm();
  createModal(title, inputFieldsData, formBtns); // Create search record modal
  const searchField = document.querySelector(".modal-card-body input[type=number]"); // Search input field
  searchField.addEventListener("change", numberEventListner); // Input field change event for checking record existance
  form.addEventListener("submit", viewRecord);
  showModal();
});

// Close modal on close button click
modalCardHeaderCloseBtn.addEventListener("click", hideModal);

// Close modal on overlay click
modalOverlay.addEventListener("click", hideModal);

// ================= Functions =================
/**
 * Add new user & display in table
 * @param {Event} e HTML event
 */
function addRecord(e) {
  e.preventDefault();
  let userData = { id: all_record.length + 1 };
  let formData = new FormData(e.target); // Get form values
  formData = Object.fromEntries(formData); // Convert form values to object
  userData = { ...userData, ...formData };
  userData["createdAt"] = new Date().toLocaleString();
  // userData = {id, name, email, createdAt}
  all_record.push(userData); // Push record into array
  if (all_record.length === 1) removeNoRecordToDisplayMsg(); // Remove no data to display msg
  addNewTableRow(userData); // Add new table row
  hideModal();
}

/**
 * Hide search modal & display user record modal
 * @param {Event} e HTML event object
 */
function viewRecord(e) {
  e.preventDefault();
  let data = new FormData(e.target); // Get form values
  data = Object.fromEntries(data); // Convert form values to object
  data.id = data.id - 1; // Decrement user id by 1 because array start from 0 and user record id start from 1
  hideModal(); // Hide search modal
  // Show view record modal after hiding search record modal
  setTimeout(() => {
    const userData = all_record[data.id]; // Extract user data from array
    const title = "View Record"; // Modal title
    const inputFieldsData = [
      convertInputDataToObject("name", "Name", null, "text", false, true, userData.name), // Name Input field
      convertInputDataToObject("email", "Email", null, "email", false, true, userData.email), // Email Input field
      convertInputDataToObject("createdAt", "Created At", null, "text", false, true, userData.createdAt), // Created At Input field
    ];
    const formBtns = [convertFormButtonsToObject("button", "Go Back", ["modal-btn", "btn-cancel"])]; // Form go back button
    // Form creation is important because when removeModalFields function remove form. (No form here means error)
    const form = createForm();
    createModal(title, inputFieldsData, formBtns);
    showModal();
  }, 700);
}

/**
 * Create modal input fields, buttons & set title
 * @param {string} title Modal heading
 * @param {Array<object>} inputFieldsData Input fields data
 * @param {Array<object>} formBtns Form cancel & submit button data
 */
function createModal(title, inputFieldsData, formBtns) {
  modalCardHeaderHeading.innerText = title; // Set modal title
  // Loop through each input fields & append that input field into modal card body
  inputFieldsData.forEach((element) => {
    const div = document.createElement("div");
    const inputField = createInputField(element); // Input field & label (List)
    for (let elem of inputField) div.appendChild(elem); // Append input field & label into div
    modalCardBody.appendChild(div); // Append input field & label into modal card body
  });
  // Modal buttons
  formBtns.forEach((element) => {
    const inputField = document.createElement("input"); // Create input field
    inputField.type = element.type;
    inputField.value = element.value;
    inputField.classList.add(...element.classList);
    if (inputField.type === "button") inputField.addEventListener("click", hideModal); // Cancel button event listner
    modalCardFooter.appendChild(inputField); // Append form button
  });
}

/**
 * Create form & return
 * @returns {HTMLElement} form
 */
function createForm() {
  const form = document.createElement("form"); // Create form
  form.method = "POST";
  form.appendChild(modalCardBody);
  form.appendChild(modalCardFooter);
  modalCardHeader.insertAdjacentElement("afterend", form); // Insert form after modal header
  return form;
}

/**
 * Change event listner for input type email fields to check duplicate email
 * @param {Event} e HTML event object
 */
function emailEventListner(e) {
  const submitBtn = document.querySelector(".modal-card-footer input[type=submit]"); // Form submit button
  const email = e.target.value; // Extracting email
  const errorAlert = e.target.nextElementSibling; // Extracting next sibling (always error alert)
  if (errorAlert) errorAlert.remove(); // Remove error alert
  // If email already exisit in record
  if (checkDuplicateEmail(email)) {
    submitBtn.disabled = true; // Disable submit button
    const errorElement = createErrorAlert("Email already exisit");
    e.target.insertAdjacentElement("afterend", errorElement);
  } else submitBtn.disabled = false; // Enable submit button
}

/**
 * Change event listner for input type number fields to check record existance
 * @param {Event} e HTML event object
 */
function numberEventListner(e) {
  const submitBtn = document.querySelector(".modal-card-footer input[type=submit]"); // Form submit button
  const id = e.target.value; // Extract id
  const errorAlert = e.target.nextElementSibling; // Extracting next sibling (always error alert)
  if (errorAlert) errorAlert.remove(); // Remove error alert
  // If no record exist show No record to display error
  if (all_record.length <= 0) {
    submitBtn.disabled = true; // Disable submit button
    const errorElement = createErrorAlert("No record to display");
    e.target.insertAdjacentElement("afterend", errorElement);
    // If user input is not +ve value  show ID must be greate than 0 error
  } else if (id <= 0) {
    submitBtn.disabled = true; // Disable submit button
    const errorElement = createErrorAlert("ID must be greate than 0");
    e.target.insertAdjacentElement("afterend", errorElement);
    // If id greater than total records show ID doesn't exist error
  } else if (id > all_record.length) {
    submitBtn.disabled = true; // Disable submit button
    const errorElement = createErrorAlert("ID doesn't exist");
    e.target.insertAdjacentElement("afterend", errorElement);
  } else submitBtn.disabled = false; // Enable submit button
}

/**
 * Create new table row
 * @param {object} userData Object containg user information
 */
function addNewTableRow(userData) {
  const dataValues = Object.values(userData); // Convert object values to array
  const tableRow = document.createElement("tr");
  // Loop through data & create table data
  for (let value of dataValues) {
    const tableData = document.createElement("td");
    tableData.innerText = value;
    tableRow.appendChild(tableData); // Append td into tr
  }
  const editIcon = createIcon("edit", ["material-icons", "edit"]); // Edit icon
  const deleteIcon = createIcon("delete", ["material-icons", "delete"]); // Delete icon
  const actionColumn = document.createElement("td"); // Create action coluns
  actionColumn.appendChild(editIcon);
  actionColumn.appendChild(deleteIcon);
  tableRow.appendChild(actionColumn); // Append td into tr
  tableBody.appendChild(tableRow); // Append tr into tbody
}

/**
 *
 * @param {string} email Email of found in exisiting data
 * @returns {boolean} true if email found else false
 */
function checkDuplicateEmail(email) {
  let found = false;
  for (let dataObj of all_record) if (dataObj.email === email) found = true;
  return found;
}

/**
 * Create input field & label
 * @param {object} inputData Contain data for input field & label
 * @returns {Array<HTMLElement>} input field & label
 */
function createInputField(inputData) {
  const label = document.createElement("label");
  label.setAttribute("for", inputData.for);
  label.innerText = inputData.innerText;
  const inputField = document.createElement("input");
  inputField.id = inputData.for;
  inputField.placeholder = inputData.placeholder;
  inputField.type = inputData.type;
  inputField.required = inputData.required;
  inputField.disabled = inputData.disabled;
  inputField.name = inputData.for;
  inputField.value = inputData.value;
  return [label, inputField];
}

/**
 * Convert input field & label data into object & return object
 * @param {string} forID For & ID attribute of input field & label
 * @param {string} innerText Label inner Text
 * @param {string} placeholder Input field Placeholder text
 * @param {string} type Input field type attribute
 * @param {boolean} required Input field required attribute
 * @param {boolean} disabled Input field disabled attribute
 * @param {string} value Input field value
 * @returns {object} Object containing input field data
 */
function convertInputDataToObject(forID, innerText, placeholder, type, required, disabled, value) {
  return {
    for: forID,
    innerText,
    placeholder,
    type,
    required,
    disabled,
    value,
  };
}

/**
 * Convert form cancel, submit & etc buttons data into object & return object
 * @param {string} type Input field type attribute
 * @param {string} value Input field value
 * @param {Array<string>} classList List of classes to be added
 * @returns {object} Object containg button data
 */
function convertFormButtonsToObject(type, value, classList) {
  return {
    type,
    value,
    classList,
  };
}

/**
 * Display modal
 */
function showModal() {
  modal.classList.add("open"); // Display modal
  modalCard.classList.add("animation-open"); // Add slide down animation
}

/**
 * Hide modal
 */
function hideModal() {
  modalCard.classList.remove("animation-open"); // Hide modal card
  setTimeout(() => {
    modal.classList.remove("open"); // Hide modal
    removeModalFields(); // Remove modal fields & buttons
  }, 650);
}

/**
 * Remove form fields, buttons & form
 */
function removeModalFields() {
  const modalCardDivs = document.querySelectorAll(".modal-card-body div"); // Name & email input fields
  const modalFooterBtns = document.querySelectorAll(".modal-card-footer input"); // Submit & cancel buttons
  const modalForm = document.querySelector(".modal-card form"); // Form
  modalCardDivs.forEach((element) => {
    element.remove(); // Removing input fields
  });
  modalFooterBtns.forEach((element) => {
    element.remove(); // Removing buttons
  });
  modalForm.remove(); // Remove form
}

/**
 * Create icon & return
 * @param {string} innerText Icon Name
 * @param {Array<string>} classList List of classes to be added
 * @returns {HTMLElement} icon
 */
function createIcon(innerText, classList) {
  const icon = document.createElement("span"); // Create icon
  icon.innerText = innerText;
  icon.classList.add(...classList);
  return icon;
}

/**
 * Create error alert & return
 * @param {string} errorMsg Error message to display
 * @returns {HTMLElement} error alert
 */
function createErrorAlert(errorMsg) {
  const errorAlert = document.createElement("div");
  errorAlert.classList.add("error-alert");
  errorAlert.innerText = errorMsg;
  return errorAlert;
}
/**
 * Set person name
 */
function setPersonalName() {
  let name = localStorage.getItem("name"); // Get name from local storage
  userName.innerText = `Welcome  ${name ? name : "Dear"}`; // If name exist then set NAME else set DEAR
}

/**
 *  Display no data to display message when user record isn't available
 */
function noRecordToDisplayMsg() {
  const msgRow = document.createElement("tr"); // tr
  const msgData = document.createElement("td"); // td
  msgData.innerText = "No Record to Display"; // Set td inner text
  msgData.colSpan = 5;
  msgData.classList.add("no-record-data");
  msgRow.classList.add("no-record-row");
  msgRow.appendChild(msgData); // Append td into tr
  tableBody.appendChild(msgRow); // Append tr into tbody
}

/**
 * Remove no data to display message
 */
function removeNoRecordToDisplayMsg() {
  const tr = document.querySelector("#table tbody tr.no-record-row"); // Extract no data to display table row
  tr.remove();
}
