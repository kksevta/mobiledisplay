window.onload = function() {
  clearLocalStorage()
};

function addMobile(event) {
  var addedMobiles = getFromLocalStorage() || [];
  var newMobile = {}
  newMobile.Brand_Name = document.getElementById('txtBrandName').value;
  newMobile.Model = document.getElementById('txtModel').value;
  newMobile.Screen_Size = document.getElementById('txtScreenSize').value;
  newMobile.Release_Date = document.getElementById('txtReleaseDate').value;
  newMobile.Memory = document.getElementById('txtMemory').value;
  if (checkFormValidation(newMobile)) {
    document.getElementById('errorContainer').innerHTML = ""
    document.getElementById('errorContainer').className = "hidden";
    addedMobiles.push(newMobile);
    addToLocalStorage(addedMobiles);
    new CreateTable('compContainer', getFromLocalStorage(), 5, 'Brand_Name');
  } else {
    document.getElementById('errorContainer').innerHTML = "All fields are required"
    document.getElementById('errorContainer').className = "alert alert-danger";
  }
}

function createNewTable() {
  new CreateTable('compContainer', getFromLocalStorage(), 5, 'Brand_Name');
}

function checkFormValidation(newMobile) {
  for (var prop in newMobile) {
    if (!newMobile[prop]) {
      return false
    }
  }
  return true
}

function clearLocalStorage() {
  return localStorage.removeItem('mobilesData')
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem('mobilesData'));
}

function addToLocalStorage(mobilesData) {
  return localStorage.setItem('mobilesData', JSON.stringify(mobilesData));
}