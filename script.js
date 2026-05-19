const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxML2CG7yx_Fo1XdiG04wZi9Os8_mJInRJ5ROSxJ2ymRm6wL3jf0AVTi-EYi0lVCE2-/exec';

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
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: params.toString()
  })
    .then(() => {
      resultMessage.textContent = '제출 요청이 완료되었습니다. 구글시트 반영 여부를 확인해주세요.';
      resultMessage.classList.add('success');
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      resultMessage.textContent = '제출 중 오류가 발생했습니다. 다시 시도해주세요.';
      resultMessage.classList.add('error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '점검표 제출하기';
    });
});
