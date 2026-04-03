// App State
const state = {
    currentScreen: 'login-screen',
    order: {
        branch: 'KOTA BHARU',
        mode: 'Dine In',
        date: '',
        time: '',
        people: 1,
        tableNeeds: 'No Preference',
        items: [] // {id, name, price, qty}
    }
};

// Menu Data - Replaced flat RM 5 with realistic pricing and categories
const menuData = [
    {
        id: 1,
        name: "Beef Carbonara",
        category: "mains",
        price: 15.90,
        img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Classic Cheeseburger",
        category: "mains",
        price: 13.50,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Beef Bolognese",
        category: "mains",
        price: 14.50,
        img: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        name: "Spicy Meatballs",
        category: "sides",
        price: 9.90,
        img: "https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        name: "Loaded Cheese Fries",
        category: "sides",
        price: 8.50,
        img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        name: "Chicken Popcorn",
        category: "sides",
        price: 11.00,
        img: "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        name: "Iced Caramel Macchiato",
        category: "drinks",
        price: 12.00,
        img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        name: "Matcha Latte",
        category: "drinks",
        price: 10.50,
        img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

// Screen Navigation
function showScreen(screenId) {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    target.classList.add('active');
    state.currentScreen = screenId;
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initial Navigation
window.addEventListener('DOMContentLoaded', () => {
    // Set default values for date and time inputs
    const now = new Date();
    const dateInput = document.getElementById('order-date');
    const timeInput = document.getElementById('order-time');
    
    if (dateInput) dateInput.value = now.toISOString().split('T')[0];
    if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
    
    renderMenu('all');
});

// Selection Handlers
function selectBranch(branchName) {
    state.order.branch = branchName;
    document.getElementById('selected-branch-label').innerText = branchName;
    showScreen('mode-screen');
}

function selectMode(mode) {
    state.order.mode = mode;
    showScreen('details-screen');
}

function changeNumber(id, delta) {
    const input = document.getElementById(id);
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
    state.order.people = val;
}

// Menu Rendering
function renderMenu(category) {
    const menuGrid = document.getElementById('menu-items');
    menuGrid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === category);
        
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="item-img">
            <h4>${item.name}</h4>
            <span class="item-price">RM ${item.price.toFixed(2)}</span>
            <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuGrid.appendChild(card);
    });
}

// Category Tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderMenu(tab.dataset.category);
    });
});

// Cart Logic
function addToCart(itemId) {
    const item = menuData.find(i => i.id === itemId);
    const existing = state.order.items.find(i => i.id === itemId);
    
    if (existing) {
        existing.qty++;
    } else {
        state.order.items.push({ ...item, qty: 1 });
    }
    
    updateCartUI();
    
    // Animation for feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.background = "#4CAF50";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1000);
}

function updateCartUI() {
    const totalQty = state.order.items.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = state.order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('peek-qty').innerText = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
    document.getElementById('peek-total').innerText = `RM ${totalPrice.toFixed(2)}`;
    
    const peek = document.getElementById('cart-peek');
    if (totalQty > 0) {
        peek.classList.add('visible');
    } else {
        peek.classList.remove('visible');
    }
}

// Checkout
function openCheckout() {
    renderSummary();
    document.getElementById('checkout-overlay').classList.add('visible');
}

function closeCheckout() {
    document.getElementById('checkout-overlay').classList.remove('visible');
}

function renderSummary() {
    const list = document.getElementById('cart-summary-list');
    list.innerHTML = '';
    
    state.order.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'summary-item';
        row.innerHTML = `
            <div class="item-main">
                <strong>${item.name}</strong> x${item.qty}
            </div>
            <span>RM ${(item.price * item.qty).toFixed(2)}</span>
        `;
        list.appendChild(row);
    });
    
    const subtotal = state.order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.06;
    const total = subtotal + tax;
    
    document.getElementById('summary-subtotal').innerText = `RM ${subtotal.toFixed(2)}`;
    document.getElementById('summary-tax').innerText = `RM ${tax.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `RM ${total.toFixed(2)}`;
}

function confirmOrder() {
    closeCheckout();
    // Simulate loading/confirming
    showScreen('receipt-screen');
    
    // Generate order ID
    const randomId = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('receipt-id').innerText = `#ON-${randomId}`;
}
