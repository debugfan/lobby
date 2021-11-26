var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var nickname = navigator.platform;

socket.emit('nickname', nickname);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

var fileUpload = document.getElementById('fileUpload');
fileUpload.onchange = function () {
  var formUpload = document.getElementById('formUpload');
  var formData = new FormData(formUpload);
  httpRequest = new XMLHttpRequest();
  httpRequest.open(formUpload.method, formUpload.action);
  httpRequest.send(formData);
};

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('file message', function (msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

var multilingual = {
  en: {
    translation: {
      form: {
        Send: 'Send',
        Upload: 'Upload'
      }
    }
  },
  zh: {
    translation: {
      form: {
        Send: '发送',
        Upload: '上传'
      }
    }
  }
};

function getQueryParameter(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

var lang = null;

if (lang == null) {
  var searchLang = getQueryParameter("lang");
  if (searchLang != null) {
    if (searchLang.startsWith("zh")) {
      lang = "zh";
    }
    if (searchLang.startsWith("en")) {
      lang = "en";
    }
  }
}

if (lang == null) {
  var userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith("zh")) {
    lang = "zh";
  }
  else {
    lang = "en";
  }
}

// use plugins and options as needed, for options, detail see
// http://i18next.com/docs/
i18next.init({
  lng: lang,
  resources: multilingual
}, function (err, t) {
  // for options see
  // https://github.com/i18next/jquery-i18next#initialize-the-plugin
  jqueryI18next.init(i18next, $);

  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $('form').localize();
});
