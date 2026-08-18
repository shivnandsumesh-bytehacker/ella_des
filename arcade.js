const Arcade = {
    // --- CURRENCY MANAGEMENT ---
    getCoins: function() {
        return parseInt(localStorage.getItem('arcade_coins')) || 0;
    },
    getLifetimeClicker: function() {
        return parseInt(localStorage.getItem('clicker_lifetime')) || 0;
    },
    addCoins: function(amount) {
        let mult = this.getMultiplier();
        let totalEarned = Math.round(amount * mult);
        let current = this.getCoins();
        localStorage.setItem('arcade_coins', current + totalEarned);
        this.updateUI();
        return totalEarned;
    },
    addClickerScore: function(amount) {
        let lifetime = this.getLifetimeClicker() + amount;
        localStorage.setItem('clicker_lifetime', lifetime);
        this.addCoins(amount);
        return lifetime;
    },
    deductCoins: function(amount) {
        let current = this.getCoins();
        if (current >= amount) {
            localStorage.setItem('arcade_coins', current - amount);
            this.updateUI();
            return true;
        }
        return false;
    },

    // --- INVENTORY & POWERUPS ---
    getInventory: function() {
        return JSON.parse(localStorage.getItem('arcade_inventory')) || [];
    },
    hasItem: function(itemId) {
        return this.getInventory().includes(itemId);
    },
    buyItem: function(itemId, price) {
        if (this.hasItem(itemId)) return true;
        if (this.deductCoins(price)) {
            let inv = this.getInventory();
            inv.push(itemId);
            localStorage.setItem('arcade_inventory', JSON.stringify(inv));
            return true;
        }
        return false;
    },
    getMultiplier: function() {
        return parseFloat(localStorage.getItem('arcade_multiplier')) || 1.0;
    },
    setMultiplier: function(val) {
        localStorage.setItem('arcade_multiplier', val);
    },

    // --- COSMETICS & THEMES ---
    getEquippedTheme: function() {
        return localStorage.getItem('arcade_theme') || 'default';
    },
    setEquippedTheme: function(themeId) {
        localStorage.setItem('arcade_theme', themeId);
        this.applyTheme();
    },
    getEquippedSkin: function() {
        return localStorage.getItem('arcade_skin') || 'default';
    },
    setEquippedSkin: function(skinId) {
        localStorage.setItem('arcade_skin', skinId);
    },

    // --- SYSTEM INITIALIZATION ---
    applyTheme: function() {
        const theme = this.getEquippedTheme();
        document.body.classList.remove('theme-cyberpunk', 'theme-matrix', 'theme-sunset', 'theme-synthwave');
        if (theme !== 'default') {
            document.body.classList.add('theme-' + theme);
        }
    },
    updateUI: function() {
        const coinEl = document.getElementById('coin-count');
        if (coinEl) coinEl.innerText = this.getCoins().toLocaleString();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Arcade.updateUI();
    Arcade.applyTheme();
});
