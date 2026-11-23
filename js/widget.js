// ЛР №11. БрендUa — навчальний калькулятор підбору розміру.
// Таблиця розмірів умовна: для реального магазину потрібна таблиця виробника.
(() => {
  'use strict';

  function initSizeWidget() {
    const form = document.getElementById('size-form');
    const button = document.getElementById('calculate-size');
    const result = document.getElementById('size-result');
    const summaryError = document.getElementById('size-error');
    const inputs = {
      height: document.getElementById('height-input'),
      weight: document.getElementById('weight-input'),
      chest: document.getElementById('chest-input'),
      waist: document.getElementById('waist-input')
    };

    // Якщо віджет не вставлено на цій сторінці, не впливаємо на решту сайту.
    if (!form || !button || !result || !summaryError ||
        Object.values(inputs).some(input => !input)) return;

    const rules = {
      height: { label: 'зріст', min: 130, max: 220, required: true },
      weight: { label: 'вагу', min: 30, max: 250, required: true },
      chest: { label: 'обхват грудей', min: 60, max: 160, required: false },
      waist: { label: 'обхват талії', min: 45, max: 160, required: false }
    };

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const chestLimits = [83, 89, 97, 105, 113, 122];
    const waistLimits = [65, 69, 77, 85, 93, 105];
    let calculated = false;

    // Додаємо доступні повідомлення під наявними полями без зміни розмітки форми.
    const errorNodes = {};
    for (const [key, input] of Object.entries(inputs)) {
      const error = document.createElement('p');
      error.id = `${key}-validation-error`;
      error.className = 'hidden text-red-600 text-sm mt-1';
      error.setAttribute('role', 'alert');
      input.insertAdjacentElement('afterend', error);
      input.setAttribute('aria-describedby', error.id);
      input.setAttribute('autocomplete', 'off');
      errorNodes[key] = error;
    }

    function showFieldError(key, message) {
      const input = inputs[key];
      const error = errorNodes[key];
      error.textContent = message;
      error.classList.toggle('hidden', !message);
      input.classList.toggle('border-red-600', Boolean(message));
      input.setAttribute('aria-invalid', String(Boolean(message)));
    }

    function parseMeasurement(key) {
      const input = inputs[key];
      const { label, min, max, required } = rules[key];
      const raw = input.value.trim();
      if (raw === '') {
        if (required) {
          showFieldError(key, `Введіть ${label} (${min}–${max}).`);
          return { valid: false };
        }
        showFieldError(key, '');
        return { valid: true, value: null };
      }

      // Строге перетворення: «abc», Infinity, «-5» та 1e99 не пройдуть.
      if (!/^\d+(?:[.,]\d+)?$/.test(raw)) {
        showFieldError(key, 'Введіть додатне число без сторонніх символів.');
        return { valid: false };
      }
      const number = Number(raw.replace(',', '.'));
      if (!Number.isFinite(number) || number < min || number > max) {
        showFieldError(key, `Допустиме значення: ${min}–${max}.`);
        return { valid: false };
      }
      showFieldError(key, '');
      return { valid: true, value: number };
    }

    function sizeFromMeasurement(value, key) {
      if (value == null) return null;
      const limits = key === 'chest' ? chestLimits : waistLimits;
      const min = key === 'chest' ? 76 : 58;
      const max = limits[limits.length - 1];
      if (value < min || value > max) {
        showFieldError(key, `Таблиця XS–XXL охоплює ${min}–${max} см. Розмір визначити неможливо.`);
        return -1;
      }
      return limits.findIndex(limit => value <= limit);
    }

    function sizeFromBuild(height, weight) {
      const indicator = weight * Math.pow(170 / height, 2);
      if (!Number.isFinite(indicator)) return -1;
      if (indicator < 50) return 0;
      if (indicator < 60) return 1;
      if (indicator < 75) return 2;
      if (indicator < 90) return 3;
      if (indicator < 110) return 4;
      return 5;
    }

    function calculate() {
      const values = {};
      let valid = true;
      for (const key of Object.keys(inputs)) {
        const parsed = parseMeasurement(key);
        if (!parsed.valid) valid = false;
        values[key] = parsed.value;
      }

      result.classList.add('hidden');
      result.textContent = '';
      summaryError.classList.add('hidden');
      summaryError.textContent = '';
      if (!valid) return;

      const chestSize = sizeFromMeasurement(values.chest, 'chest');
      const waistSize = sizeFromMeasurement(values.waist, 'waist');
      if (chestSize === -1 || waistSize === -1) return;

      const measured = [chestSize, waistSize].filter(index => index != null);
      const sizeIndex = measured.length
        ? Math.max(...measured)
        : sizeFromBuild(values.height, values.weight);

      if (sizeIndex < 0 || sizeIndex >= sizes.length) {
        summaryError.textContent = 'Не вдалося визначити розмір. Перевірте параметри.';
        summaryError.classList.remove('hidden');
        return;
      }

      result.textContent = `Ваш орієнтовний розмір: ${sizes[sizeIndex]}. Звірте його з таблицею розмірів конкретного виробу.`;
      result.classList.remove('hidden');
    }

    // Форма не має надсилатися на Live Server (попереджаємо HTTP 405).
    form.addEventListener('submit', event => {
      event.preventDefault();
      calculated = true;
      calculate();
    });
    button.addEventListener('click', () => {
      if (button.type === 'submit') return; // submit уже обробляє слухач вище
      calculated = true;
      calculate();
    });
    for (const [key, input] of Object.entries(inputs)) {
      input.addEventListener('input', () => {
        if (calculated) calculate();
        else showFieldError(key, '');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSizeWidget, { once: true });
  } else {
    initSizeWidget();
  }
})();
