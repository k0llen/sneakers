const swiper = new Swiper('.product-card-swiper', {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    thumbs: {
        swiper: {
            el: '.product-card-swiper-thumbs',
            slidesPerView: 4,
            spaceBetween: 32,
        }
    },

    navigation: {
        nextEl: '.product-swiper-button-next',
        prevEl: '.product-swiper-button-prev',
    },
});

// counter

if (document.querySelector('.counter')) {
    const minus = document.querySelector('.counter-minus');
    const plus = document.querySelector('.counter-plus');
    const input = document.querySelector('.counter-count');
    let inputValue = parseInt(input.innerText);

    plus.addEventListener('click', (e) => {
        if (inputValue < 9) {
            inputValue++;
            input.innerText = inputValue;

        }
    });

    minus.addEventListener('click', (e) => {
        if (inputValue > 1) {
            --inputValue;
            input.innerText = inputValue;


        }
    });
}

//Cart modal opening
if (document.querySelector('.cart-modal')) {
    const cartOpen = document.querySelector('.cart-btn');
    const cartModal = document.querySelector('.cart-modal');

    cartOpen.addEventListener('click', (e) =>{
        cartModal.classList.toggle('active');
    })

    window.addEventListener('click', (e) => {
        if (!cartModal.contains(e.target) && !e.target.closest('.cart-item') && !cartOpen.contains(e.target) ) {
            cartModal.classList.remove('active');
        }
    })
}

//Cart functional
document.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card-about');
    
    if (event.target.hasAttribute('data-cart') || event.target.closest('[data-cart]')) {
        const cartModalList = document.querySelector('.cart-list');

        // Product`s DB
        const productInfo = {
            cardId: card.dataset.id,
            imgSrc: document.querySelector('.product-img').getAttribute('src'),
            title: card.querySelector('.product-name').innerText,
            currentPrice: card.querySelector('.current').innerText,
            count: parseInt(card.querySelector('.counter-count').innerText),
        };


        // Current price
        const currentPriceNumFunc = () => {
            let match = productInfo.currentPrice.match(/(?:[0-9]+)\.(?:[0-9]{2})/g);
            if (match)
                for (var i = 0; i < match.length; i++) {
                    match[i] = parseFloat(match[i]);
                }
            return match
        };


        // Total price calculation
        let totalPrice = +currentPriceNumFunc() * productInfo.count;

        const itemInCart = cartModalList.querySelector(`[data-id="${productInfo.cardId}"]`);

        if (itemInCart) {
            const countElement = itemInCart.querySelector('[data-count]');
            if (parseInt(countElement.innerHTML) + parseInt(productInfo.count) >= 9) {
                itemInCart.querySelector('[data-sum]').innerHTML = `$${+currentPriceNumFunc() * 9}`;
                countElement.innerHTML = 9;
            } else {
                countElement.innerHTML = parseInt(countElement.innerHTML) + parseInt(productInfo.count);
                itemInCart.querySelector('[data-sum]').innerHTML = `$${+currentPriceNumFunc() * parseInt(countElement.innerHTML)}`;
            }
        } else {
            //Adding positions to cart
            const cartItemHtml = 
                `<div class="cart-item" data-id="${productInfo.cardId}">
                    <div class="cart-item-content">
                    <div class="pic-block">
                    <img src="${productInfo.imgSrc}" alt="">
                </div>
                <div class="about">
                    <div class="name" data-name>
                    ${productInfo.title}
                    </div>
                    <div class="prices">
                        <div class="current" data-current>${productInfo.currentPrice}</div>
                        <div class="x">x</div>
                        <div class="count" data-count>${productInfo.count}</div>
                        <div class="sum" data-sum>$${totalPrice}</div>
                    </div>
                </div></div>
                    <div class="remove" data-remove>
                        <svg  width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs ><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                    </div>
                
                </div>`;

            cartModalList.insertAdjacentHTML('beforeend', cartItemHtml);
            //Removing cart--empty class from cart items list
            cartModalList.classList.remove('cart--empty');
        }
        
        //Removing cart--empty class from cart items list
        cartModalList.classList.remove('cart--empty');


        //Count of items in cart
        const cartCurrent = document.querySelector('.cart-current');
        const cartCurrentCounter = () => {
            let result = 0;
            for (let i = 0; i < document.querySelectorAll('.cart-item').length; i++) {
                result += +document.querySelectorAll('.cart-item')[i].querySelector('[data-count]').innerHTML;
            }
            return result;
        }
        cartCurrent.innerHTML = cartCurrentCounter();
        cartCurrent.style.display = 'block';


    } else if (event.target.hasAttribute('data-remove') || event.target.closest('.remove')) {
        event.target.closest('.cart-item').remove();
        const cartCurrent = document.querySelector('.cart-current');
        const cartCurrentCounter = () => {
            let result = 0;
            for (let i = 0; i < document.querySelectorAll('.cart-item').length; i++) {
                result += +document.querySelectorAll('.cart-item')[i].querySelector('[data-count]').innerHTML;
            }
            return result;
        }
        cartCurrent.innerHTML = cartCurrentCounter();
        if (document.querySelectorAll('.cart-item').length < 1) {
            document.querySelector('.cart-list').classList.add('cart--empty')
            cartCurrent.style.display = 'none';
        }
    }

})

//Swiper modal

if (window.innerWidth > 990) {
    if (document.querySelector('#swiper-modal')) {
        const modalSwiper = new Swiper('.modal-swiper', {
            slidesPerView: 1,
            spaceBetween: 32,
            loop: true,
            thumbs: {
                swiper: {
                    el: '.modal-swiper-thumbs',
                    slidesPerView: 4,
                    spaceBetween: 32,
                }
            },
        
            // Navigation arrows
            navigation: {
                nextEl: '.modal-swiper-button-next',
                prevEl: '.modal-swiper-button-prev',
            },
        });
    
    
        const trigger = document.querySelectorAll('.product-card-swiper-slide');
    
        trigger.forEach((slide) => {
            slide.addEventListener('click', (e) => {
                $.fancybox.open([
                    {
                        src: '#swiper-modal',
                        type: 'inline',
                        options: {
                            Carousel: {
                                loop: false,
                            },
                            closeButton: false,
                            class: 'dark-fancybox',
                            touch: true,
                        },
                    },
                ]);
            });
        })
    
    }
}

//Burger

if (document.querySelector('.burger')) {
    const burgerBtn = document.querySelector('.burger');
    const burgerWrapper = document.querySelector('.header .left');
    const body = document.querySelector('.body');

    burgerBtn.addEventListener('click', (e) => {
        burgerWrapper.classList.toggle('active');
        body.classList.toggle('lock');
    })

    window.addEventListener('click', (e) => {
        if (!burgerWrapper.contains(e.target)) {
            burgerWrapper.classList.remove('active');
            body.classList.remove('lock');
        }
    })

}

