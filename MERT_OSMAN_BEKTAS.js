(() => {
  const init = () => {
    if (location.pathname === "/" || location.pathname.includes("index.html")) {
      loadProducts();
    } else {
      console.log("Wrong Page!");
    }
  };

  const loadProducts = async () => {
    const products = await getProductList();
    buildHTML(products);
    buildCSS();
    setEvents(products);
  };

  // GET ALL PRODUCTS

  const getProductList = async () => {
    let productList = localStorage.getItem("productList");
    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      productList = await response.json();
      localStorage.setItem("productList", JSON.stringify(productList));
      return productList;
    } catch (error) {
      console.error("API request failed:", error);
      alert("Products could not be loaded.Please try again.");
      return [];
    }
  };

  // make HTML part
  const buildHTML = (products) => {
    const bannerSection = document.createElement("section");
    bannerSection.id = "Section1A";

    const bannerContainer = document.createElement("div");
    bannerContainer.id = "banner-container";

    const bannerTitle = document.createElement("h2");
    bannerTitle.textContent = "Beğenebileceğinizi düşündüklerimiz";
    bannerTitle.classList.add("banner-title");
    bannerContainer.appendChild(bannerTitle);

    const carouselContainer = document.createElement("div");
    carouselContainer.id = "product-carousel";
    carouselContainer.classList.add("carousel-container");

    const carouselScrollable = document.createElement("div");
    carouselScrollable.classList.add("carousel-scrollable");
    carouselContainer.appendChild(carouselScrollable);

    const prevButton = document.createElement("button");
    prevButton.classList.add("carousel-button", "prev");
    prevButton.innerHTML = "&#8592;";
    carouselContainer.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.classList.add("carousel-button", "next");
    nextButton.innerHTML = "&#8594;";
    carouselContainer.appendChild(nextButton);

    const productListContainer = document.createElement("div");
    productListContainer.classList.add("product-list");

    products.forEach((product) => {
      const productCard = createProductCard(product);
      carouselScrollable.appendChild(productCard);
    });
    bannerContainer.appendChild(carouselContainer);
    bannerSection.appendChild(bannerContainer);

    const heroBanner = document.querySelector("eb-hero-banner-carousel");
    if (heroBanner) {
      heroBanner.insertAdjacentElement("afterend", bannerSection);
    }
    return [bannerSection];
  };

  const createProductCard = (product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.dataset.productId = product.id;

    let discountPercent = 0;
    const isDiscounted =
      product.original_price && product.price < product.original_price;

    if (isDiscounted) {
      discountPercent = Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      );
    }

    productCard.innerHTML = `
    <img src="${product.img}" class="product-image">
    <div class="product-details">
      <div class="product-item-content">
        <h2 class="product-title"><span class="product-brand">${
          product.brand
        }</span> - ${product.name}</h2>

        <div class="product-rating">
          <span class="star">★</span>
          <span class="star">★</span>
          <span class="star">★</span>
          <span class="star">★</span>
          <span class="star">★</span>
        </div>
      </div>

      <div class="product-basket-part">
        <div class="product-original-price-promotion">
          ${
            isDiscounted
              ? `<div class="product-item-price">
              <span class="product-original-price">${product.original_price} TL</span>
                 <span class="discount-percent">%${discountPercent}</span>
              </div>
              `
              : ``
          }
          <span class="price ${isDiscounted ? "discounted-price" : ""}">${
      product.price
    } TL</span>
        </div>

        <button class="add-to-cart-button">+</button>
        <button class="add-to-wishlist-button">
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
              4.5 2.09C13.09 3.81 14.76 3 16.5 3 
              19.58 3 22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      ${
        isDiscounted
          ? `<div class="discount-badge">
              <span class="discount-percent">%${discountPercent}</span>
            </div>`
          : ""
      }
    </div>
  `;

    return productCard;
  };

  //  CSS styles
  const buildCSS = () => {
    const style = document.createElement("style");
    style.textContent = `
            #Section1A{
            background-color: #fff;
                max-width: 1296px;  
                padding-top:20px;
                
                
            
            }


            #banner-container {
              background-color: #fff;
               max-width: 1296px;  
                
                padding-bottom:50px;
                padding-left: 15px;
                padding-right:15px;
                
            }
            .banner-title {
                font-size:24px;
                font-family: Quicksand-SemiBold;
                color: rgb(43, 47, 51);
                line-height:29.3px;
                display: flex;
                align-items:start;
                justify-content: space-between;
                font-weight:500px;
            }
            .carousel-container {
                scroll-behavior: smooth;
                display: flex;
                overflow-x: auto;
                scrollbar-width: none;
                
                position: relative;
                width: 100%;
                overflow: visible;
                padding-top:20px;
                padding-bottom:20px;
                
            }
            .carousel-scrollable {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 10px; 
                transition: scroll-left 0.5s ease-in-out;
            }
            .carousel-scrollable::-webkit-scrollbar {
               display: none;
            }
            .carousel-scrollable {
             -ms-overflow-style: none;
             scrollbar-width: none;
            }

            .carousel-button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: white;
                color:black;
                border: none;
                padding: 10px;
                cursor: pointer;
                font-size: 15px;
                font-weight :700;
                z-index: 10;
                border-radius: 50px;
                width: 40px; 
                height: 40px; 
                display: flex;
                justify-content: center; 
                align-items: center;
                transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                box-shadow: 0 0 0 0 #00000030, inset 0 0 0 1px #00000030
            }
            .carousel-button:hover {
                box-shadow: 0 0 0 0 #00000030, inset 0 0 0 1px #00000030;
                background-color: white;
            }
            .carousel-button.prev {
                left: -60px;
            }
            .carousel-button.next {
                right:-60px;
            }
            .product-list {
                display: flex;
                gap: 15px;
            }
            .product-card {
                font-family: 'Poppins', sans-serif;
                width: 240px;
                height:385px;
                background-color: #fff;
                color: #7d7d7d;
                border-radius: 8px;
                padding: 10px;
                text-align: center;
                margin-right:16px;
                border: 1px solid #ededed;
                position: relative;
                cursor:pointer; 
                display: flex; 
                flex-direction: column; 
                transition: border-color 0.3s ease-in-out;
                overflow: hidden;
                flex: 0 0 auto;
                scroll-snap-align: start;
            }
            .product-card:hover {
                box-shadow: 0 0 0 0 #00000030, inset 0 0 0 1px #00000030;
            }
            .product-image {
                width: 100%;
                height: 203px;
                object-fit: cover;
                margin-bottom :9.6px;
            }
            .product-item-content{
                margin-left:10px;
                margin-right:10px;
                margin-bottom:13px;
                padding-left:10px;
                padding-right:10px;
                padding-bottom:13px;
            
            }
            .product-details {
                padding: 10px;
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                justify-content: space-between; 
                height: 100%; 
            }
            .product-title {
               font-family: Quicksand-Medium;
               font-weight: 500;
               color: rgb(43, 47, 51);
               font-size: 12px;
               text-align: left;
               display: -webkit-box;
               -webkit-line-clamp: 2;   
               -webkit-box-orient: vertical;
               overflow: hidden;
               text-overflow: ellipsis;
               line-height: 1.2;   
               max-height: calc(1.2em * 2);  
               margin-bottom:10px;
}

            .product-brand {
                font-weight: bold; 
            }
            .product-rating {
                color: rgb(255, 138, 0);       
                text-align: left;
                font-size:12px;
                font-weight:900;
                font-family: "Font Awesome 5 Free";
                
                
            }
            .product-basket-part{
              display:flex;
              padding-top:6px;
              padding-bottom:15px;
              padding-left:10px;
              padding-right:10px;
              justify-content:space-between;

            
            }
            .product-original-price-promotion {
                font-family: 'Poppins', sans-serif;
                display: flex;
                justify-content: flex-start;
                flex-direction: column;
                align-items: flex-start;
                
            }
            .product-item-price{
              flex-direction:row;
            
            }
            .product-original-price {
                font-size: 12px; 
                color: #a1a1a1; 
                font-weight:400;
                margin-right: 5px;
                text-decoration:none;
                display: inline-block; 
                vertical-align: middle;
        
            }
           
          
            .discount-badge {
                font-family: 'Poppins', sans-serif;
                color: white;
                display: flex;
               align-items: center;
               gap: 6px;
               flex-direction:column;
                background-color: #00a365; 
              
                
                font-size: 14px;
               
                
                
            }
            .discount-badge span {
                vertical-align: middle; 
            }
            .price {
                font-size: 20px;
                margin-right:8px; 
                margin-right: 10px;
                text-align: left;
                color:black;
                font-weight:bold;

            }
            .discount-percent {
                color: white;
                font-family: 'Poppins', sans-serif;
                padding-right:4px;
                border-radius:9999px;
                height:19.2px;
                width:30px;
                font-weight: bold;
                
                font-size:11px;
                display: inline-flex;
                justify-content: center;
                align-item:center;
               
                
                background-color: #00a365;
            }
           
            .add-to-cart-button {
                background-color:white; 
                color: rgb(0, 123, 255);
                font-family:'Poppins', sans-serif;
                font-weight: 400;
                border: none;
                height:48px;
                width:48px;
                border-radius:100%;
                font-size:25px;
                align-items:center;
                justify-content:center;
                text-align:center;
               
                cursor: pointer;
                border-radius: 20px; 
                
                
                transition: background-color 0.3s ease;
            }
            .discounted-price{
              color:#00a365;
            }
            .add-to-cart-button:hover {
                background-color:rgb(0, 123, 255); 
                color: white;
            }
            .add-to-wishlist-button {
                background-color: transparent; 
                border: none;
                
                cursor: pointer;
                position: absolute; 
                top: 10px; 
                right: 10px; 
               
                width: 30px; 
                height: 30px; 
                display: flex;
                justify-content: center; 
                align-items: center;
                box-shadow:none
        
                transition: opacity .3s ease-in-out;
            }
            
            .add-to-wishlist-button svg {
                width: 30px;
                height: 30px;
                fill: none; 
                stroke:#90d8bf4a ;
                stroke-width: 2;
            }
                .add-to-wishlist-button:hover {
                 stroke:  #f28e00;
                 stroke-width: 4;
                  filter: drop-shadow(0 0 2px #f28e00);
            }
            .add-to-wishlist-button.filled svg {
                fill: #ff8708; 
            }
            /* (Mobile - max 768px) */
            @media (max-width: 768px) {
                #banner-container {
                    padding: 15px;
                    max-width: 90%;
                    margin: 10px auto;
                }
                .banner-title {
                    font-size: 1.5rem;
                    padding: 15px 20px;
                    text-align: center;
                    display: flex; 
                    align-items: center;
                    justify-content: center; 
                }
                .carousel-container {
                    flex-direction: column;
                    padding: 5px 0;
                }
                .carousel-button {
                    width: 30px;
                    height: 30px;
                    font-size: 20px;
                    background-color: rgba(255, 247, 236, 0.8); 
                }
                .carousel-scrollable::-webkit-scrollbar {
                    display: none; 
                }
                .carousel-scrollable {
                    display: flex;
                    flex-wrap: nowrap; 
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                }
                .product-list {
                    flex-direction: row;
                    overflow-x: scroll; 
                    scroll-snap-type: x mandatory;
                    gap: 10px;
                    scroll-behavior: smooth;
                }
                .product-card {
                    width: 150px;
                    margin-right: 5px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .product-image {
                    height: auto;
                    max-height: 200px; 
                    object-fit: cover;
                }
                .product-title {
                    font-size: clamp(10px, 2vw, 14px);
                }
               FF
                .price {
                    font-size: 16px;
                }
                .discount-percent {
                    font-size: 14px;
                    margin-left: -10px;
                }
                .arrow-down {
                    margin-left: 0; 
                }
                .discount-badge {
                    margin-left: -10px; 
                }
                .add-to-cart-button {
                    font-size: 12px;
                    padding: 8px;
                }
                .add-to-wishlist-button {
                    width: 30px;
                    height: 30px;
                }
                .add-to-wishlist-button{
                    width: 25px;
                    height: 25px;
                }
 
            }
            /* (Mobile - max 480px) */
            @media (max-width: 480px) {
                .banner-title {
                    font-size: 1.2rem;
                    padding: 10px;
                }
                .carousel-container {
                    padding: 5px;
                    margin-left: -10px;
                    margin-right: -10px;
                }
                .carousel-button {
                    width: 20px;
                    height: 20px;
                    font-size: 15px;
                    background-color: rgba(255, 247, 236, 0.8); 
                }
                .product-card {
                    width: 120px; 
                }
                .product-image {
                    height: auto;
                    max-height: 100px;
                }
                .product-title {
                    font-size: clamp(10px, 2vw, 14px);
                }
                .price {
                    font-size: 16px;
                }
                .discount-percent {
                    font-size: 14px; 
                }
                .add-to-cart-button {
                    font-size: 12px;
                    padding: 8px;
                }
                .add-to-wishlist-button {
                    top: 5px;
                    right: 5px;
                    width: 25px;
                    height: 25px;
                }
                .add-to-wishlist-button svg {
                    width: 20px;
                    height: 20px;
                }
            }
        `;
    document.head.appendChild(style);
  };

  const setEvents = (products) => {
    document.querySelectorAll(".product-card").forEach((card) => {
      const productId = parseInt(card.dataset.productId);
      const heartIcon = card.querySelector(".add-to-wishlist-button ");
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (favorites.includes(productId)) {
        heartIcon.classList.add("filled");
      }

      heartIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(productId, heartIcon);
      });

      card.addEventListener("click", () => {
        const product = products.find((p) => p.id === productId);
        if (product && product.url) {
          window.open(product.url, "_blank"); // Başka sekmede aç
        }
      });
    });

    const carouselScrollable = document.querySelector(".carousel-scrollable");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");
    const productCardWidth = 220;

    console.log("carouselScrollable:", carouselScrollable);
    console.log("prevButton:", prevButton);
    console.log("nextButton:", nextButton);

    if (prevButton && nextButton && carouselScrollable) {
      prevButton.addEventListener("click", () => {
        carouselScrollable.scrollBy({
          left: -productCardWidth,
          behavior: "smooth",
        });
      });

      nextButton.addEventListener("click", () => {
        carouselScrollable.scrollBy({
          left: productCardWidth,
          behavior: "smooth",
        });
      });
    } else {
      console.error("No carousel buttons or carousel Scrollable found!");
    }
  };

  const toggleFavorite = (productId, heartIcon) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(productId)) {
      favorites = favorites.filter((id) => id !== productId);
      heartIcon.classList.remove("filled");
    } else {
      favorites.push(productId);
      heartIcon.classList.add("filled");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  init();
})();
