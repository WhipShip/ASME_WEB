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
  // Mobile Menu Functionality
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners for mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking on a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function(e) {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });

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

  // Speaker Modal Functionality
  const speakerModal = document.getElementById('speakerModal');
  const modalClose = document.getElementById('modalClose');
  const speakerCards = document.querySelectorAll('.speaker-card');
  
  // Navigation elements
  const modalNavPrev = document.getElementById('modalNavPrev');
  const modalNavNext = document.getElementById('modalNavNext');
  const modalMobileNavPrev = document.getElementById('modalMobileNavPrev');
  const modalMobileNavNext = document.getElementById('modalMobileNavNext');
  
  // Speaker data with actual sessions
  const speakerData = {
    'Dr. Mohamed Ismail': {
      initial: 'M',
      image: 'Speakers/Mohamed_Ismael.png',
      title: 'Lecturer at EUI, Faculty of Engineering',
      session: {
        title: 'EUI x ASME CU Opening Talk',
        date: 'August 9, 2025',
        time: '09:45 - 10:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Dr. Shereen': {
      initial: 'S',
      image: 'Speakers/Shereen.png',
      title: 'Digitization and Supply Chain Consultant',
      session: {
        title: 'Supply Chain: Transforming Industry with Innovative Solutions',
        date: 'August 9, 2025',
        time: '11:15 - 12:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Mohamed Mostafa': {
      initial: 'M',
      image: 'Speakers/Mohamed_Mostafa.png',
      title: 'Continuous Improvement Manager',
      session: {
        title: 'Supply Chain: Transforming Industry with Innovative Solutions',
        date: 'August 9, 2025',
        time: '11:15 - 12:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Amr Moheb': {
      initial: 'A',
      image: 'Speakers/Amr_Moheb.png',
      title: 'Senior Logistics Manager @Noon',
      session: {
        title: 'Supply Chain: Transforming Industry with Innovative Solutions',
        date: 'August 9, 2025',
        time: '11:15 - 12:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Mohamed Foad': {
      initial: 'M',
      image: 'Speakers/Mohamed_Fouad.png',
      title: 'Business Transformation Consultant at Excellence Center UAE',
      session: {
        title: 'Supply Chain: Transforming Industry with Innovative Solutions',
        date: 'August 9, 2025',
        time: '11:15 - 12:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Abdelazeem': {
      initial: 'A',
      title: 'Moderator',
      session: {
        title: 'Supply Chain: Transforming Industry with Innovative Solutions',
        date: 'August 9, 2025',
        time: '11:15 - 12:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Mohamed Fawzy': {
      initial: 'M',
      image: 'Speakers/Mohamed_Fawzy.png',
      title: 'Head of BIM Department at Saudi Diyar Consulting',
      session: {
        title: 'The Power of BIM',
        date: 'August 9, 2025',
        time: '12:30 - 1:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Negmeidien': {
      image: 'Speakers/Ahmed_Negm.png',
      initial: 'A',
      title: 'BIM Manager at EDECS',
      session: {
        title: 'The Power of BIM',
        date: 'August 9, 2025',
        time: '12:30 - 1:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Kamal Shawky': {
      image: 'Speakers/Kamal.png',
      initial: 'K',
      title: 'CEO of First Option and Updated Solution',
      session: {
        title: 'The Power of BIM',
        date: 'August 9, 2025',
        time: '12:30 - 1:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Mohamed Salah': {
      initial: 'M',
      title: 'Moderator',
      session: {
        title: 'The Power of BIM',
        date: 'August 9, 2025',
        time: '12:30 - 1:15',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Adel Samir': {
      image: 'Speakers/Adel_Samir.png',
      initial: 'A',
      title: 'Chief Human Resources Officer @ Elmarakby Steel',
      session: {
        title: 'Real Career Journeys',
        date: 'August 9, 2025',
        time: '1:45 - 2:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ramy Saleh': {
      image: 'Speakers/Ramy_Saleh.png',
      initial: 'R',
      title: 'Chief of Business Development @ Elmarakby Steel',
      session: {
        title: 'Real Career Journeys',
        date: 'August 9, 2025',
        time: '1:45 - 2:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Adie Hatem': {
      initial: 'A',
      image: 'Speakers/Adie_Hatem.png',
      title: 'Founder & CEO of ing creative Co.',
      session: {
        title: 'Think Like an Entrepreneur',
        date: 'August 9, 2025',
        time: '3:00 - 3:45',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Hatem': {
      initial: 'A',
      image: 'Speakers/Ahmed_Hatem.png',
      title: 'SUTRA Co-Founder and CMO',
      session: {
        title: 'Think Like an Entrepreneur',
        date: 'August 9, 2025',
        time: '3:00 - 3:45',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Nagy': {
      image: 'Speakers/Ahmed_Nagy.png',
      initial: 'A',
      title: 'Seasoned HR Consultant and the Founder & CEO of HRins Egypt',
      session: {
        title: 'Stand Out & Get Hired: Your CV, Your Brand',
        date: 'August 9, 2025',
        time: '4:00 - 4:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Mohmed Abdelmoniem': {
      initial: 'M',
      image: 'Speakers/Ahmed_Abdelmoneim.png',
      title: 'General Manager at ALX Africa',
      session: {
        title: 'Smart Technologies, Smart Future with AI',
        date: 'August 9, 2025',
        time: '4:45 - 5:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Adel': {
      initial: 'A',
      image: 'Speakers/Ahmed_Adel.png',
      title: 'Founder of CardoO',
      session: {
        title: 'Smart Technologies, Smart Future with AI',
        date: 'August 9, 2025',
        time: '4:45 - 5:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Taha': {
      initial: 'A',
      image: 'Speakers/Ahmed_Taha.jpg',
      title: 'Software team lead @ nfrtix',
      session: {
        title: 'Smart Technologies, Smart Future with AI',
        date: 'August 9, 2025',
        time: '4:45 - 5:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Khoulod': {
      initial: 'K',
      title: 'Moderator',
      session: {
        title: 'Smart Technologies, Smart Future with AI',
        date: 'August 9, 2025',
        time: '4:45 - 5:30',
        location: 'Prof. Reem Bahgat Hall (Main Stage)'
      }
    },
    'Ahmed Hamed': {
      initial: 'A',
      image: 'Speakers/Ahmed_Hamed.png',
      title: 'Assistant Professor, Mechanical Power Engineering, Cairo University',
      session: {
        title: 'Sustainability',
        date: 'August 9, 2025',
        time: '11:00 - 11:45',
        location: 'Room 218 (Lecture Hall 1)'
      }
    },
    'Mostafa Hassan': {
      image: 'Speakers/Mostafa_Hassan.png',
      initial: 'M',
      title: 'GM at Origin-labs & OIS for smart factories',
      session: {
        title: 'Industry 4.0 + Competition',
        date: 'August 9, 2025',
        time: '12:15 - 1:15',
        location: 'Room 218 (Lecture Hall 1)'
      }
    },
    'Mohamed Lotfy': {
      initial: 'M',
      image: 'Speakers/Mohamed_Lotfy.png',
      title: 'Senior Supply Chain Material & Production Planning Engineer',
      session: {
        title: 'Supply Chain Digital Transformation',
        date: 'August 9, 2025',
        time: '1:30 - 2:30',
        location: 'Room 218 (Lecture Hall 1)'
      }
    },
    'Ahmed Abdelnasser': {
      initial: 'A',
      image: 'Speakers/Ahmed_Abdelnasser.png',
      title: 'SOLIDWORKS Expert CAD & Simulation',
      session: {
        title: 'Reverse Engineering and Design using SolidWorks + Competition',
        date: 'August 9, 2025',
        time: '2:45 - 3:45',
        location: 'Room 218 (Lecture Hall 1)'
      }
    },
    'Mohannad Alzhairy': {
      initial: 'M',
      image: 'Speakers/Mohannad_Alzhairy.png',
      title: 'Application Engineer at 2B',
      session: {
        title: 'Reverse Engineering and Design using SolidWorks + Competition',
        date: 'August 9, 2025',
        time: '2:45 - 3:45',
        location: 'Room 218 (Lecture Hall 1)'
      }
    },
    'Amir Massoud': {
      initial: 'A',
      image: 'Speakers/Amir_Masoud.png',
      title: 'Seasoned business development strategist',
      session: {
        title: 'Business',
        date: 'August 9, 2025',
        time: '4:00 - 5:00',
        location: 'Room 218 (Lecture Hall 1)'
      }
    },
    'Hossam Hazem': {
      initial: 'H',
      image: 'Speakers/Hossam_Hazem.png',
      title: 'Training Manager at ORing Training',
      session: {
        title: 'Oring',
        date: 'August 9, 2025',
        time: '12:15 - 1:15',
        location: 'Room 241 (Tutorial Room 1)'
      }
    },
    'Sherif Karam': {
      initial: 'S',
      image: 'Speakers/Sherif_Karam.png',
      title: 'Production Planning Team-Leader @ IL-HAE ELEC. (LG Group)',
      session: {
        title: 'Planning',
        date: 'August 9, 2025',
        time: '2:45 - 3:45',
        location: 'Room 241 (Tutorial Room 1)'
      }
    },
    'Noura Tarek': {
      initial: 'N',
      title: 'CFD Engineer @ Capgemini Egypt',
      session: {
        title: 'CFD',
        date: 'August 9, 2025',
        time: '3:15 - 4:15',
        location: 'Room 241 (Tutorial Room 1)'
      }
    },
    'Abdelrahman Hossam Eldin': {
      image: 'Speakers/Abdelrahman_Hossam.png',
      initial: 'A',
      title: 'Seasoned leader in Master Data and Digital Transformation',
      session: {
        title: 'Data Analysis',
        date: 'August 9, 2025',
        time: '12:15 - 1:15',
        location: 'Room 246 (Tutorial Room 2)'
      }
    },
    'Ahmed Emad': {
      initial: 'A',
      title: 'Speaker',
      session: {
        title: 'HVAC',
        date: 'August 9, 2025',
        time: '3:15 - 4:15',
        location: 'Room 246 (Tutorial Room 2)'
      }
    },
    'Ehab Ali': {
      initial: 'E',
      title: 'Speaker',
      session: {
        title: 'Technology',
        date: 'August 9, 2025',
        time: '11:45 - 1:15',
        location: 'Meeting Room 1'
      }
    },
    'Mohamed Salama': {
      initial: 'M',
      image: 'Speakers/Mohamed_Salama.png',
      title: 'E-Commerce In-stock Associate @ Noon KSA',
      session: {
        title: 'Supply Chain',
        date: 'August 9, 2025',
        time: '1:15 - 3:00',
        location: 'Meeting Room 1'
      }
    },
    'Ahmed Ragab': {
      initial: 'A',
      image: 'Speakers/Ahmed_Ragab.png',
      title: 'Application Design Engineer @ Schneider Electric',
      session: {
        title: 'BIM',
        date: 'August 9, 2025',
        time: '3:15 - 4:45',
        location: 'Meeting Room 1'
      }
    },
    'Ahmed Khairy': {
      initial: 'A',
      image: 'Speakers/Ahmed_Khairy.png',
      title: 'Water desalination technical consultant',
      session: {
        title: 'Desalination',
        date: 'August 9, 2025',
        time: '11:45 - 1:15',
        location: 'Meeting Room 2'
      }
    },
    'Abdallah Behiry': {
      initial: 'A',
      image: 'Speakers/Abdallah_Behiry.png',
      title: 'BIM-MEP Mechanical Engineer',
      session: {
        title: 'PLCs and Control Systems',
        date: 'August 9, 2025',
        time: '1:15 - 3:00',
        location: 'Meeting Room 2'
      }
    },
    'Mahmoud Sakr': {
      initial: 'M',
      image: 'Speakers/Mahmoud_Sakr.png',
      title: 'Product manager @ Hefny Pharma Group',
      session: {
        title: 'Product Lifecycle',
        date: 'August 9, 2025',
        time: '2:15 - 3:15',
        location: 'Meeting Room 2'
      }
    }
  };

  // Current speaker index tracking
  let currentSpeakerIndex = 0;
  const speakerNames = Object.keys(speakerData);

  function openSpeakerModal(speakerName) {
    const data = speakerData[speakerName];
    if (!data) return;

    // Find the index of the current speaker
    currentSpeakerIndex = speakerNames.indexOf(speakerName);
    if (currentSpeakerIndex === -1) currentSpeakerIndex = 0;

    // Update modal content
    updateModalContent(speakerName, data);

    // Show modal
    speakerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update navigation arrows state
    updateNavigationArrows();
  }

  function updateModalContent(speakerName, data) {
    const modalSpeakerImage = document.getElementById('modalSpeakerImage');
    const modalSpeakerPlaceholder = document.getElementById('modalSpeakerPlaceholder');
    const modalSpeakerInitial = document.getElementById('modalSpeakerInitial');
    
    // Handle speaker image or placeholder
    if (data.image) {
      modalSpeakerImage.src = data.image;
      modalSpeakerImage.alt = speakerName;
      modalSpeakerImage.style.display = 'block';
      modalSpeakerPlaceholder.style.display = 'none';
    } else {
      modalSpeakerImage.style.display = 'none';
      modalSpeakerPlaceholder.style.display = 'flex';
      modalSpeakerInitial.textContent = data.initial;
    }
    
    document.getElementById('modalSpeakerName').textContent = speakerName;
    document.getElementById('modalSpeakerTitle').textContent = data.title;
    document.getElementById('modalSessionTitle').textContent = data.session.title;
    document.getElementById('modalSessionDate').textContent = data.session.date;
    document.getElementById('modalSessionTime').textContent = data.session.time;
    document.getElementById('modalSessionLocation').textContent = data.session.location;
  }

  function updateNavigationArrows() {
    const isFirst = currentSpeakerIndex === 0;
    const isLast = currentSpeakerIndex === speakerNames.length - 1;
    
    // Update desktop arrows
    if (modalNavPrev) modalNavPrev.style.opacity = isFirst ? '0.5' : '1';
    if (modalNavNext) modalNavNext.style.opacity = isLast ? '0.5' : '1';
    
    // Update mobile arrows
    if (modalMobileNavPrev) modalMobileNavPrev.style.opacity = isFirst ? '0.5' : '1';
    if (modalMobileNavNext) modalMobileNavNext.style.opacity = isLast ? '0.5' : '1';
  }

  function navigateToSpeaker(direction) {
    if (direction === 'prev' && currentSpeakerIndex > 0) {
      currentSpeakerIndex--;
    } else if (direction === 'next' && currentSpeakerIndex < speakerNames.length - 1) {
      currentSpeakerIndex++;
    } else {
      return; // Can't navigate further
    }
    
    const speakerName = speakerNames[currentSpeakerIndex];
    const data = speakerData[speakerName];
    
    updateModalContent(speakerName, data);
    updateNavigationArrows();
  }

  function closeSpeakerModal() {
    speakerModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners for speaker cards
  speakerCards.forEach(card => {
    card.addEventListener('click', function() {
      const speakerName = this.querySelector('.speaker-name').textContent;
      openSpeakerModal(speakerName);
    });
  });

  // Event listeners for modal close
  if (modalClose) {
    modalClose.addEventListener('click', closeSpeakerModal);
  }

  // Close modal when clicking outside
  if (speakerModal) {
    speakerModal.addEventListener('click', function(e) {
      if (e.target === speakerModal) {
        closeSpeakerModal();
      }
    });
  }

  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && speakerModal.classList.contains('active')) {
      closeSpeakerModal();
    }
  });

  // Navigation event listeners
  if (modalNavPrev) {
    modalNavPrev.addEventListener('click', () => navigateToSpeaker('prev'));
  }
  
  if (modalNavNext) {
    modalNavNext.addEventListener('click', () => navigateToSpeaker('next'));
  }
  
  if (modalMobileNavPrev) {
    modalMobileNavPrev.addEventListener('click', () => navigateToSpeaker('prev'));
  }
  
  if (modalMobileNavNext) {
    modalMobileNavNext.addEventListener('click', () => navigateToSpeaker('next'));
  }

  // Keyboard navigation (left/right arrow keys)
  document.addEventListener('keydown', function(e) {
    if (speakerModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        navigateToSpeaker('prev');
      } else if (e.key === 'ArrowRight') {
        navigateToSpeaker('next');
      }
    }
  });

}); 
