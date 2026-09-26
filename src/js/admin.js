// ============================================================
// TRẠNG THÁI FORM
// ============================================================

var selectedRating   = 0;
var selectedEmoji    = '';
var selectedGradient = '';


// ============================================================
// ĐỌC / GHI LOCALSTORAGE
// ============================================================

function getCustom() {
  try {
    return JSON.parse(localStorage.getItem('banhngot_custom') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCustom(list) {
  localStorage.setItem('banhngot_custom', JSON.stringify(list));
}

function nextId() {
  var list  = getCustom();
  var maxId = 999;
  for (let i = 0; i < list.length; i++) {
    if (list[i].id > maxId) {
      maxId = list[i].id;
    }
  }
  return maxId + 1;
}


// ============================================================
// ĐÁNH GIÁ SAO
// ============================================================

function updateStarDisplay(n) {
  var stars = document.querySelectorAll('.star');
  for (let i = 0; i < stars.length; i++) {
    if (i < n) {
      stars[i].classList.add('lit');
    } else {
      stars[i].classList.remove('lit');
    }
  }
}

// Gắn sự kiện cho từng ngôi sao — dùng let để mỗi vòng lặp có i riêng
var starElements = document.querySelectorAll('.star');
for (let i = 0; i < starElements.length; i++) {
  var value = parseInt(starElements[i].dataset.value);

  starElements[i].addEventListener('mouseenter', function() {
    updateStarDisplay(value);
  });

  starElements[i].addEventListener('mouseleave', function() {
    updateStarDisplay(selectedRating);
  });

  starElements[i].addEventListener('click', function() {
    selectedRating = value;
    updateStarDisplay(selectedRating);
    document.getElementById('star-label').textContent = selectedRating + '/5 sao';
  });
}


// ============================================================
// CHỌN EMOJI
// ============================================================

var emojiOptions = document.querySelectorAll('.emoji-opt');
for (let i = 0; i < emojiOptions.length; i++) {
  emojiOptions[i].addEventListener('click', function() {
    // Bỏ active tất cả emoji
    for (let j = 0; j < emojiOptions.length; j++) {
      emojiOptions[j].classList.remove('active');
    }
    // Đánh dấu emoji được chọn
    this.classList.add('active');
    selectedEmoji = this.dataset.emoji;
    updatePreview();
  });
}


// ============================================================
// CHỌN MÀU NỀN
// ============================================================

var swatchElements = document.querySelectorAll('.grad-swatch');
for (let i = 0; i < swatchElements.length; i++) {
  swatchElements[i].addEventListener('click', function() {
    // Bỏ active tất cả swatch
    for (let j = 0; j < swatchElements.length; j++) {
      swatchElements[j].classList.remove('active');
    }
    // Đánh dấu swatch được chọn
    this.classList.add('active');
    selectedGradient = this.dataset.gradient;
    updatePreview();
  });
}


// ============================================================
// XEM TRƯỚC THẺ BÁNH
// ============================================================

function updatePreview() {
  if (!selectedGradient) return;

  var preview = document.getElementById('card-preview');
  var thumb   = document.getElementById('preview-thumb');

  preview.style.display  = 'block';
  thumb.style.background = selectedGradient;
  thumb.textContent      = selectedEmoji || '🍰';
}


// ============================================================
// KIỂM TRA DỮ LIỆU FORM
// ============================================================

function validate() {
  var ok = true;

  var fields = [
    { id: 'f-name',        errId: 'err-name',        message: 'Vui lòng nhập tên bánh' },
    { id: 'f-origin',      errId: 'err-origin',      message: 'Vui lòng nhập xuất xứ' },
    { id: 'f-region',      errId: 'err-region',      message: 'Vui lòng chọn vùng miền' },
    { id: 'f-category',    errId: 'err-category',    message: 'Vui lòng chọn thể loại' },
    { id: 'f-description', errId: 'err-description', message: 'Vui lòng nhập mô tả ngắn' },
    { id: 'f-detail',      errId: 'err-detail',      message: 'Vui lòng nhập giới thiệu chi tiết' },
    { id: 'f-ingredients', errId: 'err-ingredients', message: 'Vui lòng nhập nguyên liệu' },
    { id: 'f-occasion',    errId: 'err-occasion',    message: 'Vui lòng nhập dịp dùng' }
  ];

  for (let i = 0; i < fields.length; i++) {
    var input   = document.getElementById(fields[i].id);
    var errSpan = document.getElementById(fields[i].errId);
    if (!input.value.trim()) {
      errSpan.textContent = fields[i].message;
      ok = false;
    } else {
      errSpan.textContent = '';
    }
  }

  var errRating = document.getElementById('err-rating');
  if (selectedRating === 0) {
    errRating.textContent = 'Vui lòng chọn đánh giá';
    ok = false;
  } else {
    errRating.textContent = '';
  }

  var errEmoji = document.getElementById('err-emoji');
  if (!selectedEmoji) {
    errEmoji.textContent = 'Vui lòng chọn emoji';
    ok = false;
  } else {
    errEmoji.textContent = '';
  }

  var errGradient = document.getElementById('err-gradient');
  if (!selectedGradient) {
    errGradient.textContent = 'Vui lòng chọn màu nền';
    ok = false;
  } else {
    errGradient.textContent = '';
  }

  return ok;
}


// ============================================================
// XỬ LÝ SUBMIT FORM
// ============================================================

document.getElementById('cake-form').addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validate()) return;

  // Tách nguyên liệu từ "A, B, C" thành mảng ["A", "B", "C"]
  var rawText     = document.getElementById('f-ingredients').value;
  var parts       = rawText.split(',');
  var ingredients = [];
  for (let i = 0; i < parts.length; i++) {
    var item = parts[i].trim();
    if (item) {
      ingredients.push(item);
    }
  }

  var cake = {
    id:          nextId(),
    name:        document.getElementById('f-name').value.trim(),
    region:      document.getElementById('f-region').value,
    category:    document.getElementById('f-category').value,
    origin:      document.getElementById('f-origin').value.trim(),
    description: document.getElementById('f-description').value.trim(),
    detail:      document.getElementById('f-detail').value.trim(),
    ingredients: ingredients,
    occasion:    document.getElementById('f-occasion').value.trim(),
    rating:      selectedRating,
    gradient:    selectedGradient,
    emoji:       selectedEmoji,
    isCustom:    true
  };

  var list = getCustom();
  list.push(cake);
  saveCustom(list);

  toast('Đã thêm "' + cake.name + '" thành công!', 'success');
  resetForm();
  renderList();
});


