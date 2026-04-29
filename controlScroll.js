document.addEventListener('DOMContentLoaded', function() {
    (function () {
        /* ── 1. Datos Completos ── */
        var slides = [
            { title: "Inicio del Proyecto",    desc: "Los primeros pasos del equipo Lambda hacia el desarrollo de tecnología satelital educativa.",    img: "https://picsum.photos/400/580?random=1", color: "rgba(80,80,255,0.65)"   },
            { title: "Diseño del CubeSat",     desc: "Definimos la arquitectura del satélite: estructura, peso y distribución de componentes.",           img: "https://picsum.photos/400/580?random=2", color: "rgba(110,50,230,0.65)"  },
            { title: "Hardware y Electrónica", desc: "Diseño de la PCB que integra los sistemas de control, telemetría y alimentación.",               img: "https://picsum.photos/400/580?random=3", color: "rgba(50,130,255,0.65)"  },
            { title: "Sensores de Medición",   desc: "Integración de sensores de CO₂, temperatura, presión y humedad relativa.",                         img: "https://picsum.photos/400/580?random=4", color: "rgba(30,180,200,0.65)"  },
            { title: "Software Embebido",      desc: "Programación del firmware para adquisición y transmisión de datos en tiempo real.",                 img: "https://picsum.photos/400/580?random=5", color: "rgba(60,210,140,0.65)"  },
            { title: "Testing y Validación",   desc: "Pruebas en laboratorio que simulan las condiciones extremas de la estratósfera.",                  img: "https://picsum.photos/400/580?random=6", color: "rgba(210,140,40,0.65)"  },
            { title: "Presentación Oficial",   desc: "El equipo Lambda presenta el CubeSat ante el jurado del concurso UTN.",                            img: "https://picsum.photos/400/580?random=7", color: "rgba(230,70,100,0.65)"  },
            { title: "Equipo Lambda",          desc: "El equipo detrás del proyecto: estudiantes comprometidos con la exploración espacial.",           img: "https://picsum.photos/400/580?random=8", color: "rgba(160,70,255,0.65)"  }
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
    slotPrev.style.filter = 'blur(4px)';

    // Slot CURR (La principal que gira hacia la izquierda)
    // El translateZ(0) la mantiene al frente cuando e=0
    var cRot = -(e * anguloMax);
    var cZ = -(e * radio); 
    slotCurr.style.transform = 'rotateY(' + cRot + 'deg) translateZ(' + cZ + 'px)';
    slotCurr.style.opacity = 1 - (e * 0.5);
    slotCurr.style.filter = 'none';

    // Slot NEXT (Viene desde atrás a la derecha hacia el frente)
    var nRot = anguloMax - (e * anguloMax);
    var nZ = -radio + (e * radio);
    slotNext.style.transform = 'rotateY(' + nRot + 'deg) translateZ(' + nZ + 'px)';
    slotNext.style.opacity = 0.4 + (e * 0.6);
    slotNext.style.filter = e > 0.8 ? 'none' : 'blur(4px)';
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

        /* ── 5. Listener de Scroll ── */
        window.addEventListener('scroll', function () {
            var rect = section.getBoundingClientRect();
            var scrollable = section.offsetHeight - window.innerHeight;
            var scrolled = -rect.top;

            var progress = Math.min(1, Math.max(0, scrolled / scrollable));
            var slideFloat = progress * (slides.length - 1);
            var index = Math.floor(slideFloat);
            var t = slideFloat - index;

            gBar.style.width = (progress * 100) + '%';

            var prevIdx = (index - 1 + slides.length) % slides.length;
            var nextIdx = (index + 1) % slides.length;
            
            slotPrev.innerHTML = '<img src="' + slides[prevIdx].img + '">';
            slotCurr.innerHTML = '<img src="' + slides[index].img   + '">';
            slotNext.innerHTML = '<img src="' + slides[nextIdx].img + '">';

            applyTransforms(t);
            updateContent(index);
        }, { passive: true });
    })();
});