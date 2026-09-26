// ============================================================
// BIẾN TRẠNG THÁI
// ============================================================

var searchQuery    = '';
var selectedRegion = '';
var selectedCategory = '';
var sortType       = 'default';
var currentPage    = 1;
var perPage        = 6;


// ============================================================
// HÀM TIỆN ÍCH
// ============================================================

function getEl(id) {
  return document.getElementById(id);
}

function getStars(rating) {
  var filled = Math.round(rating);
  var stars  = '';
  for (let i = 0; i < filled; i++) {
    stars += '★';
  }
  for (let i = filled; i < 5; i++) {
    stars += '☆';
  }
  return stars;
}


// ============================================================
// ĐIỀU HƯỚNG
// ============================================================

function hideAllPages() {
  getEl('page-home').classList.add('hidden');
  getEl('page-cakes').classList.add('hidden');
  getEl('page-detail').classList.add('hidden');
  getEl('page-about').classList.add('hidden');
}

function showPage() {
  var hash  = location.hash || '#home';
  var parts = hash.replace('#', '').split('/');
  var page  = parts[0];

  hideAllPages();
  window.scrollTo(0, 0);
  updateNav(page);

  if (page === 'home' || page === '') {
    showHome();
  } else if (page === 'cakes') {
    currentPage = 1;
    showCakes();
  } else if (page === 'detail') {
    var id = parseInt(parts[1]);
    showDetail(id);
  } else if (page === 'about') {
    showAbout();
  } else {
    showHome();
  }
}

function updateNav(pageName) {
  var links = document.querySelectorAll('.nav-link');
  for (let i = 0; i < links.length; i++) {
    var href     = links[i].getAttribute('href');
    var isActive = (href === '#' + pageName)
                || (pageName === 'detail' && href === '#cakes');
    if (isActive) {
      links[i].classList.add('active');
    } else {
      links[i].classList.remove('active');
    }
  }
}


// ============================================================
// TRANG CHỦ
// ============================================================

function showHome() {
  getEl('page-home').classList.remove('hidden');

  getEl('stat-cakes').textContent  = CAKES.length;
  getEl('total-count').textContent = CAKES.length;

  // Sắp xếp theo rating rồi lấy 3 bánh đầu
  var sorted   = CAKES.slice();
  sorted.sort(function(a, b) { return b.rating - a.rating; });
  var featured = sorted.slice(0, 3);

  var featuredList = getEl('featured-list');
  featuredList.innerHTML = '';
  for (let i = 0; i < featured.length; i++) {
    featuredList.appendChild(createCard(featured[i]));
  }

  // Hiển thị các thể loại
  var categories = [
    'Bánh dân gian',
    'Bánh nướng',
    'Bánh hấp',
    'Bánh chiên',
    'Bánh kem',
    'Bánh tráng miệng'
  ];

  var categoryList = getEl('category-list');
  categoryList.innerHTML = '';

  for (let i = 0; i < categories.length; i++) {
    var count = 0;
    for (let j = 0; j < CAKES.length; j++) {
      if (CAKES[j].category === categories[i]) {
        count++;
      }
    }
    categoryList.appendChild(createCategoryCard(categories[i], count));
  }
}

function createCategoryCard(name, count) {
  var div = document.createElement('div');
  div.className = 'cat-card';

  var spanCount = document.createElement('span');
  spanCount.className = 'cat-count';
  spanCount.textContent = count;

  var spanName = document.createElement('span');
  spanName.className = 'cat-name';
  spanName.textContent = name;

  div.appendChild(spanCount);
  div.appendChild(spanName);

  div.addEventListener('click', function() {
    selectedCategory = name;
    currentPage = 1;
    location.hash = '#cakes';
  });

  return div;
}


// ============================================================
// LỌC VÀ SẮP XẾP BÁNH
// ============================================================

