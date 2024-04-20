document.addEventListener('DOMContentLoaded', () => {
    // Listener for the signup radio button
    document.getElementById('signup').addEventListener('change', function() {
        const formInner = document.getElementById('formInner');
        if (this.checked) {
            formInner.style.transform = 'translateX(-50%)';
            document.getElementById('roleSelection').style.display = 'flex';
        }
    });
  
    // Listener for the login radio button
    document.getElementById('login').addEventListener('change', function() {
        const formInner = document.getElementById('formInner');
        if (this.checked) {
            formInner.style.transform = 'translateX(0%)';
            document.getElementById('roleSelection').style.display = 'none';
            document.getElementById('patientForm').style.display = 'none';
            document.getElementById('doctorForm').style.display = 'none';
        }
    });
  
    // Event listener for Patient button
    document.getElementById('patientBtn').addEventListener('click', () => {
        document.getElementById('roleSelection').style.display = 'none'; // Hide role selection
        document.getElementById('patientForm').style.display = 'block';
        document.getElementById('doctorForm').style.display = 'none';
    });
  
    // Event listener for Doctor button
    document.getElementById('doctorBtn').addEventListener('click', () => {
        document.getElementById('roleSelection').style.display = 'none'; // Hide role selection
        document.getElementById('patientForm').style.display = 'none';
        document.getElementById('doctorForm').style.display = 'block';
    });
  
    document.getElementById('createNewAccount').addEventListener('click', (e) => {
      e.preventDefault(); // Prevent the default anchor action
      document.getElementById('signup').checked = true; // Check the signup radio button
      document.getElementById('roleSelection').style.display = 'flex'; // Show role selection
      const formInner = document.getElementById('formInner');
      formInner.style.transform = 'translateX(-50%)'; // Adjust formInner position for signup view
  });
  
  });
  