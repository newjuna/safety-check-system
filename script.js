const APPS_SCRIPT_URL = '1pbpCs3e5q-qM9Sgca7EOlsBflprBgFUjWHPCuXvfX6Y';

const form = document.getElementById('inspectionForm');
const submitBtn = document.getElementById('submitBtn');
const resultMessage = document.getElementById('resultMessage');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  resultMessage.textContent = '';
  resultMessage.className = 'result';

  submitBtn.disabled = true;
  submitBtn.textContent = '제출 중입니다...';

  const formData = new FormData(form);
  formData.append('userAgent', navigator.userAgent);

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    resultMessage.textContent = '제출이 완료되었습니다. 감사합니다.';
    resultMessage.classList.add('success');

    form.reset();

  } catch (error) {
    console.error(error);

    resultMessage.textContent = '제출 중 오류가 발생했습니다. 다시 시도해주세요.';
    resultMessage.classList.add('error');

  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '점검표 제출하기';
  }
});