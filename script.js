const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhYkIb6XqzZf9aB3tNvaxaCWy01NrP8kVA4WG-T5OQh_HjWY4wpRXC0YSxMA331UUa/exec';

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

  params.append('mode', 'submit');

  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }

  params.append('userAgent', navigator.userAgent);

  submitByJsonp(params)
    .then(function (data) {
      resultMessage.textContent = '제출이 완료되었습니다. 감사합니다.';
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

function submitByJsonp(params) {
  return new Promise(function (resolve, reject) {
    const callbackName = 'callback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);

    params.append('callback', callbackName);

    const script = document.createElement('script');
    script.src = APPS_SCRIPT_URL + '?' + params.toString();

    const timer = setTimeout(function () {
      cleanup();
      reject(new Error('제출 시간이 초과되었습니다.'));
    }, 20000);

    window[callbackName] = function (data) {
      cleanup();

      if (data && data.success) {
        resolve(data);
      } else {
        reject(new Error(data && data.message ? data.message : '저장 실패'));
      }
    };

    script.onerror = function () {
      cleanup();
      reject(new Error('스크립트 호출 실패'));
    };

    function cleanup() {
      clearTimeout(timer);
      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    document.body.appendChild(script);
  });
}
