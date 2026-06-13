// Reduced motion check
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Mobile Menu Toggle
      const mobileMenuButton = document.getElementById('mobileMenuButton');
      mobileMenuButton.addEventListener('click', () => {
        // Basic implementation for structural completeness
        const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
      });

      // Scroll Reveal Animation Observer
      if (!reduceMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
          revealObserver.observe(el);
        });
      } else {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
          el.classList.add('revealed');
        });
      }

      // Animated Counters
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const endValue = parseInt(target.getAttribute('data-target'));
            let startValue = 0;
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime < duration) {
                // Easing function (easeOutExpo)
                const progress = elapsedTime / duration;
                const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                target.innerText = Math.floor(easedProgress * endValue);
                requestAnimationFrame(updateCounter);
              } else {
                target.innerText = endValue;
              }
            };
            requestAnimationFrame(updateCounter);
            observer.unobserve(target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
      });

      // Interactive Accordion
      const accordionTriggers = document.querySelectorAll('.accordion-trigger');
      accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          const content = trigger.nextElementSibling;
          const icon = trigger.querySelector('.trigger-icon');
          const isOpen = content.classList.contains('open');

          // Close all others
          document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
          document.querySelectorAll('.trigger-icon').forEach(i => {
            i.setAttribute('icon', 'solar:add-circle-linear');
            i.style.transform = 'rotate(0deg)';
          });

          // Toggle current
          if (!isOpen) {
            content.classList.add('open');
            icon.setAttribute('icon', 'solar:minus-circle-linear');
            icon.style.transform = 'rotate(180deg)';
          }
        });
      });

      // Testimonial Carousel
      const testimonialTrack = document.getElementById('testimonialTrack');
      const testimonialPrev = document.getElementById('testimonialPrev');
      const testimonialNext = document.getElementById('testimonialNext');

      if (testimonialPrev && testimonialNext) {
        testimonialPrev.addEventListener('click', () => {
          testimonialTrack.scrollBy({ left: -window.innerWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
        });

        testimonialNext.addEventListener('click', () => {
          testimonialTrack.scrollBy({ left: window.innerWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      }

      // Header Blur on Scroll
      const header = document.getElementById('header');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('shadow-sm');
        } else {
          header.classList.remove('shadow-sm');
        }
      });

      // Video & Cookie logic strictly maintained
      const cookieBanner = document.getElementById('cookieBanner');
      const cookieClose = document.getElementById('cookieClose');
      const acceptCookies = document.getElementById('acceptCookies');
      const rejectCookies = document.getElementById('rejectCookies');

      function hideCookieBanner() {
        cookieBanner.style.opacity = '0';
        cookieBanner.style.transform = 'translateY(1rem)';
        setTimeout(() => cookieBanner.classList.add('hidden'), 500);
      }

      if(cookieClose) cookieClose.addEventListener('click', hideCookieBanner);
      if(acceptCookies) acceptCookies.addEventListener('click', hideCookieBanner);
      if(rejectCookies) rejectCookies.addEventListener('click', hideCookieBanner);

      const heroVideo = document.getElementById('heroVideo');
      const videoToggle = document.getElementById('videoToggle');
      const videoToggleIcon = document.getElementById('videoToggleIcon');

      if (heroVideo && videoToggle && videoToggleIcon) {
        if (reduceMotion) {
          heroVideo.pause();
          videoToggleIcon.setAttribute('icon', 'solar:play-linear');
          videoToggle.setAttribute('aria-label', 'Play video');
        }

        videoToggle.addEventListener('click', () => {
          if (heroVideo.paused) {
            heroVideo.play();
            videoToggleIcon.setAttribute('icon', 'solar:pause-linear');
            videoToggleIcon.style.transform = 'scale(1)';
            videoToggle.setAttribute('aria-label', 'Pause video');
          } else {
            heroVideo.pause();
            videoToggleIcon.setAttribute('icon', 'solar:play-linear');
            videoToggle.setAttribute('aria-label', 'Play video');
          }
        });
      }

      // --- WebGL Background Animation (Hero) ---
      (function initHeroWebGL() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas || typeof THREE === 'undefined' || reduceMotion) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2() }
          },
          vertexShader: `
            void main() {
              gl_Position = vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float u_time;
            uniform vec2 u_resolution;

            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v){
              const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
              vec2 i  = floor(v + dot(v, C.yy) );
              vec2 x0 = v -   i + dot(i, C.xx);
              vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
              i = mod(i, 289.0);
              vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
              m = m*m ; m = m*m ;
              vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5;
              vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
              m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
              vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y;
              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
              return 130.0 * dot(m, g);
            }

            void main() {
              vec2 uv = gl_FragCoord.xy / u_resolution.xy;

              float n = snoise(uv * 2.5 + vec2(u_time * 0.4, u_time * 0.5));
              float n2 = snoise(uv * 1.5 - vec2(u_time * 0.3, u_time * 0.2));

              vec3 colorIndigo = vec3(0.31, 0.27, 0.90);
              vec3 colorCyan = vec3(0.02, 0.71, 0.83);
              vec3 colorDeep = vec3(0.15, 0.1, 0.5);

              float mixVal = smoothstep(-0.6, 0.8, n);
              vec3 finalColor = mix(colorDeep, colorIndigo, mixVal);

              float mixVal2 = smoothstep(-0.4, 0.9, n2);
              finalColor = mix(finalColor, colorCyan, mixVal2 * 0.8);

              float alphaFade = smoothstep(-0.2, 0.6, uv.x);
              gl_FragColor = vec4(finalColor, alphaFade);
            }
          `
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        function resizeCanvas() {
          const section = canvas.closest('section');
          const w = section ? section.clientWidth : window.innerWidth;
          const h = section ? section.clientHeight : window.innerHeight;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.setSize(w, h, false);
          material.uniforms.u_resolution.value.set(w, h);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function animateWebGL(time) {
          material.uniforms.u_time.value = time * 0.002;
          renderer.render(scene, camera);
          requestAnimationFrame(animateWebGL);
        }

        requestAnimationFrame(animateWebGL);
      })();