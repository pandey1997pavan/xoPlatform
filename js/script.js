// Menu filtering functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    // Fetch menu items from database
    try {
        const response = await fetch('http://localhost:3000/api/menu');
        const menuItems = await response.json();
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }

    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = button.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            
            if (button.classList.contains('minus')) {
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            } else {
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                }
            }
        });
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.menu-item');
            const quantity = parseInt(menuItem.querySelector('.quantity-input').value);
            const itemData = {
                id: Date.now(), // temporary ID
                name: menuItem.querySelector('h3').textContent,
                price: parseInt(menuItem.querySelector('.final-price').textContent.replace('₹', '')),
                originalPrice: parseInt(menuItem.querySelector('.original-price').textContent.replace('₹', '')),
                quantity: quantity,
                image: menuItem.querySelector('img').src
            };

            // Add to cart
            cart.push(itemData);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show success state
            button.classList.add('added');
            button.textContent = 'Added to Cart';
            setTimeout(() => {
                button.classList.remove('added');
                button.textContent = 'Add to Cart';
            }, 2000);

            updateCartDisplay();
        });
    });

    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
        if (cartCount > 0) {
            element.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    });
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message" style="text-align: center; padding: 2rem;">
                <img src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400" alt="Empty Cart" style="max-width: 200px; border-radius: 10px; margin-bottom: 1rem;">
                <p>Your cart is empty. Browse our <a href="menu.html" style="color: #ff6b6b;">menu</a> to add items!</p>
            </div>
        `;
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        const savings = (item.originalPrice - item.price) * item.quantity;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="price-container">
                        <span class="original-price">₹${item.originalPrice}</span>
                        <span class="discount-badge">10% OFF</span>
                        <span class="final-price">₹${item.price}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <div>₹${item.price * item.quantity}</div>
                    <div class="savings">You save: ₹${savings}</div>
                </div>
            </div>
        `;
    }).join('');

    // Update cart summary
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
        const deliveryFee = 50; // ₹50 delivery fee
        const totalSavings = cart.reduce((sum, item) => 
            sum + ((item.originalPrice - item.price) * item.quantity), 0);
            
        cartSummary.innerHTML = `
            <div class="subtotal">
                <span>Subtotal:</span>
                <span class="subtotal-amount">₹${total}</span>
            </div>
            <div class="savings-total">
                <span>Total Savings:</span>
                <span class="savings-amount">₹${totalSavings}</span>
            </div>
            <div class="delivery-fee">
                <span>Delivery Fee:</span>
                <span>₹${deliveryFee}</span>
            </div>
            <div class="total">
                <span>Total:</span>
                <span class="total-amount">₹${total + deliveryFee}</span>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        `;
    }
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    displayCartItems();
}

// Function to display menu items
function displayMenuItems(items) {
    const menuContainer = document.querySelector('.menu-items');
    if (!menuContainer) return;

    menuContainer.innerHTML = items.map(item => {
        const discountedPrice = Math.round(item.price * 0.9); // 10% discount
        return `
        <div class="menu-item" data-category="${item.category.toLowerCase()}">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price-container">
                <span class="original-price">₹${item.price.toFixed(2)}</span>
                <span class="discount-badge">10% OFF</span>
                <span class="final-price">₹${discountedPrice.toFixed(2)}</span>
            </div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `}).join('');
}

function initializeCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const itemId = button.getAttribute('data-id');
            cart.push(itemId);
            updateCartCount();
        });
    });
}

function updateCartCount() {
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
        element.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    });
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            message: contactForm.querySelector('textarea').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Sorry, there was an error submitting your message. Please try again.');
        }
    });
}