function filterCakes() {
  var result = [];

  for (let i = 0; i < CAKES.length; i++) {
    var cake = CAKES[i];

    // Tìm kiếm theo từ khóa
    if (searchQuery) {
      var keyword      = searchQuery.toLowerCase();
      var nameMatch    = cake.name.toLowerCase().includes(keyword);
      var descMatch    = cake.description.toLowerCase().includes(keyword);
      var originMatch  = cake.origin.toLowerCase().includes(keyword);

      var ingMatch = false;
      for (let j = 0; j < cake.ingredients.length; j++) {
        if (cake.ingredients[j].toLowerCase().includes(keyword)) {
          ingMatch = true;
          break;
        }
      }

      if (!nameMatch && !descMatch && !originMatch && !ingMatch) {
        continue; // bỏ qua bánh này
      }
    }

    // Lọc theo vùng miền
    if (selectedRegion && cake.region !== selectedRegion) {
      continue;
    }

    // Lọc theo thể loại
    if (selectedCategory && cake.category !== selectedCategory) {
      continue;
    }

    result.push(cake);
  }

  // Sắp xếp
  if (sortType === 'name-asc') {
    result.sort(function(a, b) { return a.name.localeCompare(b.name, 'vi'); });
  } else if (sortType === 'name-desc') {
    result.sort(function(a, b) { return b.name.localeCompare(a.name, 'vi'); });
  } else if (sortType === 'rating-desc') {
    result.sort(function(a, b) { return b.rating - a.rating; });
  } else if (sortType === 'rating-asc') {
    result.sort(function(a, b) { return a.rating - b.rating; });
  }

  return result;
}


// ============================================================
// DANH SÁCH BÁNH
// ============================================================

function showCakes() {
  getEl('page-cakes').classList.remove('hidden');

  // Đồng bộ giá trị vào ô lọc
  if (document.activeElement !== getEl('search-input')) {
    getEl('search-input').value = searchQuery;
  }
  getEl('region-filter').value   = selectedRegion;
  getEl('category-filter').value = selectedCategory;
  getEl('sort-filter').value     = sortType;

  // Lọc + phân trang
  var filtered   = filterCakes();
  var totalPages = Math.ceil(filtered.length / perPage);
  var start      = (currentPage - 1) * perPage;
  var paged      = filtered.slice(start, start + perPage);

  // Xóa danh sách cũ
  var cakeList = getEl('cake-list');
  cakeList.innerHTML = '';

  if (filtered.length === 0) {
    getEl('result-info').style.display = 'none';
    getEl('empty-state').classList.remove('hidden');
  } else {
    getEl('result-info').style.display = '';
    getEl('result-count').textContent  = filtered.length;
    getEl('empty-state').classList.add('hidden');

    for (let i = 0; i < paged.length; i++) {
      cakeList.appendChild(createCard(paged[i]));
    }
  }

  showPagination(totalPages);

  // Hiện / ẩn nút xóa lọc
  var hasFilter = searchQuery || selectedRegion || selectedCategory || sortType !== 'default';
  if (hasFilter) {
    getEl('reset-btn').classList.remove('hidden');
  } else {
    getEl('reset-btn').classList.add('hidden');
  }
}

function showPagination(totalPages) {
  var pagination = getEl('pagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  // Nút Trước
  var prevBtn = document.createElement('button');
  prevBtn.textContent = '‹ Trước';
  prevBtn.disabled    = (currentPage === 1);
  prevBtn.addEventListener('click', function() {
    changePage(currentPage - 1);
  });
  pagination.appendChild(prevBtn);

  // Nút số trang — dùng let để mỗi vòng lặp có i riêng
  for (let i = 1; i <= totalPages; i++) {
    var btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', function() {
      changePage(i);
    });
    pagination.appendChild(btn);
  }

  // Nút Sau
  var nextBtn = document.createElement('button');
  nextBtn.textContent = 'Sau ›';
  nextBtn.disabled    = (currentPage === totalPages);
  nextBtn.addEventListener('click', function() {
    changePage(currentPage + 1);
  });
  pagination.appendChild(nextBtn);
}

