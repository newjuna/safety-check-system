const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4z4If6KBD4pEoyOFLgPFLo60e0CLZitB3tzxOQM3mpVkohWHJvyKNSEIb-EsxmmkF/exec';

const form = document.getElementById('inspectionForm');
const submitBtn = document.getElementById('submitBtn');
const resultMessage = document.getElementById('resultMessage');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  resultMessage.textContent = '';
  resultMessage.className = 'result';

  submitBtn.disabled = true;
  submitBtn.textContent = '제출 중입니다...';

  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }

  params.append('userAgent', navigator.userAgent);

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: params
  })
    .then(function () {
      resultMessage.textContent = '제출 요청이 완료되었습니다. 구글시트를 확인해주세요.';
      resultMessage.classList.add('success');
      form.reset();
    })
    .catch(function (error) {
      console.error(error);
      resultMessage.textContent = '제출 중 오류가 발생했습니다. 다시 시도해주세요.';
      resultMessage.classList.add('error');
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = '점검표 제출하기';
    });
});
