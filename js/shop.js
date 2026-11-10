/* БрендUa — спільна логіка: товари, кошик, обране, картки, шапка й футер.
   Щоб додати товар, допишіть об'єкт у PRODUCTS (id використовується в product.html?id=...). */
(function () {
  'use strict';
  const CART_KEY = 'brendua_cart_v1', FAV_KEY = 'brendua_favs_v1';
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const CATEGORIES = { tshirts: 'Футболки', shirts: 'Сорочки та блузи', sweaters: 'Светри', hoodies: 'Світшоти та худі', pants: 'Штани', outerwear: 'Верхній одяг' };
  const P = (id, name, category, color, material, price, file, description, extra) =>
    Object.assign({ id: id, name: name, category: category, color: color, material: material, price: price, image: 'assets/images/' + file, description: description }, extra);
  /* УВАГА: ціни, кольори, матеріали й описи нових товарів — заглушки за назвами файлів. Виправте їх тут. */
  const PRODUCTS = [
    P('tshirt', 'Футболка базова', 'tshirts', 'Молочний', 'Бавовна', 790, 'футболка-мол.png', 'Базова футболка прямого крою з щільної бавовни — основа щоденного гардероба.', { sku: 'UA-TS-2026-W', images: ['assets/images/футболка-мол.png', 'assets/images/відгук2.png'], details: ['Склад: 95% бавовна, 5% еластан', 'Щільність тканини: 220 г/м²', 'Прання у делікатному режимі при температурі не вище 30°C'] }),
    P('hoodie', 'Худі вільного крою', 'hoodies', 'Сірий', 'Утеплений', 1890, 'худі-сіре.png', 'Утеплене худі вільного крою для прохолодних днів.'),
    P('cargo', 'Штани карго', 'pants', 'Чорний', 'Льон', 1850, 'штани-чорні.png', 'Льняні штани карго для щоденного носіння.'),
    P('sweatshirt', 'Світшот класичний', 'hoodies', 'Бежевий', 'Бавовна', 1290, 'світшот-беж.png', 'Класичний бавовняний світшот на кожен день.'),
    P('tee-black', 'Футболка чорна', 'tshirts', 'Чорний', '', 790, 'чорнафутбол.png', 'Чорна футболка на щодень.', { group: 'tee' }),
    P('tee-white', 'Футболка біла', 'tshirts', 'Білий', '', 790, 'футболкабіламала.png', 'Біла футболка на щодень.', { group: 'tee' }),
    P('tee-milk', 'Футболка молочна', 'tshirts', 'Молочний', '', 790, 'молочнафутболка.png', 'Молочна футболка на щодень.', { group: 'tee', bestseller: true }),
    P('tee-green', 'Футболка світло-зелена', 'tshirts', 'Світло-зелений', '', 790, 'футболкасвітлозел.png', 'Світло-зелена футболка на щодень.', { group: 'tee' }),
    P('shirt-white', 'Сорочка біла', 'shirts', 'Білий', '', 990, 'сорочкабіла.png', 'Біла сорочка, яка поєднується з усім гардеробом.', { group: 'shirt', bestseller: true }),
    P('shirt-black', 'Сорочка чорна', 'shirts', 'Чорний', '', 990, 'сорочкачорна.png', 'Чорна сорочка для щоденних і святкових образів.', { group: 'shirt' }),
    P('blouse-white', 'Блуза біла', 'shirts', 'Білий', '', 1090, 'блузабіла.png', 'Легка біла блуза на кожен день.', { group: 'blouse' }),
    P('blouse-beige', 'Блуза бежева', 'shirts', 'Бежевий', '', 1090, 'блузабеж.png', 'Легка бежева блуза м\'якого відтінку.', { group: 'blouse' }),
    P('sweater-1', 'Светр 1', 'sweaters', '', '', 1490, 'светр1.png', 'Теплий светр для прохолодної погоди.'),
    P('sweater-2', 'Светр 2', 'sweaters', '', '', 1490, 'светр2.png', 'Теплий светр для прохолодної погоди.'),
    P('sweater-3', 'Светр 3', 'sweaters', '', '', 1490, 'светр3.png', 'Теплий светр для прохолодної погоди.'),
    P('sweater-4', 'Светр 4', 'sweaters', '', '', 1490, 'светр4.png', 'Теплий светр для прохолодної погоди.'),
    P('jeans-black', 'Джинси чорні', 'pants', 'Чорний', '', 1590, 'джинсичорні.png', 'Чорні джинси для щоденного носіння.', { bestseller: true }),
    P('jeans', 'Джинси', 'pants', '', '', 1590, 'jeans.png', 'Класичні джинси для щоденного носіння.'),
    P('velvet-pants', 'Штани велюрові чорні', 'pants', 'Чорний', 'Велюр', 1690, 'чорнвелветшт.png', 'Чорні велюрові штани з м\'якою фактурою.'),
    P('linen-pants', 'Штани льняні', 'pants', '', 'Льон', 1650, 'штанильон.png', 'Легкі льняні штани для теплої погоди.'),
    P('velvet-jacket', 'Куртка велюрова чорна', 'outerwear', 'Чорний', 'Велюр', 2790, 'чорнвельветкуртка.png', 'Чорна велюрова куртка на міжсезоння.'),
    P('khaki-jacket', 'Куртка хакі', 'outerwear', 'Хакі', '', 2490, 'курткахакі.png', 'Куртка кольору хакі на міжсезоння.'),
    P('puffer', 'Пуховик', 'outerwear', '', '', 3490, 'пуховикшок.png', 'Теплий пуховик для холодної пори року.'),
    P('wool-coat', 'Пальто вовняне молочне', 'outerwear', 'Молочний', 'Вовна', 3990, 'вовнапальтомол.png', 'Молочне пальто з вовни — класика на осінь і зиму.', { bestseller: true })
  ];
  const meta = (p) => [p.color, p.material].filter(Boolean).join(' · ');

  const load = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* сховище недоступне */ } };
  const product = (id) => PRODUCTS.find((p) => p.id === id);
  const price = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0грн';

  /* ---------- Кошик ---------- */
  const cart = () => load(CART_KEY).filter((i) => product(i.id) && i.qty > 0);
  const count = () => cart().reduce((s, i) => s + i.qty, 0);
  const total = () => cart().reduce((s, i) => s + i.qty * product(i.id).price, 0);
  const qtyOf = (id) => cart().filter((i) => i.id === id).reduce((s, i) => s + i.qty, 0);

  function sync(announce) {
    const n = count();
    document.querySelectorAll('.cart-count').forEach((b) => {
      b.textContent = n;
      const a = b.closest('a');
      if (a) a.setAttribute('aria-label', 'Кошик покупок, товарів: ' + n);
    });
    const live = document.getElementById('cart-live-region');
    if (live && announce) live.textContent = 'У кошику товарів: ' + n;
  }
  function commit(items) {
    save(CART_KEY, items);
    sync(true);
    window.dispatchEvent(new Event('cart:change'));
  }
  function add(id, size, qty, silent) {
    size = size || ''; qty = qty || 1;
    const items = cart();
    const it = items.find((i) => i.id === id && i.size === size);
    if (it) it.qty += qty; else items.push({ id: id, size: size, qty: qty });
    commit(items);
    if (!silent) toast(product(id).name);
  }
  function setQty(id, size, qty) {
    commit(cart().map((i) => (i.id === id && i.size === size ? { id: i.id, size: i.size, qty: qty } : i)).filter((i) => i.qty > 0));
  }
  function setSize(id, from, to) {
    const items = cart();
    const it = items.find((i) => i.id === id && i.size === from);
    if (!it) return;
    const twin = items.find((i) => i !== it && i.id === id && i.size === to);
    if (twin) { twin.qty += it.qty; items.splice(items.indexOf(it), 1); } else it.size = to;
    commit(items);
  }
  function clear() { commit([]); }
  // «+» і «−» на картці працюють з рядком без розміру (або з останнім доданим)
  function pick(id) { const l = cart().filter((i) => i.id === id); return l.find((i) => i.size === '') || l[l.length - 1]; }
  function inc(id) { const l = pick(id); if (l) setQty(id, l.size, l.qty + 1); else add(id, '', 1, true); }
  function dec(id) { const l = pick(id); if (l) setQty(id, l.size, l.qty - 1); }

  /* ---------- Обране ---------- */
  const isFav = (id) => load(FAV_KEY).includes(id);
  function toggleFav(id) {
    const f = load(FAV_KEY);
    save(FAV_KEY, f.includes(id) ? f.filter((x) => x !== id) : f.concat(id));
  }

  /* ---------- Повідомлення «додано в кошик» ---------- */
  function toast(name) {
    let t = document.getElementById('cart-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'cart-toast';
      t.setAttribute('role', 'status');
      t.className = 'hidden fixed bottom-4 right-4 left-4 sm:left-auto z-50 bg-gray-900 text-white text-sm rounded-xl shadow-xl px-4 py-3 items-center justify-between gap-4';
      document.body.appendChild(t);
    }
    t.innerHTML = '<span>«' + name + '» у кошику</span><a href="cart.html" class="underline font-semibold whitespace-nowrap">До кошика</a>';
    t.classList.remove('hidden'); t.classList.add('flex');
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.classList.add('hidden'); t.classList.remove('flex'); }, 3500);
  }

  /* ---------- Картка товару (каталог) ---------- */
  function cardHTML(p) {
    const btn = 'w-9 h-9 rounded-full bg-white text-gray-800 font-bold shadow-sm hover:bg-gray-200 transition flex items-center justify-center border-none cursor-pointer';
    return '<li data-product-id="' + p.id + '" class="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">' +
      '<a href="product.html?id=' + p.id + '" class="block group no-underline text-inherit">' +
      '<div class="overflow-hidden bg-brand-beige aspect-[302/320]"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"></div>' +
      '<div class="p-5"><h3 class="text-lg font-bold text-gray-900">' + p.name + '</h3><p class="text-sm text-gray-500 mt-1">' + meta(p) + '</p><p class="text-xl font-bold text-gray-900 mt-2">' + price(p.price) + '</p></div></a>' +
      '<div class="p-5 pt-0 flex items-center justify-between gap-3"><div class="w-full">' +
      '<button type="button" class="add-to-cart-btn w-full !bg-brand-ink hover:!bg-brand-ink-hover !text-white py-2.5 px-4 rounded-full font-medium text-sm transition duration-200 border-none cursor-pointer hover:!transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2">В кошик</button>' +
      '<div class="quantity-control hidden items-center justify-between bg-gray-100 rounded-full p-1 border border-gray-200">' +
      '<button class="decrease-btn ' + btn + '" type="button" aria-label="Зменшити кількість: ' + p.name + '">−</button><span class="item-count font-semibold text-gray-900 text-sm">1</span>' +
      '<button class="increase-btn ' + btn + '" type="button" aria-label="Збільшити кількість: ' + p.name + '">+</button></div></div>' +
      '<button type="button" aria-label="Додати в обране" aria-pressed="false" class="like-btn p-2.5 bg-transparent text-gray-500 hover:text-red-500 rounded-full border border-gray-200 hover:bg-gray-50 transition cursor-pointer"><i class="far fa-heart text-lg" aria-hidden="true"></i></button></div></li>';
  }

  // Оживляє всі li[data-product-id]: «В кошик», лічильник, обране (працює і на index, і в каталозі)
  function bindCards(root) {
    (root || document).querySelectorAll('li[data-product-id]').forEach((card) => {
      const id = card.dataset.productId, $ = (s) => card.querySelector(s);
      const addBtn = $('.add-to-cart-btn'), ctl = $('.quantity-control'), num = $('.item-count'), like = $('.like-btn');
      if (!addBtn || !ctl || !num) return;
      const render = () => {
        const q = qtyOf(id);
        addBtn.classList.toggle('hidden', q > 0);
        ctl.classList.toggle('hidden', q === 0);
        ctl.classList.toggle('flex', q > 0);
        num.textContent = q || 1;
        if (like) {
          const on = isFav(id), i = like.querySelector('i');
          like.setAttribute('aria-pressed', String(on));
          like.setAttribute('aria-label', on ? 'Видалити з обраного' : 'Додати в обране');
          if (i) { i.classList.toggle('fas', on); i.classList.toggle('far', !on); }
        }
      };
      addBtn.addEventListener('click', () => { add(id); $('.decrease-btn').focus(); });
      $('.increase-btn').addEventListener('click', () => inc(id));
      $('.decrease-btn').addEventListener('click', () => { dec(id); if (!qtyOf(id)) addBtn.focus(); });
      if (like) like.addEventListener('click', () => { toggleFav(id); render(); });
      window.addEventListener('cart:change', render);
      render();
    });
  }

  /* ---------- Шапка й футер для внутрішніх сторінок ---------- */
  function layout(active) {
    const nav = (href, label, key, cls) => '<a href="' + href + '" class="' + (cls || '') + (key === active ? ' text-blue-600' : ' text-gray-700') + ' hover:text-blue-600 font-medium transition"' + (key === active ? ' aria-current="page"' : '') + '>' + label + '</a>';
    const badge = '<span class="cart-count absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">0</span>';
    const search = (id) => '<form action="catalog.html" method="GET" class="flex items-center gap-2"><label for="' + id + '" class="sr-only">Пошук товарів</label><input id="' + id + '" name="q" type="text" placeholder="Пошук товарів..." class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"><button type="submit" aria-label="Шукати" class="!bg-brand-deep !text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:!bg-brand-deep-hover transition"><i class="fas fa-search"></i></button></form>';
    const head = document.getElementById('site-header');
    if (head) {
      head.innerHTML = '<header class="bg-white border-b border-gray-200 sticky top-0 z-40"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">' +
        '<a href="index.html" class="flex items-center" aria-label="БрендUa — головна сторінка"><img src="assets/images/logo.svg" alt="Логотип БрендUa"></a>' +
        '<nav class="hidden md:flex items-center space-x-8" aria-label="Головна навігація">' + nav('index.html', 'Головна', 'home') + nav('catalog.html', 'Каталог', 'catalog') + nav('about.html', 'Про нас', 'about') + nav('contacts.html', 'Контакти', 'contacts') + '</nav>' +
        '<div class="flex items-center gap-5"><div class="relative hidden sm:block"><button id="search-btn" type="button" aria-label="Пошук по сайту" aria-expanded="false" aria-controls="search-field" class="bg-transparent !text-gray-600 hover:!text-blue-600 border-none shadow-none cursor-pointer"><i class="fas fa-search"></i></button>' +
        '<div id="search-field" class="hidden absolute right-0 top-full mt-3 w-72 bg-white p-2.5 rounded-xl shadow-xl border border-gray-200 z-50">' + search('header-search') + '</div></div>' +
        '<a href="profile.html" aria-label="Особистий кабінет" class="hidden sm:block text-gray-600 hover:text-blue-600 transition"><i class="fas fa-user"></i></a>' +
        '<a href="cart.html" aria-label="Кошик покупок" class="text-gray-600 hover:text-blue-600 transition relative"><i class="fas fa-shopping-bag text-lg"></i>' + badge + '</a>' +
        '<button id="menu-btn" type="button" class="md:hidden bg-transparent !text-gray-700 hover:!text-blue-600 p-2 rounded-lg border-none" aria-label="Відкрити або закрити меню" aria-expanded="false" aria-controls="mobile-menu"><i class="fas fa-bars text-2xl"></i></button></div></div>' +
        '<div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-6 space-y-3">' + search('mobile-search') +
        '<nav class="flex flex-col gap-2" aria-label="Мобільне меню">' + nav('index.html', 'Головна', 'home', 'py-1') + nav('catalog.html', 'Каталог', 'catalog', 'py-1') + nav('about.html', 'Про нас', 'about', 'py-1') + nav('contacts.html', 'Контакти', 'contacts', 'py-1') + nav('profile.html', 'Особистий кабінет', 'profile', 'py-1') + '</nav></div></header>' +
        '<p id="cart-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></p>';
      const mBtn = document.getElementById('menu-btn'), mMenu = document.getElementById('mobile-menu');
      const sBtn = document.getElementById('search-btn'), sBox = document.getElementById('search-field');
      const setMenu = (o) => { mMenu.classList.toggle('hidden', !o); mBtn.setAttribute('aria-expanded', String(o)); };
      const setSearch = (o) => { sBox.classList.toggle('hidden', !o); sBtn.setAttribute('aria-expanded', String(o)); if (o) document.getElementById('header-search').focus(); };
      mBtn.addEventListener('click', () => setMenu(mBtn.getAttribute('aria-expanded') !== 'true'));
      sBtn.addEventListener('click', (e) => { e.stopPropagation(); setSearch(sBtn.getAttribute('aria-expanded') !== 'true'); });
      document.addEventListener('click', (e) => { if (!sBox.contains(e.target)) setSearch(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setSearch(false); setMenu(false); } });
      window.addEventListener('resize', () => { if (window.innerWidth >= 768) setMenu(false); });
    }
    const foot = document.getElementById('site-footer');
    if (foot) {
      const l = (href, t) => '<li><a href="' + href + '" class="hover:text-white focus:text-white focus:outline-none transition duration-200">' + t + '</a></li>';
      foot.innerHTML = '<footer class="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
        '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"><div class="space-y-3"><a href="index.html" aria-label="Головна сторінка"><img src="assets/images/logo.svg" alt="Логотип БрендUa" loading="lazy" class="h-12 w-auto brightness-0 invert"></a><p class="text-sm text-gray-400 leading-relaxed">Український одяг на щодень.<br>Створено для твого комфорту.</p></div>' +
        '<div><h2 class="text-white font-semibold text-base mb-3">Каталог</h2><ul class="space-y-2 text-sm">' + Object.keys(CATEGORIES).map((k) => l('catalog.html?cat=' + k, CATEGORIES[k])).join('') + '</ul></div>' +
        '<div><h2 class="text-white font-semibold text-base mb-3">Допомога покупцю</h2><ul class="space-y-2 text-sm">' + l('delivery.html', 'Доставка й оплата') + l('contacts.html', 'Контакти') + '</ul></div>' +
        '<div><h2 class="text-white font-semibold text-base mb-3">Зв\'язок із нами</h2><ul class="space-y-2 text-sm text-gray-400"><li>Пн–Пт: 09:00–18:00</li></ul></div></div>' +
        '<div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4"><p>&copy; 2026 БрендUa. Всі права захищені.</p><div class="flex gap-x-6"><a href="about.html" class="hover:text-white transition">Політика конфіденційності</a><a href="about.html" class="hover:text-white transition">Публічна оферта</a></div></div></div></footer>';
    }
  }

  window.addEventListener('storage', (e) => { if (e.key === CART_KEY) { sync(false); window.dispatchEvent(new Event('cart:change')); } });
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page) layout(page);
    sync(false);
  });

  window.Shop = { PRODUCTS: PRODUCTS, CATEGORIES: CATEGORIES, SIZES: SIZES, product: product, meta: meta, price: price, cart: cart, count: count, total: total, qtyOf: qtyOf, add: add, setQty: setQty, setSize: setSize, clear: clear, inc: inc, dec: dec, isFav: isFav, toggleFav: toggleFav, cardHTML: cardHTML, bindCards: bindCards };
})();