function changePage(n) {
  var total = Math.ceil(filterCakes().length / perPage);
  if (n < 1 || n > total) return;
  currentPage = n;
  showCakes();
  window.scrollTo(0, 0);
}

function resetFilters() {
  searchQuery      = '';
  selectedRegion   = '';
  selectedCategory = '';
  sortType         = 'default';
  currentPage      = 1;
  showCakes();
}


// ============================================================
// CHI TIẾT BÁNH
// ============================================================

function showDetail(id) {
  // Tìm bánh theo id
  var cake      = null;
  var cakeIndex = -1;
  for (let i = 0; i < CAKES.length; i++) {
    if (CAKES[i].id === id) {
      cake      = CAKES[i];
      cakeIndex = i;
      break;
    }
  }

  if (!cake) {
    location.hash = '#cakes';
    return;
  }

  getEl('page-detail').classList.remove('hidden');

  var detailVisual = getEl('detail-emoji');
  detailVisual.textContent = '';
  if (cake.image) {
    var detailImage = document.createElement('img');
    detailImage.className = 'detail-image';
    detailImage.src = cake.image;
    detailImage.alt = cake.name;
    detailVisual.appendChild(detailImage);
  } else {
    detailVisual.textContent = cake.emoji;
  }
  getEl('detail-hero').style.background  = cake.gradient;
  getEl('detail-badge').textContent      = cake.category;
  getEl('detail-name').textContent       = cake.name;
  getEl('detail-desc-short').textContent = cake.description;
  getEl('detail-region').textContent     = 'Miền ' + cake.region;
  getEl('detail-origin').textContent     = cake.origin;
  getEl('detail-occasion').textContent   = cake.occasion;
  getEl('detail-rating').textContent     = getStars(cake.rating) + ' ' + cake.rating + '/5';
  getEl('detail-content').textContent    = cake.detail;

  // Nguyên liệu
  var ingredientList = getEl('detail-ingredients');
  ingredientList.innerHTML = '';
  for (let i = 0; i < cake.ingredients.length; i++) {
    var tag = document.createElement('span');
    tag.className = 'ingredient-tag';
    tag.textContent = cake.ingredients[i];
    ingredientList.appendChild(tag);
  }

  // Nút điều hướng Trước / Sau
  var prevCake = CAKES[cakeIndex - 1];
  var nextCake = CAKES[cakeIndex + 1];

  var prevLink = getEl('detail-prev');
  if (prevCake) {
    prevLink.textContent      = '← ' + prevCake.name;
    prevLink.href             = '#detail/' + prevCake.id;
    prevLink.style.visibility = 'visible';
  } else {
    prevLink.style.visibility = 'hidden';
  }

  var nextLink = getEl('detail-next');
  if (nextCake) {
    nextLink.textContent      = nextCake.name + ' →';
    nextLink.href             = '#detail/' + nextCake.id;
    nextLink.style.visibility = 'visible';
  } else {
    nextLink.style.visibility = 'hidden';
  }
}


// ============================================================
// GIỚI THIỆU
// ============================================================

function showAbout() {
  getEl('page-about').classList.remove('hidden');
  getEl('about-cake-count').textContent = CAKES.length;
}


// ============================================================
// TẠO THẺ BÁNH bằng createElement
// ============================================================

