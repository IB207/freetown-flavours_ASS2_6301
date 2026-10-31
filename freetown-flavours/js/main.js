// Freetown Flavours - main.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-list');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Menu category filter
  const chips = document.querySelectorAll('.chip');
  const dishes = document.querySelectorAll('.dish[data-category]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      const cat = chip.dataset.filter;
      dishes.forEach(d => { d.hidden = !(cat === 'all' || d.dataset.category === cat); });
    });
  });

  // Simple form handling with validation
  function handleForm(formId, noticeId, okMessage) {
    const form = document.getElementById(formId);
    const notice = document.getElementById(noticeId);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        const err = document.getElementById(input.id + '-error');
        const empty = !input.value.trim();
        if (err) err.textContent = empty ? 'This field is required.' : '';
        if (empty) valid = false;
      });
      if (valid) {
        notice.textContent = okMessage;
        notice.classList.add('show');
        form.reset();
      } else {
        notice.classList.remove('show');
      }
    });
  }
  handleForm('booking-form', 'booking-notice', 'Thank you! Your table request has been received. We will call to confirm.');

  const contactForm = document.getElementById('contact-form');
  const contactNotice = document.getElementById('contact-notice');
  if (contactForm && contactNotice) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      contactNotice.classList.remove('show');

      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(input => {
        const error = document.getElementById(input.id + '-error');
        let message = '';
        if (!input.value.trim()) {
          message = 'This field is required.';
        } else if (input.type === 'email' && !input.validity.valid) {
          message = 'Enter a valid email address.';
        }
        if (error) error.textContent = message;
        if (message) valid = false;
      });

      if (!valid) return;

      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/byg.gazworld@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: contactForm.elements.name.value.trim(),
            email: contactForm.elements.email.value.trim(),
            message: contactForm.elements.message.value.trim(),
            _subject: 'New Freetown Flavours service enquiry'
          })
        });
        const result = await response.json();

        if (!response.ok || result.success !== 'true') {
          throw new Error(result.message || 'The message could not be sent.');
        }

        contactNotice.textContent = 'Thank you! Your message has been sent. We will reply soon.';
        contactNotice.classList.add('show');
        contactForm.reset();
      } catch (error) {
        contactNotice.textContent = error instanceof Error
          ? `Sorry, your message could not be sent. ${error.message} Please try again later.`
          : 'Sorry, your message could not be sent. Please try again later.';
        contactNotice.classList.add('show');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send message';
      }
    });
  }

  // Prevent past dates on the booking form
  const date = document.getElementById('date');
  if (date) date.min = new Date().toISOString().split('T')[0];
});
