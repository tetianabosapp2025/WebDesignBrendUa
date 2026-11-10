/**
 * validation.js - Фінальний скрипт валідації та управління модальним вікном (Етапи 8–12)
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    // Отримання посилань на поля форми відповідно до вашого HTML
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    const agreement = document.getElementById('agreement');

    // Елементи модального вікна
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Регулярні вирази
    const nameRegex = /^[a-zA-Zа-яА-Яа-яіІїЇєЄґҐ\s'-]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+380\d{9}$/;

    // ==========================================
    // UI ФУНКЦІЇ ДЛЯ КЕРУВАННЯ СТАНАМИ ТА A11Y
    // ==========================================

    function showError(input, errorElement, messageText) {
        if (!input) return;
        input.setAttribute('aria-invalid', 'true');
        input.classList.remove('border-gray-300', 'border-green-500', 'focus:ring-green-500', 'focus:ring-brand-primary');
        input.classList.add('border-red-500', 'focus:ring-red-500');
        
        if (errorElement) {
            errorElement.textContent = messageText;
            errorElement.classList.remove('hidden');
        }
    }

    function showSuccess(input, errorElement) {
        if (!input) return;
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('border-gray-300', 'border-red-500', 'focus:ring-red-500');
        input.classList.add('border-green-500', 'focus:ring-green-500');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    function clearError(input, errorElement) {
        if (!input) return;
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('border-red-500', 'border-green-500', 'focus:ring-red-500', 'focus:ring-green-500');
        input.classList.add('border-gray-300', 'focus:ring-brand-primary');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    // ==========================================
    // ОБРОБКА ТА ФОРМАТУВАННЯ TELEPHONE (Edge Cases)
    // ==========================================

    function sanitizeAndFormatPhone(rawInput) {
        let cleaned = rawInput.trim();
        if (cleaned.startsWith('0') && cleaned.length === 10) {
            cleaned = '+38' + cleaned;
        } else if (/^\d{9}$/.test(cleaned)) {
            cleaned = '+380' + cleaned;
        } else {
            let hasPlus = cleaned.startsWith('+');
            let digits = cleaned.replace(/\D/g, '');
            if (digits.startsWith('380') && digits.length === 12) {
                cleaned = '+' + digits;
            } else if (digits.startsWith('0') && digits.length === 10) {
                cleaned = '+38' + digits;
            } else if (hasPlus) {
                cleaned = '+' + digits;
            } else {
                cleaned = digits;
            }
        }
        return cleaned;
    }

    // ==========================================
    // ВАЛІДАЦІЯ ПОЛІВ
    // ==========================================

    function validateName(forceShow = false) {
        const errorEl = document.getElementById('usernameError');
        const val = username.value.trim();
        
        if (!val) {
            if (forceShow) {
                showError(username, errorEl, "Поле обов'язкове для заповнення.");
            } else {
                clearError(username, errorEl);
            }
            return false;
        }

        if (!nameRegex.test(val)) {
            showError(username, errorEl, "Введіть коректне ім'я (від 2 до 50 символів).");
            return false;
        } else {
            showSuccess(username, errorEl);
            return true;
        }
    }

    function validateEmail(forceShow = false) {
        const errorEl = document.getElementById('emailError');
        const val = email.value.trim();
        
        if (!val) {
            if (forceShow) {
                showError(email, errorEl, "Поле обов'язкове для заповнення.");
            } else {
                clearError(email, errorEl);
            }
            return false;
        }

        if (!emailRegex.test(val)) {
            showError(email, errorEl, "Введіть коректну електронну адресу (наприклад, example@gmail.com).");
            return false;
        } else {
            showSuccess(email, errorEl);
            return true;
        }
    }

    function validatePhone(forceShow = false) {
        const errorEl = document.getElementById('phoneError');
        let val = phone.value.trim();
        
        if (!val) {
            if (forceShow) {
                showError(phone, errorEl, "Поле обов'язкове для заповнення.");
            } else {
                clearError(phone, errorEl);
            }
            return false;
        }

        const formattedPhone = sanitizeAndFormatPhone(val);
        if (formattedPhone !== val) {
            phone.value = formattedPhone;
            val = formattedPhone;
        }

        if (!phoneRegex.test(val)) {
            showError(phone, errorEl, "Номер телефону має бути у форматі +380XXXXXXXXX.");
            return false;
        } else {
            showSuccess(phone, errorEl);
            return true;
        }
    }

    function validateMessage(forceShow = false) {
        const errorEl = document.getElementById('messageError');
        const val = message.value.trim();
        
        if (!val) {
            if (forceShow) {
                showError(message, errorEl, "Поле обов'язкове для заповнення.");
            } else {
                clearError(message, errorEl);
            }
            return false;
        }

        if (val.length < 10) {
            showError(message, errorEl, "Повідомлення занадто коротке (мінімум 10 символів).");
            return false;
        } else {
            showSuccess(message, errorEl);
            return true;
        }
    }

    function validateAgreement() {
        const errorEl = document.getElementById('agreementError');
        if (!agreement.checked) {
            showError(agreement, errorEl, "Необхідно погодитися з політикою конфіденційності.");
            return false;
        } else {
            showSuccess(agreement, errorEl);
            return true;
        }
    }

    // ==========================================
    // УПРАВЛІННЯ МОДАЛЬНИМ ВІКНОМ ТА ДОСТУПНІСТЮ
    // ==========================================

    function openModal() {
        if (!successModal) return;
        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (closeModalBtn) closeModalBtn.focus();
        document.addEventListener('keydown', handleEscapeKey);
    }

    function closeModal() {
        if (!successModal) return;
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscapeKey);
        form.reset();
        
        // Скидаємо стани полів до базових
        [username, email, phone, message].forEach(input => {
            if (input) clearError(input, document.getElementById(input.id + 'Error'));
        });
        if (agreement) {
            agreement.checked = false;
            clearError(agreement, document.getElementById('agreementError'));
        }
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') closeModal();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeModal();
        });
    }

    // ==========================================
    // ПРИВ'ЯЗКА ПОДІЙ
    // ==========================================

    function attachFieldListeners(inputElement, validationFn) {
        if (!inputElement) return;
        inputElement.addEventListener('input', () => validationFn(false));
        inputElement.addEventListener('blur', () => validationFn(false));
    }

    attachFieldListeners(username, validateName);
    attachFieldListeners(email, validateEmail);
    attachFieldListeners(phone, validatePhone);
    attachFieldListeners(message, validateMessage);

    if (agreement) {
        agreement.addEventListener('change', () => validateAgreement());
    }

    // ==========================================
    // ОБРОБКА SUBMIT
    // ==========================================

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const isNameValid = validateName(true);
        const isEmailValid = validateEmail(true);
        const isPhoneValid = validatePhone(true);
        const isMessageValid = validateMessage(true);
        const isAgreementValid = validateAgreement();

        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid && isAgreementValid;

        if (isFormValid) {
            openModal();
        }
    });
});