function createCard(cake) {
  // Tạo thẻ ngoài
  var card = document.createElement('div');
  card.className = 'card';

  // --- Ảnh bánh; giữ emoji cho bánh tự thêm chưa có ảnh ---
  var thumb = document.createElement('div');
  thumb.className       = 'card-thumb';
  thumb.style.background = cake.gradient;

  if (cake.image) {
    var image = document.createElement('img');
    image.className = 'card-image';
    image.src = cake.image;
    image.alt = cake.name;
    image.loading = 'lazy';
    thumb.appendChild(image);
  } else {
    var emojiSpan = document.createElement('span');
    emojiSpan.className = 'card-emoji';
    emojiSpan.textContent = cake.emoji;
    thumb.appendChild(emojiSpan);
  }

  if (cake.isCustom) {
    var badge = document.createElement('span');
    badge.className   = 'custom-badge';
    badge.textContent = 'Mới';
    thumb.appendChild(badge);
  }

  // --- Phần nội dung ---
  var body = document.createElement('div');
  body.className = 'card-body';

  var metaDiv = document.createElement('div');
  metaDiv.className = 'card-meta';

  var regionSpan = document.createElement('span');
  regionSpan.className   = 'card-region';
  regionSpan.textContent = cake.region;
  metaDiv.appendChild(regionSpan);

  var categorySpan = document.createElement('span');
  categorySpan.className   = 'card-category';
  categorySpan.textContent = cake.category;
  metaDiv.appendChild(categorySpan);

  var titleH3 = document.createElement('h3');
  titleH3.className   = 'card-title';
  titleH3.textContent = cake.name;

  var descP = document.createElement('p');
  descP.className   = 'card-desc';
  descP.textContent = cake.description;

  var footerDiv = document.createElement('div');
  footerDiv.className = 'card-footer';

  var starsSpan = document.createElement('span');
  starsSpan.className   = 'card-stars';
  starsSpan.textContent = getStars(cake.rating);
  footerDiv.appendChild(starsSpan);

  var ratingSpan = document.createElement('span');
  ratingSpan.className   = 'card-rating';
  ratingSpan.textContent = cake.rating + '/5';
  footerDiv.appendChild(ratingSpan);

  // Ghép các phần lại
  body.appendChild(metaDiv);
  body.appendChild(titleH3);
  body.appendChild(descP);
  body.appendChild(footerDiv);

  card.appendChild(thumb);
  card.appendChild(body);

  // Khi click vào thẻ → xem chi tiết
  card.addEventListener('click', function() {
    location.hash = '#detail/' + cake.id;
  });

  return card;
}


// ============================================================
// SỰ KIỆN
// ============================================================

getEl('hamburger').addEventListener('click', function() {
  getEl('nav').classList.toggle('open');
});

getEl('hero-search-btn').addEventListener('click', function() {
  searchQuery = getEl('hero-input').value.trim();
  currentPage = 1;
  location.hash = '#cakes';
});

getEl('hero-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    searchQuery = getEl('hero-input').value.trim();
    currentPage = 1;
    location.hash = '#cakes';
  }
});

getEl('search-input').addEventListener('input', function() {
  searchQuery = this.value;
  currentPage = 1;
  showCakes();
  getEl('search-input').focus();
});

getEl('region-filter').addEventListener('change', function() {
  selectedRegion = this.value;
  currentPage = 1;
  showCakes();
});

getEl('category-filter').addEventListener('change', function() {
  selectedCategory = this.value;
  currentPage = 1;
  showCakes();
});

getEl('sort-filter').addEventListener('change', function() {
  sortType = this.value;
  currentPage = 1;
  showCakes();
});

getEl('reset-btn').addEventListener('click', resetFilters);
getEl('empty-reset-btn').addEventListener('click', resetFilters);

getEl('back-btn').addEventListener('click', function() {
  history.back();
});


// ============================================================
// LOAD BÁNH TỪ LOCALSTORAGE (do admin thêm)
// ============================================================

try {
  var customCakes = JSON.parse(localStorage.getItem('banhngot_custom') || '[]');
  for (let i = 0; i < customCakes.length; i++) {
    var alreadyIn = false;
    for (let j = 0; j < CAKES.length; j++) {
      if (CAKES[j].id === customCakes[i].id) {
        alreadyIn = true;
        break;
      }
    }
    if (!alreadyIn) {
      CAKES.push(customCakes[i]);
    }
  }
} catch (e) {}


// ============================================================
// KHỞI ĐỘNG
// ============================================================

window.addEventListener('hashchange', showPage);
window.addEventListener('load', showPage);
