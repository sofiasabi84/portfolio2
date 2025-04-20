document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = mobileMenuBtn.querySelectorAll('span');
      spans[0].style.transform = navLinks.classList.contains('active') 
        ? 'rotate(45deg) translate(5px, 6px)' 
        : 'none';
      spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('active') 
        ? 'rotate(-45deg) translate(5px, -6px)' 
        : 'none';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-menu-btn') && !e.target.closest('.nav-links')) {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      }
    });
  }

  // Cart management
  const cart = {
    items: {},

    addItem(id, name, price, quantity) {
      if (this.items[id]) {
        this.items[id].quantity += quantity;
      } else {
        this.items[id] = { name, price, quantity };
      }
      this.updateCart();
    },

    removeItem(id) {
      delete this.items[id];
      this.updateCart();
    },

    updateQuantity(id, quantity) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        this.items[id].quantity = quantity;
      }
      this.updateCart();
    },

    getTotal() {
      return Object.values(this.items).reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    updateCart() {
      const cartItems = document.getElementById('cart-items');
      const cartTotal = document.getElementById('cart-total');
      if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        Object.entries(this.items).forEach(([id, item]) => {
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} €</span>
          `;
          cartItems.appendChild(itemElement);
        });
        cartTotal.textContent = `${this.getTotal().toFixed(2)} €`;
      }
    }
  };

  // Initialize quantity controls
  document.querySelectorAll('.quantity-controls').forEach(control => {
    const input = control.querySelector('.quantity-input');
    const minusBtn = control.querySelector('.minus');
    const plusBtn = control.querySelector('.plus');
    const productCard = control.closest('.product-card');
    const productName = productCard ? productCard.querySelector('h3').textContent : '';
    const productPrice = productCard ? parseFloat(productCard.querySelector('.price').textContent) : 0;
    const productId = productName.toLowerCase().replace(/\s+/g, '-');

    if (minusBtn && plusBtn) {
      minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 0;
        input.value = Math.max(0, currentValue - 1);
        cart.updateQuantity(productId, parseInt(input.value));
      });

      plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;
        cart.addItem(productId, productName, productPrice, 1);
      });

      input.addEventListener('change', () => {
        const value = parseInt(input.value) || 0;
        input.value = Math.max(0, value);
        cart.updateQuantity(productId, parseInt(input.value));
      });
    }
  });

  // Fetch products and update cart
  fetch('produits.php')
    .then(response => response.json())
    .then(data => {
      const productContainer = document.querySelector('.products-grid');
      if (productContainer) {
        productContainer.innerHTML = data.map(product => `
          <div class="product-card">
            <img src="${product.image}" alt="${product.nom}">
            <div class="product-content">
              <h3>${product.nom}</h3>
              <p>${product.description}</p>
              <div class="product-price">
                <span class="price">${product.prix} €</span>
                <div class="quantity-controls">
                  <button class="quantity-btn minus">-</button>
                  <input type="number" value="0" min="0" class="quantity-input" data-id="${product.id}">
                  <button class="quantity-btn plus">+</button>
                </div>
              </div>
            </div>
          </div>
        `).join('');
        initCart();
      }
    })
    .catch(error => console.error('Error loading products:', error));

  function initCart() {
    // Initialize cart controls for dynamically loaded products
    document.querySelectorAll('.quantity-controls').forEach(control => {
      const input = control.querySelector('.quantity-input');
      const minusBtn = control.querySelector('.minus');
      const plusBtn = control.querySelector('.plus');
      const productId = input.dataset.id;

      minusBtn.addEventListener('click', () => {
        input.value = Math.max(0, parseInt(input.value) - 1);
        updateCart(productId, parseInt(input.value));
      });

      plusBtn.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
        updateCart(productId, parseInt(input.value));
      });

      input.addEventListener('change', () => {
        updateCart(productId, parseInt(input.value));
      });
    });

    function updateCart(id, quantity) {
      cart.addItem(id, '', 0, quantity); // Handle adding items to the cart
      const total = Object.values(cart.items).reduce((sum, item) => sum + item.quantity, 0);
      const cartTotal = document.getElementById('cart-total');
      if (cartTotal) cartTotal.textContent = `${total} articles`;
    }
  }

  // Handle order form submission
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(orderForm);
      const orderDetails = {
        customer: Object.fromEntries(formData),
        items: cart.items,
        total: cart.getTotal()
      };

      // Here you would typically send the order to your backend
      console.log('Order submitted:', orderDetails);

      // Simulate order submission response
      alert('Votre commande a été enregistrée ! Nous vous contacterons bientôt pour confirmer.');

      // Reset form and cart
      orderForm.reset();
      cart.items = {};
      cart.updateCart();
    });
  }

  // Contact form handling to append cart items
  const contactForm = document.querySelector('form.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const cartItems = document.querySelectorAll('#cart-items .cart-item');
      let productsList = [];

      cartItems.forEach(item => {
        const name = item.querySelector('.item-name')?.innerText || "Produit inconnu";
        const quantity = item.querySelector('.item-quantity')?.innerText || "0";
        productsList.push(`${name} x${quantity}`);
      });

      const productsInput = document.getElementById('products');
      if (productsInput) {
        productsInput.value = productsList.join(', ');
      }
    });
    fetch('enregistrer_details.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    commande_id: commandeId, // récupéré depuis la réponse de traitement_commande.php
    items: cart.items
  })
})
.then(res => res.json())
.then(data => {
  console.log(data.message);
})
.catch(err => {
  console.error("Erreur lors de l'enregistrement des détails :", err);
});
function submitOrder() {
  const items = document.querySelectorAll(".product-card");
  let cart = [];

  // Collecte des éléments du panier
  items.forEach(card => {
      const name = card.querySelector("h3").textContent;
      const price = parseFloat(card.querySelector(".price").textContent.replace("€", "").replace(",", "."));
      const quantity = parseInt(card.querySelector(".quantity-input").value);
      
      // Si la quantité est supérieure à 0, ajoutez l'élément au panier
      if (quantity > 0) {
          cart.push({
              nom: name,
              prix: price,
              quantite: quantity
          });
      }
  });

  // Vérifier si le panier est vide
  if (cart.length === 0) {
      alert("Votre panier est vide !");
      return;
  }

  // Crée un identifiant temporaire pour la commande (peut être remplacé par un ID de commande réel)
  const commandeId = Date.now(); 

  // Remplir le champ caché avec les données du panier
  document.getElementById("products").value = JSON.stringify(cart);

  // Soumettre le formulaire
  document.getElementById("order-form").submit();

  // Envoi des détails de la commande via fetch
  fetch('enregistrer_details.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          commande_id: commandeId,
          items: cart
      })
  })
  .then(res => res.json())
  .then(data => {
      console.log(data);
      alert(data.message); // Affiche le message de confirmation
  })
  .catch(err => {
      console.error(err);
      alert("Erreur lors de l'envoi : " + err.message); // Affiche une erreur si quelque chose va mal
  });
}

  }
});
