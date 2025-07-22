// Workshop toggle functionality - Global function
function toggleWorkshop(header) {
  const workshopItem = header.parentElement;
  const isActive = workshopItem.classList.contains('active');
  
  // Close all other workshops
  document.querySelectorAll('.workshop-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Toggle current workshop
  if (!isActive) {
    workshopItem.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Floating Icons Management
  function createFloatingIcons() {
    const container = document.getElementById('floatingIcons');
    if (!container) return;
    
    // Create additional icons for more variety
    for (let i = 0; i < 4; i++) {
      const icon = document.createElement('img');
      icon.src = 'assets/icon.png';
      icon.alt = '';
      icon.className = 'floating-icon';
      
      // Randomize properties for natural movement
      const delay = Math.random() * 20;
      const duration = 20 + Math.random() * 20; // 20-40 seconds
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      icon.style.setProperty('--delay', `${delay}s`);
      icon.style.setProperty('--duration', `${duration}s`);
      icon.style.setProperty('--direction', direction);
      
      container.appendChild(icon);
    }
  }
  
  // Initialize floating icons
  createFloatingIcons();

  // Smooth scrolling for all anchor links (including nav links and register button)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        e.preventDefault();
        const navHeight = 100; // Height of nav bar + some buffer
        const targetPosition = targetSection.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Logo transition on scroll
  const logoDefault = document.getElementById('logo-default');
  const logoScrolled = document.getElementById('logo-scrolled');
  
  function updateLogo() {
    const scrollPosition = window.scrollY;
    // Lower threshold for mobile
    let threshold = 650;
    if (window.innerWidth <= 700) {
      threshold = 120;
    }
    if (scrollPosition > threshold) {
      // Scrolled down - show regular logo
      logoDefault.style.display = 'none';
      logoScrolled.style.display = 'block';
    } else {
      // At top - show white logo
      logoDefault.style.display = 'block';
      logoScrolled.style.display = 'none';
    }
  }
  
  // Update logo on scroll
  window.addEventListener('scroll', updateLogo);
  
  // Initial logo state
  updateLogo();

  // Registration form validation
  const form = document.getElementById('registrationForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      let valid = true;
      // Clear previous errors
      form.querySelectorAll('.error-msg').forEach(el => el.remove());
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Helper to show error
      function showError(input, msg) {
        valid = false;
        input.classList.add('error');
        const err = document.createElement('div');
        err.className = 'error-msg';
        err.style.color = '#ff8c1a';
        err.style.fontSize = '0.97em';
        err.style.marginTop = '3px';
        err.textContent = msg;
        if (input.parentElement) input.parentElement.appendChild(err);
      }

      // Required fields
      const requiredFields = [
        'fullName', 'major', 'gradYear', 'phone', 'email', 'isMech', 'ticketType'
      ];
      requiredFields.forEach(id => {
        if (id === 'isMech' || id === 'ticketType') {
          const checked = form.querySelector(`input[name="${id}"]:checked`);
          if (!checked) {
            const group = form.querySelector(`input[name="${id}"]`).closest('.form-group');
            showError(group, 'This field is required.');
          }
        } else {
          const input = form.querySelector(`#${id}`);
          if (!input.value.trim()) {
            showError(input, 'This field is required.');
          }
        }
      });

      // Email format
      const email = form.email.value.trim();
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        showError(form.email, 'Please enter a valid email address.');
      }

      // Phone format (Egyptian example)
      const phone = form.phone.value.trim();
      if (phone && !/^\+?20\s?1[0-9]{9}$/.test(phone.replace(/\s+/g, ''))) {
        showError(form.phone, 'Please enter a valid Egyptian phone number.');
      }

      // Graduation year reasonable check
      const gradYear = parseInt(form.gradYear.value, 10);
      if (gradYear && (gradYear < 2024 || gradYear > 2100)) {
        showError(form.gradYear, 'Please enter a valid graduation year.');
      }

      // Workshop selection (exactly 2)
      const workshops = form.querySelectorAll('input[name="workshops"]:checked');
      if (workshops.length !== 2) {
        const group = document.getElementById('workshopGroup');
        showError(group, 'Please select exactly 2 workshops.');
      }

      // LinkedIn URL (if provided)
      const linkedin = form.linkedin.value.trim();
      if (linkedin && !/^https?:\/\/(www\.)?linkedin\.com\//.test(linkedin)) {
        showError(form.linkedin, 'Please enter a valid LinkedIn profile URL.');
      }

      // File upload (CV) - optional, but if present, check type/size
      const cv = form.cv.files[0];
      if (cv) {
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(cv.type)) {
          showError(form.cv, 'CV must be a PDF or Word document.');
        }
        if (cv.size > 2 * 1024 * 1024) {
          showError(form.cv, 'CV file size must be under 2MB.');
        }
      }

      // If not valid, prevent submission
      if (!valid) {
        e.preventDefault();
      }
      // If valid, do nothing (allow default submission to Basin)
    });

    // Limit workshop selection to 2
    const workshopBoxes = form.querySelectorAll('input[name="workshops"]');
    workshopBoxes.forEach(box => {
      box.addEventListener('change', function() {
        const checked = form.querySelectorAll('input[name="workshops"]:checked');
        if (checked.length > 2) {
          this.checked = false;
        }
      });
    });
  }
}); 
