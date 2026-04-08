/**
 * ============================================================================
 * SHARED CART UTILITIES - REFACTORING CANDIDATE
 * ============================================================================
 * 
 * This module contains commonly used cart operations that are duplicated
 * between product.js and main-product.js
 * 
 * TODO: Extract these to a shared module to reduce code duplication
 */

// Fetch configuration helper (already duplicated in product.js)
function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/**
 * Update cart count display across the site
 * DUPLICATED IN: QuickBuy.fetchAddCart(), ProductForm.onSubmitHandler(), CartNotification.addGiftwrapClick()
 * 
 * Usage:
 * const cart = await fetch("/cart.json").then(r => r.json());
 * updateCartCountDisplay(cart.item_count);
 */
export function updateCartCountDisplay(itemCount) {
  if (itemCount !== undefined) {
    document.querySelectorAll(".cart-count").forEach((el) => {
      if (el.classList.contains("cart-count-drawer")) {
        el.innerHTML = `(${itemCount})`;
      } else {
        el.innerHTML = itemCount;
      }
    });

    if (document.querySelector("header-total-price")) {
      fetch("/cart.json")
        .then((res) => res.json())
        .then((cart) => {
          document
            .querySelector("header-total-price")
            .updateTotal(cart);
        });
    }

    const cart_free_ship = document.querySelector(
      "free-ship-progress-bar"
    );
    if (cart_free_ship) {
      fetch("/cart.json")
        .then((res) => res.json())
        .then((cart) => {
          cart_free_ship.init(cart.items_subtotal_price);
        });
    }
  }
}

/**
 * Process cart API response and update DOM
 * DUPLICATED IN: QuickBuy.fetchAddCart() L~180 and ProductForm.onSubmitHandler() L~350
 * 
 * Similar logic appears 3+ times with slight variations
 * This includes: DOM parsing, cartUpsell handling, section rendering
 */
export function handleCartUpsellUpdate(html, miniCart) {
  const cartUpsell = miniCart.querySelector(".bls-recommendations-beside");
  const html_cartUpsell = html.querySelector(".bls-recommendations-beside");
  const html_cartUpselSelected = html.querySelector(
    ".bls-recommendations-beside-selected"
  );
  
  if (cartUpsell && html_cartUpsell) {
    let counteSelect;
    if (html_cartUpselSelected) {
      counteSelect = Array.from(
        html_cartUpselSelected.getElementsByClassName("bls-cart-upsell-item")
      );
      if (counteSelect.length == 0) {
        cartUpsell.classList.remove("is-opend");
        const cartUpsellMobile = miniCart.querySelector(
          ".cart-recomment-beside-mobile"
        );
        if (cartUpsellMobile) {
          cartUpsellMobile.classList.add("d-none");
        }
      }
    }

    if (!counteSelect || counteSelect.length != 0) {
      setTimeout(() => {
        cartUpsell.classList.add("is-opend");
      }, 1500);
    }

    cartUpsell.innerHTML = html_cartUpsell.innerHTML;
  }
}

/**
 * REFACTORING CHECKLIST:
 * 
 * [ ] Extract updateCartCountDisplay() to shared module
 * [ ] Extract handleCartUpsellUpdate() to shared module
 * [ ] Create handleAddToCartError(errorData, containerSelector)
 * [ ] Unify cart section rendering logic
 * [ ] Create CartManager class to encapsulate all operations
 * [ ] Update tests after refactoring
 * [ ] Verify all cart flows work: quick-buy, product form, gift wrap, mini cart
 * [ ] Remove unused code from product.js
 * 
 * ESTIMATED TIME: 2-3 hours
 * EXPECTED SAVINGS: 10-15KB minified
 */

export default {
  updateCartCountDisplay,
  handleCartUpsellUpdate,
};
