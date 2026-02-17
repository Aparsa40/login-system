const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const overlay = document.getElementById('overlay');

// نمایش فرم‌ها
function showSection(sectionToShow, sectionToHide) {
  sectionToHide.classList.remove('show');
  setTimeout(() => {
    sectionToHide.style.display = 'none';
    sectionToShow.style.display = 'block';
    setTimeout(() => {
      sectionToShow.classList.add('show');
      overlay.style.display = sectionToShow.id === 'signupSection' ? 'block' : 'none';
    }, 50);
  }, 200);
}

showSignup.addEventListener('click', () => showSection(signupSection, loginSection));
showLogin.addEventListener('click', () => showSection(loginSection, signupSection));

// نمایش/مخفی کردن رمز
function togglePassword(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  toggle.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
  });
}

togglePassword('loginPassword', 'toggleLoginPassword');
togglePassword('signupPassword', 'toggleSignupPassword');
togglePassword('signupConfirmPassword', 'toggleSignupConfirmPassword');

// Notification
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  setTimeout(() => { notification.className = 'notification'; }, 3000);
}

// قوانین رمز عبور
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(password);
}

// Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    })
  });
  const data = await res.json();
  if(res.ok) {
    localStorage.setItem('token', data.token);
    showNotification('ورود موفق!', 'success');
    setTimeout(() => window.location.href = 'profile.html', 1000);
  } else {
    showNotification(data.message, 'error');
  }
});

// Signup
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async e => {
  e.preventDefault();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if(password !== confirmPassword){
    showNotification('رمز عبور و تکرار آن همخوانی ندارد!', 'error');
    return;
  }
  if(!validatePassword(password)){
    showNotification('رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد!', 'error');
    return;
  }

  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: document.getElementById('signupEmail').value,
      password
    })
  });

  const data = await res.json();
  if(res.ok){
    showNotification('ثبت‌نام موفق! حالا وارد شوید.', 'success');
    showSection(loginSection, signupSection);
  } else {
    showNotification(data.message, 'error');
  }
});

// نمایش فرم اولیه
window.addEventListener('DOMContentLoaded', () => loginSection.classList.add('show'));
