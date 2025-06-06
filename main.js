(function() {
  // I grab the hamburger menu, the off-canvas drawer, and the close button
    const menuButton = document.querySelector('.nav-icon--menu');
    const drawer     = document.querySelector('.menu-drawer');
    const closeButton= document.querySelector('.drawer-close');
  
    // If the menu icon and drawer exist, a click handler is set up to open the drawer
    if (menuButton && drawer) {
      menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
      });
    }
  
    // If the close button exists, I code a click handler to close the drawer
    if (closeButton && drawer) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      });
    }
  
    // If user clicks anywhere outside the drawer, the drawer itself will close
    document.addEventListener('click', function(e) {
      if (
        drawer &&
        drawer.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !menuButton.contains(e.target)
      ) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      }
    });
  
  // For each collapsible submenu button, I press the “expanded” class and swap plus/minus icons
  document.querySelectorAll('.drawer-button').forEach(btn => {
      btn.addEventListener('click', function() {
        const parentLi = this.closest('.drawer-item');
        const iconSpan = parentLi.querySelector('.drawer-icon');
        parentLi.classList.toggle('expanded');
        iconSpan.textContent = parentLi.classList.contains('expanded') ? '−' : '＋';
      });
    });
  })();
  
  
  
  // =======================
  // MAIN JS FUNCTIONALITY
  // =======================
  document.addEventListener('DOMContentLoaded', () => {
    // --------------------------
    // 1) SET UP CART IN LOCAL STORAGE
    // --------------------------
  // I load whatever is already in localStorage under “cart”, or start with an empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    function updateCartBadge() {
      const badge = document.querySelector('.cart-badge');
      if (!badge) return;
      const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
      badge.textContent = totalCount > 0 ? totalCount : '';
    }
    updateCartBadge();
  
    // --------------------------
    // 2) PRODUCT-LIST PAGE BEHAVIOR
    //    (Click a product-item → productpage.html?id=…)
    // --------------------------
    if (window.location.pathname.endsWith('productlist.html')) {
          // I look for every .product-item and attach a click that sends the user to productpage.html with the correct ID, in this case, only two products will work (Leo Leopard Side Table & Grace Lamp)
      const productItems = document.querySelectorAll('.product-item');
      productItems.forEach(item => {
        item.addEventListener('click', () => {
          const productId = item.getAttribute('data-id');
          if (productId) {
            window.location.href = `productpage.html?id=${productId}`;
          }
        });
      });
    }
  
    // --------------------------
    // 3) PRODUCT-DETAIL PAGE BEHAVIOR
    // --------------------------
    if (window.location.pathname.endsWith('productpage.html')) {
      // 3a) Read productId from URL (e.g. "?id=leo-leopard")
      const params       = new URLSearchParams(window.location.search);
      const productId    = params.get('id');  
      // 3b) GALLERY: thumbnails → main image + Prev/Next arrows + Lightbox
      const gallery = document.querySelector('.product-gallery');
      if (gallery) {
        const thumbEls = Array.from(gallery.querySelectorAll('.thumbnail-list .thumb'));
        const mainImg  = document.getElementById('product-img');
        const prevBtn  = gallery.querySelector('.thumb-nav.prev');
        const nextBtn  = gallery.querySelector('.thumb-nav.next');
        const overlay    = document.getElementById('lightbox-overlay');
        const overlayImg = document.getElementById('lightbox-img');
        let currentIndex = 0;
  
        if (thumbEls.length && mainImg) {
          // I build an array of URLs from the thumbnail attributes
          const imageURLs = thumbEls.map(el => el.getAttribute('src'));
  
          // Clicking a thumbnail updates main image (and lightbox if open)
          thumbEls.forEach((thumb, idx) => {
            thumb.addEventListener('click', () => {
              currentIndex = idx;
              mainImg.setAttribute('src', imageURLs[currentIndex]);
              if (overlay && overlay.classList.contains('open')) {
                overlayImg.src = imageURLs[currentIndex];
              }
            });
          });
  
          // Prev arrow: go back one image (wrapping around)
          if (prevBtn) {
            prevBtn.addEventListener('click', () => {
              currentIndex = (currentIndex - 1 + imageURLs.length) % imageURLs.length;
              mainImg.setAttribute('src', imageURLs[currentIndex]);
              if (overlay && overlay.classList.contains('open')) {
                overlayImg.src = imageURLs[currentIndex];
              }
            });
          }
  
          // Next arrow: go forward one image (wrapping around)
          if (nextBtn) {
            nextBtn.addEventListener('click', () => {
              currentIndex = (currentIndex + 1) % imageURLs.length;
              mainImg.setAttribute('src', imageURLs[currentIndex]);
              if (overlay && overlay.classList.contains('open')) {
                overlayImg.src = imageURLs[currentIndex];
              }
            });
          }
        }
  
      // Lightbox behavior: Clicking the main image opens an overlay with a larger view
      if (mainImg && overlay && overlayImg) {
          mainImg.addEventListener('click', () => {
            overlayImg.src = mainImg.src;
            overlay.setAttribute('aria-hidden', 'false');
            overlay.classList.add('open');
          });
  
          // Clicking the “×” in the overlay closes it
          const closeBtn = document.querySelector('.lightbox-close');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              overlay.classList.remove('open');
              overlay.setAttribute('aria-hidden', 'true');
            });
          }
          // Clicking anywhere on the overlay background also closes it
          overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
              overlay.classList.remove('open');
              overlay.setAttribute('aria-hidden', 'true');
            }
          });
        }
      }
  
      // 3c) Quantity selector: +/− buttons on product page
      const qtyContainer = document.querySelector('.quantity-selector');
      if (qtyContainer) {
        qtyContainer.addEventListener('click', (e) => {
          const btn = e.target.closest('.qty-btn');
          if (!btn) return;
          const action = btn.getAttribute('aria-label') || btn.dataset.action;
          const valueEl = qtyContainer.querySelector('.qty-value');
          let currentVal = parseInt(valueEl.textContent, 10);
  
          if (
            action === 'Increase' ||
            action === 'increase' ||
            btn.textContent.trim() === '＋'
          ) {
            currentVal++;
          } else if (
            action === 'Decrease' ||
            action === 'decrease' ||
            btn.textContent.trim() === '−'
          ) {
            currentVal = Math.max(1, currentVal - 1);
          }
          valueEl.textContent = currentVal; // update the displayed quantity
        });
      }
  
      // 3d) “Add to Cart” button: add item to localStorage cart[] and redirect to cart
      const addToCartBtn = document.querySelector('.add-to-cart');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
        // I pull the product’s title, price, quantity, and image URL from the DOM
          const titleEl = document.getElementById('product-title');
          const priceEl = document.getElementById('product-price');
          const qtyEl   = document.querySelector('.qty-value');
          const mainImg = document.getElementById('product-img');
  
          if (!titleEl || !priceEl || !qtyEl) {
            alert('Cannot find product info on the page.');
            return;
          }
  
          const productName = titleEl.textContent.trim();
          const priceNum    = parseFloat(priceEl.textContent.replace(/[^0-9\.]/g, '')) || 0;
          const quantity    = parseInt(qtyEl.textContent, 10) || 1;
          const imgURL      = mainImg ? mainImg.getAttribute('src') : '';
          // I use the URL query “id” if it exists; otherwise I derive from product name
          const idToUse     = productId || productName.toLowerCase().replace(/\s+/g, '-');
  
          // Add or update in cart[]
          const existingIdx = cart.findIndex(item => item.id === idToUse);
          if (existingIdx > -1) {
            cart[existingIdx].qty += quantity;
          } else {
            cart.push({
              id:    idToUse,
              name:  productName,
              price: priceNum,
              qty:   quantity,
              image: imgURL
            });
          }
  
          saveCart();
          updateCartBadge();
          addToCartBtn.textContent = 'Added ✓';
          setTimeout(() => {
            addToCartBtn.textContent = 'Add to Cart';
            window.location.href = 'shoppingcart.html';
          }, 500);
        });
      }
    } // end productpage.html block
  
    // --------------------------
    // 4) SHOPPING-CART PAGE BEHAVIOR
    // --------------------------
    if (window.location.pathname.endsWith('shoppingcart.html')) {
      const cartContainer = document.querySelector('.cart-container');
      // I grab the header row and summary block so I can hide them if cart is empty
      const headerRow     = cartContainer ? cartContainer.querySelector('.cart-header') : null;
      const summaryEl     = cartContainer ? cartContainer.querySelector('.cart-summary') : null;
      const emptyMessage  = cartContainer ? cartContainer.querySelector('.empty-cart') : null;
  
      function renderCartItems() {
        // If cart is empty → show empty message, hide header + summary
        if (!cart || cart.length === 0) {
          if (headerRow)    headerRow.style.display = 'none';
          if (summaryEl)    summaryEl.style.display = 'none';
          if (emptyMessage) emptyMessage.style.display = 'block';
          return;
        }
  
        // Otherwise, hide empty message and show header + summary
        if (emptyMessage) emptyMessage.style.display = 'none';
        if (headerRow)    headerRow.style.display    = '';
        if (summaryEl)    summaryEl.style.display    = '';
  
        // Remove existing .cart-item rows
        const existingRows = Array.from(cartContainer.querySelectorAll('.cart-item'));
        existingRows.forEach(row => row.remove());
  
        // Loop through cart and build new rows
        cart.forEach((item, idx) => {
          const row = document.createElement('div');
          row.classList.add('cart-row', 'cart-item');
          row.dataset.index = idx;
  
          // Product column
          const colProduct = document.createElement('div');
          colProduct.classList.add('cart-col', 'cart-col--product');
          colProduct.innerHTML = `
            <div class="product-card-image-wrapper">
              <img src="${item.image}" alt="${item.name}" class="cart-product-img" />
            </div>
            <span class="cart-product-name">${item.name}</span>
          `;
  
          // Quantity column
          const colQty = document.createElement('div');
          colQty.classList.add('cart-col', 'cart-col--quantity');
          colQty.innerHTML = `
            <div class="quantity-selector-desktop">
              <button class="qty-btn-desktop" data-action="decrease">−</button>
              <span class="qty-value-desktop">${item.qty}</span>
              <button class="qty-btn-desktop" data-action="increase">＋</button>
            </div>
          `;
  
          // Price column
          const colPrice = document.createElement('div');
          colPrice.classList.add('cart-col', 'cart-col--price');
          colPrice.innerHTML = `
            <span class="new-price">$${(item.price * item.qty).toFixed(2)}</span>
          `;
  
          // Remove “×” button attached to product image (mobile)
          const removeBtnMobile = document.createElement('button');
          removeBtnMobile.classList.add('remove-btn-mobile');
          removeBtnMobile.setAttribute('aria-label', 'Remove item');
          removeBtnMobile.textContent = '×';
          colProduct.prepend(removeBtnMobile);
  
          row.append(colProduct, colQty, colPrice);
          cartContainer.insertBefore(row, summaryEl);
        });
  
        attachCartItemListeners();
        recalcCartSummary();
      }
  
      function attachCartItemListeners() {
        // Quantity buttons inside each row
        const allQtySelectors = cartContainer.querySelectorAll('.quantity-selector-desktop');
        allQtySelectors.forEach(qtyWrap => {
          qtyWrap.addEventListener('click', (e) => {
            const btn = e.target.closest('.qty-btn-desktop');
            if (!btn) return;
            const action = btn.dataset.action;
            const row    = btn.closest('.cart-item');
            const index  = parseInt(row.dataset.index, 10);
            if (isNaN(index)) return;

            // Update the quantity in the cart array
            let currentQty = cart[index].qty;
            if (action === 'increase') {
              currentQty++;
            } else if (action === 'decrease') {
              currentQty = Math.max(1, currentQty - 1);
            }
            cart[index].qty = currentQty;
            saveCart();
            updateCartBadge();

            // Update the UI for that row
            const valueEl = row.querySelector('.qty-value-desktop');
            valueEl.textContent = currentQty;
            const priceEl = row.querySelector('.new-price');
            priceEl.textContent = `$${(cart[index].price * currentQty).toFixed(2)}`;
  
            recalcCartSummary();
          });
        });
  
        // Remove buttons (.remove-btn-mobile and any desktop “×” if implemented)
        const allRemoveBtns = cartContainer.querySelectorAll('.remove-btn-mobile');
        allRemoveBtns.forEach((rmBtn) => {
          rmBtn.addEventListener('click', () => {
            const row   = rmBtn.closest('.cart-item');
            const index = parseInt(row.dataset.index, 10);
            if (isNaN(index)) return;
            cart.splice(index, 1);
            saveCart();
            updateCartBadge();
            renderCartItems();
          });
        });
      }
  
      // Recalculate subtotal, shipping, and GST
      function recalcCartSummary() {
        const totalEl    = document.querySelector('.summary-total-price');
        const shippingEl = document.querySelector('.summary-shipping');
        const gstEl      = document.querySelector('.summary-gst');
  
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        if (totalEl)    totalEl.textContent    = `$${subtotal.toFixed(2)}`;
        if (shippingEl) {
          const shippingCost = subtotal > 100 ? 0 : 10;
          shippingEl.textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
        }
        if (gstEl) {
          const gstVal = subtotal * 0.10;
          gstEl.textContent = `$${gstVal.toFixed(2)}`;
        }
      }
  
      // Initial render on page load
      renderCartItems();
  
      // Checkout button navigates to checkout.html
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'checkout.html';
        });
      }
    }
  
    // --------------------------
    // 5) CHECKOUT PAGE BEHAVIOR
    // --------------------------
    if (window.location.pathname.endsWith('checkout.html')) {
      const checkoutContainer = document.querySelector('.checkout-container');
      if (checkoutContainer) {
        const orderSummaryEl = checkoutContainer.querySelector('.order-summary');
        // I build the order summary on the left side from the cart array
        if (orderSummaryEl) {
          orderSummaryEl.innerHTML = '';
          cart.forEach((item, idx) => {
            const card = document.createElement('div');
            card.classList.add('order-item');
            card.dataset.index = idx;
  
            card.innerHTML = `
              <div class="order-item-row" style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
                <img src="${item.image}" alt="${item.name}" class="order-item-img" style="width:80px; height:80px; object-fit:cover; background:#fff; border-radius:4px;"/>
                <div style="flex:1">
                  <div>${item.name}</div>
                  <div style="margin-top:0.25rem;">
                    <span class="order-item-price">$${(item.price * item.qty).toFixed(2)}</span>
                    <small style="float:right; background:#EFE6DD; padding:0.25rem; border-radius:4px;">${item.qty}</small>
                  </div>
                </div>
                <button class="remove-btn" aria-label="Remove item" style="background:none;border:none;font-size:1.25rem;color:#888;cursor:pointer;">×</button>
              </div>
            `;
            orderSummaryEl.appendChild(card);
          });
  
        // Allow removing items directly from the order summary
        const removeButtons = orderSummaryEl.querySelectorAll('.remove-btn');
          removeButtons.forEach(rm => {
            rm.addEventListener('click', (e) => {
              const row   = e.target.closest('.order-item');
              const index = parseInt(row.dataset.index, 10);
              if (!isNaN(index)) {
                cart.splice(index, 1); // remove from cart array 
                saveCart();
                updateCartBadge();
                row.remove(); // remove form DOM
              }
            });
          });
        }
  
        // Validate required fields on Confirm
        const confirmBtn     = document.querySelector('.confirm-btn');
        const requiredFields = Array.from(checkoutContainer.querySelectorAll('input[required]'));
        if (confirmBtn) {
          confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let valid = true;
            requiredFields.forEach(field => {
              if (!field.value.trim()) {
                valid = false;
                field.classList.add('input-error');
              } else {
                field.classList.remove('input-error');
              }
            });
            if (!valid) {
              window.alert('Please fill in all required fields.');
              return;
            }
            window.alert('Thank you! Your order has been placed.');
            cart = [];
            saveCart();
            updateCartBadge();
            // Optionally redirect back to home:
            // window.location.href = 'index.html';
          });
        }
      }
    }
  
    // --------------------------
    // 6) PAGE-TO-PAGE FLOW (outside DOMContentLoaded section)
    // --------------------------
    // I want clicking “Homewares & Décor” in the drawer to close it and go to productlist.html
  const homewaresLink = document.querySelector('.drawer-link--homewares') 
                       || document.getElementById('homewares-link');
    if (homewaresLink) {
      homewaresLink.addEventListener('click', e => {
        e.preventDefault();
        const drawer = document.querySelector('.menu-drawer');
        if (drawer) {
          drawer.classList.remove('open');
          drawer.setAttribute('aria-hidden', 'true');
        }
        window.location.href = 'productlist.html';
      });
    }
  
  // On shoppingcart.html, rendering and checkout logic are handled above in block 4
  
  }); // end DOMContentLoaded