document.addEventListener('DOMContentLoaded', function() {
    // Room data
    const rooms = [
        {
            name: "GARDEN VIEW SUITE",
            description: "CAMA MATRIMONIAL | BAÑO PRIVADO | WIFI | CALEFACCIÓN | TV | ESTACIONAMIENTO | VISTAS AL JARDÍN | BALCÓN",
            details: "Habitación de un ambiente con cama doble, Tv, baño en suite, una cómoda kitchenette integrada, mesa y sillas en interior, terraza con vistas a la piscina y jardines con mesa y sillas en el exterior.",
            image: "https://i.ibb.co/PZH0QP2G/IMG-2659.jpg", // Updated image URL
            features: {
                size: "25 m²",
                capacity: 2
            },
            price: 100000,
            link: "https://reservation.gofeels.com/es/room-detail/4359?CLP&token=c5e0b3c8-efe9-4cb5-b3bc-33536d76f389"
        },
        {
            name: "SUPERIOR SEA VIEW SUITE",
            description: "CAMA MATRIMONIAL | BAÑO PRIVADO | WIFI | CALEFACCIÓN | TV | ESTACIONAMIENTO | VISTA AL MAR | BALCÓN",
            details: "Apartamento de un ambiente en segundo piso con cama doble, TV, kitchenette aparte, mesa y sillas de interior, en suite, y balcón exterior con mesa y sillas con una completa vista al mar.",
            image: "https://i.ibb.co/vvDXpjLC/IMG-2681.jpg", // Updated image URL
            features: {
                size: "22 m²",
                capacity: 2
            },
            price: 125000,
            link: "https://reservation.gofeels.com/es/room-detail/4360?CLP&token=c5e0b3c8-efe9-4cb5-b3bc-33536d76f389"
        },
        {
            name: "SEA VIEW LOFT",
            description: "CAMA MATRIMONIAL + 2 INDIVIDUAL | BAÑO PRIVADO | WIFI | CALEFACCIÓN | TV | ESTACIONAMIENTO | VISTA AL MAR | BALCÓN",
            details: "Loft abierto con Cama doble + dos camas en espacios separados pero un solo gran ambiente con cocina completa y baño, terrazas y vista al mar.",
            image: "https://i.ibb.co/ZjPpjGQ/IMG-2663.jpg", // Updated image URL
            features: {
                size: "30 m²",
                capacity: 4
            },
            price: 170000,
            link: "https://reservation.gofeels.com/es/room-detail/4361?CLP&token=c5e0b3c8-efe9-4cb5-b3bc-33536d76f389"
        },
        {
            name: "SEA VIEW TWO-BEDROOM APARTMENT",
            description: "1 CAMA MATRIMONIAL + 3 INDIVIDUAL | BAÑO PRIVADO | WIFI | CALEFACCIÓN | TV | COCINA EQUIPADA | VISTA AL MAR | BALCÓN",
            details: "Apartamento de tres ambientes para hasta 5 personas, dos dormitor, living con TV y cocina americana. Balcón con vista al mar, con mesa y sillas de exterior.",
            image: "https://i.ibb.co/sdN47fBq/IMG-2684.jpg", // Updated image URL
            features: {
                size: "45 m²",
                capacity: 5
            },
            price: 170000,
            link: "https://reservation.gofeels.com/es/room-detail/4363?CLP&token=c5e0b3c8-efe9-4cb5-b3bc-33536d76f389"
        },
        {
            name: "SEA VIEW SUITE + LIVING",
            description: "CAMA MATRIMONIAL | BAÑO PRIVADO | WIFI | CALEFACCIÓN | TV | ESTACIONAMIENTO | VISTA AL MAR | TOALLAS",
            details: "Habitación de un ambiente, en segundo piso con cama doble, TV, frigobar, cómoda sala de estar con sofá doble, sitial, mesa y sillas de interior, con vista al mar y baño en la planta baja.",
            image: "https://i.ibb.co/4ZjGFZ2y/IMG-2691.jpg", // Updated image URL
            features: {
                size: "25 m²",
                capacity: 2
            },
            price: 125000,
            link: "https://reservation.gofeels.com/es/room-detail/4367?CLP&token=c5e0b3c8-efe9-4cb5-b3bc-33536d76f389"
        }
    ];

    // Obtener el contenedor del carrusel Swiper
    const carousel = document.getElementById('roomsCarousel');
    if (!carousel) return;
    carousel.innerHTML = '';

    // Crear slides dinámicamente
    rooms.forEach(room => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        let capacityIcons = '';
        for (let i = 0; i < room.features.capacity; i++) {
            capacityIcons += '<i class="fas fa-user"></i> ';
        }
        const formattedPrice = room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        slide.innerHTML = `
            <div class="room-card">
                <div class="room-image" style="background-image: url('${room.image}')"></div>
                <div class="room-details">
                    <div class="room-top-content">
                        <h3 class="room-name">${room.name}</h3>
                        <p class="room-description">${room.description}</p>
                        <p class="room-text">${room.details}</p>
                    </div>
                    <div class="room-bottom-content">
                        <div class="room-info">
                            <div class="room-capacity">${capacityIcons}</div>
                            <div class="room-size">${room.features.size}</div>
                            <div class="room-price">$${formattedPrice} CLP por noche</div>
                        </div>
                        <div class="room-actions">
                            <a href="${room.link}" target="_blank" class="book-now-btn">RESERVAR AHORA</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        carousel.appendChild(slide);
    });

    // Inicializar Swiper
    const swiper = new Swiper('#roomsSwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        },
        grabCursor: true,
        loop: false
    });

    // Conectar las flechas externas al Swiper
    const externalPrevBtn = document.getElementById('externalPrevBtn');
    const externalNextBtn = document.getElementById('externalNextBtn');

    if (externalPrevBtn) {
        externalPrevBtn.addEventListener('click', () => {
            swiper.slidePrev();
        });
    }

    if (externalNextBtn) {
        externalNextBtn.addEventListener('click', () => {
            swiper.slideNext();
        });
    }

    // Actualizar estado de las flechas externas cuando cambia el slide
    const updateExternalArrows = () => {
        if (externalPrevBtn) {
            externalPrevBtn.disabled = swiper.isBeginning;
        }
        if (externalNextBtn) {
            externalNextBtn.disabled = swiper.isEnd;
        }
    };

    // Actualizar estado inicial
    updateExternalArrows();

    // Actualizar estado cuando cambia el slide
    swiper.on('slideChange', updateExternalArrows);
});