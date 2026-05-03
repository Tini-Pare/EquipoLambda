document.addEventListener('DOMContentLoaded', function() {
    (function () {
        /* ── 1. Datos Completos ── */
        var slides = [
            { title: "Inicio del Proyecto",    desc: "Los primeros pasos del equipo Lambda hacia el desarrollo de tecnología satelital educativa.",    img: "photos/img1.png", color: "rgba(80,80,255,0.65)"   },
            { title: "Primeros pasos",     desc: "Investigación, diseño y las primeras decisiones que dieron forma al proyecto.",           img: "photos/img2.png", color: "rgba(110,50,230,0.65)"  },
            { title: "Desarrollo técnico", desc: "Integrando hardware y software para convertir teoría en un sistema real.",               img: "photos/img3.jpg", color: "rgba(50,130,255,0.65)"  },
            { title: "Validación",   desc: "Ensayos, errores y mejoras constantes para acercarnos a un diseño funcional.",                         img: "photos/img4.jpg", color: "rgba(30,180,200,0.65)"  },
            { title: "Programa de Radio",      desc: "Tuvimos la oportunidad de presentar nuestro trabajo en una radio, acercando la tecnología a la comunidad.",                 img: "photos/img6-radio.jpg", color: "rgba(60,210,140,0.65)"  },
            { title: "Clase en SIG",   desc: "Brindamos una clase para la cátedra de Sistemas de Información Geográfica, compartiendo nuestra experiencia.",                  img: "photos/img7-sig.jpg", color: "rgba(210,140,40,0.65)"  },
            { title: "Mirando al futuro",   desc: "El proyecto continúa creciendo, con nuevas ideas y desafíos por delante.",                            img: "photos/img7-avances.jpg", color: "rgba(230,70,100,0.65)"  },
            { title: "Esperando el lanzamiento",          desc: "Cada avance nos acerca más al momento más esperado: el lanzamiento.",           img: "photos/img8.webp", color: "rgba(160,70,255,0.65)"  }
        ];

        /* ── 2. Referencias al DOM ── */
        var section  = document.getElementById('galeria-circular');
        var slotPrev = document.getElementById('g-slot-prev');
        var slotCurr = document.getElementById('g-slot-curr');
        var slotNext = document.getElementById('g-slot-next');
        var gTitle   = document.getElementById('g-title');
        var gDesc    = document.getElementById('g-desc');
        var gBar     = document.getElementById('g-bar');
        var gCurrent = document.getElementById('g-current');
        var gBloom   = document.getElementById('g-bloom');
        var dotsWrap = document.getElementById('g-dots');

        /* ── 3. Inicialización de Dots ── */
        section.style.height = (window.innerHeight * (slides.length + 1)) + 'px';
        dotsWrap.innerHTML = ''; // Limpiar por si acaso
        slides.forEach(function (_, i) {
            var dot = document.createElement('div');
            dot.className = 'g-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', function () {
                var scrollable = section.offsetHeight - window.innerHeight;
                window.scrollTo({ top: section.offsetTop + (i / (slides.length - 1)) * scrollable, behavior: 'smooth' });
            });
            dotsWrap.appendChild(dot);
        });

        /* ── 4. Lógica de Transformación y Textos ── */
        var lastIndex = -1;

        function applyTransforms(t) {
            // Easing suave (Cubic) para que la imagen central no se mueva bruscamente
            var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            var radio = 450;   // Distancia al centro del círculo
            var anguloMax = 50; // Grados de rotación lateral

            // Slot PREV (Se va hacia atrás a la izquierda)
            var pRot = -anguloMax - (e * anguloMax);
            slotPrev.style.transform = 'rotateY(' + pRot + 'deg) translateZ(' + (-radio) + 'px)';
            slotPrev.style.opacity = Math.max(0, 0.4 - e * 0.4);
            slotPrev.style.filter = 'blur(4px) brightness(0.4)';
            slotPrev.style.zIndex = 1;

            // Slot CURR (La principal que gira hacia la izquierda)
            var cRot = -(e * anguloMax);
            var cZ = -(e * radio); 
            slotCurr.style.transform = 'rotateY(' + cRot + 'deg) translateZ(' + cZ + 'px)';
            slotCurr.style.opacity = 1 - (e * 0.6);
            var cBlur = e * 4;
            var cBright = 1 - (e * 0.6);
            slotCurr.style.filter = 'blur(' + cBlur + 'px) brightness(' + cBright + ')';

            // Slot NEXT (Viene desde atrás a la derecha hacia el frente)
            var nRot = anguloMax - (e * anguloMax);
            var nZ = -radio + (e * radio);
            slotNext.style.transform = 'rotateY(' + nRot + 'deg) translateZ(' + nZ + 'px)';
            slotNext.style.opacity = 0.4 + (e * 0.6);
            var nBlur = (1 - e) * 4;
            var nBright = 0.4 + (e * 0.6);
            slotNext.style.filter = 'blur(' + nBlur + 'px) brightness(' + nBright + ')';

            if (e > 0.5) {
                slotNext.style.zIndex = 3;
                slotCurr.style.zIndex = 2;
            } else {
                slotNext.style.zIndex = 2;
                slotCurr.style.zIndex = 3;
            }
        }

        function updateContent(index) {
            if (index === lastIndex) return;
            lastIndex = index;
            var slide = slides[index];

            dotsWrap.querySelectorAll('.g-dot').forEach(function (d, i) {
                d.classList.toggle('active', i === index);
            });
            gCurrent.textContent = String(index + 1).padStart(2, '0');
            gTitle.textContent = slide.title;
            gDesc.textContent  = slide.desc;
            gBloom.style.background = 'radial-gradient(ellipse, ' + slide.color + ' 0%, transparent 70%)';
        }

        /* ── 5. Lógica de Scroll y Renderizado ── */
        function render() {
            var rect = section.getBoundingClientRect();
            var scrollable = section.offsetHeight - window.innerHeight;
            var scrolled = -rect.top;

            var progress = Math.min(1, Math.max(0, scrolled / scrollable));
            
            // Añadimos un pequeño margen (buffer) al final para asegurar que se llegue 
            // a la última imagen antes de que se acabe el scroll de la sección.
            var buffer = 0.06; 
            var adjustedProgress = Math.min(1, progress / (1 - buffer));

            var slideFloat = adjustedProgress * (slides.length - 1);
            var index = Math.floor(slideFloat);
            var t = slideFloat - index;

            gBar.style.width = (progress * 100) + '%';

            var prevIdx = (index - 1 + slides.length) % slides.length;
            var nextIdx = (index + 1) % slides.length;
            
            // Solo actualizamos el src si ha cambiado para evitar recargas innecesarias
            var prevImg = '<img src="' + slides[prevIdx].img + '">';
            var currImg = '<img src="' + slides[index].img   + '">';
            var nextImg = '<img src="' + slides[nextIdx].img + '">';

            if (slotPrev.innerHTML !== prevImg) slotPrev.innerHTML = prevImg;
            if (slotCurr.innerHTML !== currImg) slotCurr.innerHTML = currImg;
            if (slotNext.innerHTML !== nextImg) slotNext.innerHTML = nextImg;

            applyTransforms(t);
            updateContent(Math.round(slideFloat));
        }

        window.addEventListener('scroll', render, { passive: true });
        
        // Ejecución inicial para cargar imágenes y estado
        render();
    })();
});