// ============================================================
// LÀM MỚI FORM
// ============================================================

function resetForm() {
  document.getElementById('cake-form').reset();

  selectedRating   = 0;
  selectedEmoji    = '';
  selectedGradient = '';

  updateStarDisplay(0);
  document.getElementById('star-label').textContent = 'Chưa chọn';

  for (let i = 0; i < emojiOptions.length; i++) {
    emojiOptions[i].classList.remove('active');
  }
  for (let i = 0; i < swatchElements.length; i++) {
    swatchElements[i].classList.remove('active');
  }

  document.getElementById('card-preview').style.display = 'none';

  var errSpans = document.querySelectorAll('.err');
  for (let i = 0; i < errSpans.length; i++) {
    errSpans[i].textContent = '';
  }
}

document.getElementById('reset-btn').addEventListener('click', resetForm);


// ============================================================
// HIỂN THỊ DANH SÁCH BÁNH ĐÃ THÊM
// ============================================================

function renderList() {
  var list = getCustom();
  var el   = document.getElementById('custom-list');
  el.innerHTML = '';

  if (list.length === 0) {
    var emptyMsg = document.createElement('p');
    emptyMsg.className   = 'list-empty';
    emptyMsg.textContent = 'Chưa có bánh nào được thêm.';
    el.appendChild(emptyMsg);
    return;
  }

  for (let i = 0; i < list.length; i++) {
    el.appendChild(createListItem(list[i]));
  }
}

function createListItem(cake) {
  var item = document.createElement('div');
  item.className = 'list-item';

  // Hình thu nhỏ
  var thumb = document.createElement('div');
  thumb.className       = 'list-thumb';
  thumb.style.background = cake.gradient;
  thumb.textContent      = cake.emoji;

  // Thông tin
  var info = document.createElement('div');
  info.className = 'list-info';

  var name = document.createElement('strong');
  name.textContent = cake.name;

  var meta = document.createElement('span');
  meta.textContent = cake.category + ' · Miền ' + cake.region + ' · ' + cake.origin;

  var starsSpan = document.createElement('span');
  starsSpan.className = 'list-stars';
  var starsText = '';
  for (let i = 0; i < cake.rating; i++) starsText += '★';
  for (let i = cake.rating; i < 5; i++) starsText += '☆';
  starsSpan.textContent = starsText;

  info.appendChild(name);
  info.appendChild(meta);
  info.appendChild(starsSpan);

  // Nút xóa — dùng this thay vì closure phức tạp
  var deleteBtn = document.createElement('button');
  deleteBtn.className   = 'btn-delete';
  deleteBtn.textContent = '✕';
  deleteBtn.dataset.id   = cake.id;
  deleteBtn.dataset.name = cake.name;
  deleteBtn.addEventListener('click', function() {
    confirmDelete(
      parseInt(this.dataset.id),
      this.dataset.name
    );
  });

  item.appendChild(thumb);
  item.appendChild(info);
  item.appendChild(deleteBtn);

  return item;
}


// ============================================================
// XÓA BÁNH
// ============================================================

function confirmDelete(id, name) {
  if (!confirm('Xóa "' + name + '" khỏi danh sách?')) return;

  var list    = getCustom();
  var newList = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].id !== id) {
      newList.push(list[i]);
    }
  }

  saveCustom(newList);
  toast('Đã xóa "' + name + '"', 'info');
  renderList();
}


// ============================================================
// THÔNG BÁO TOAST
// ============================================================

function toast(message, type) {
  var t = document.createElement('div');
  t.className   = 'toast toast-' + type;
  t.textContent = message;
  document.body.appendChild(t);

  requestAnimationFrame(function() {
    t.classList.add('show');
  });

  setTimeout(function() {
    t.classList.remove('show');
    setTimeout(function() { t.remove(); }, 300);
  }, 3000);
}


// ============================================================
// KHỞI ĐỘNG
// ============================================================

renderList();
