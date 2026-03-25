(function ($) {
    "use strict";

    // =========================================================
    // Helpers
    // =========================================================
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait || 100);
        };
    }

    function setHeroHeight() {
        const windowHeight = $(window).height();
        $('#overlay-1').css('height', windowHeight + 'px');
    }

    function centerHeroContent() {
        const $header = $('#header');
        const $middle = $('#header .middle');

        if (!$header.length || !$middle.length) return;

        const headerHeight = $header.outerHeight();
        const middleHeight = $middle.outerHeight();
        const topPadding = Math.max((headerHeight / 2) - (middleHeight / 2) - 20, 30);

        $middle.css('padding-top', topPadding + 'px').show();
    }

    function closeMobileMenu() {
        const $menu = $('.navbar-collapse');
        if ($menu.hasClass('in') || $menu.hasClass('show')) {
            $menu.collapse('hide');
        }
    }

    // =========================================================
    // Initial layout
    // =========================================================
    $(window).on('load', function () {
        setHeroHeight();
        centerHeroContent();
    });

    $(window).on('resize', debounce(function () {
        setHeroHeight();
        centerHeroContent();
    }, 100));

    // =========================================================
    // Smooth scroll
    // =========================================================
    $(document).on('click', 'a[href*="#"]:not([href="#"])', function (e) {
        const href = $(this).attr('href');

        // Ignore modal detail buttons with href="#"
        if (!href || href === '#') return;

        const pathnameMatch = location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '');
        const hostnameMatch = location.hostname === this.hostname;

        if (pathnameMatch && hostnameMatch) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                e.preventDefault();

                const offset = $('#site-header').outerHeight() || 64;
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - offset + 1
                }, 800, function () {
                    document.activeElement.blur();
                });

                closeMobileMenu();
            }
        }
    });

    // =========================================================
    // Bootstrap scrollspy
    // =========================================================
    $(function () {
        if ($('body').data('spy') === 'scroll') {
            $('body').scrollspy({
                target: '.site-nav',
                offset: 90
            });

            $(window).on('activate.bs.scrollspy', function () {
                const $active = $('.site-nav li.active').last();
                $('.site-nav li').removeClass('active');
                $active.addClass('active');
            });
        }
    });

    // =========================================================
    // Header shadow on scroll
    // =========================================================
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 50) {
            $('#site-header').addClass('header-scrolled');
        } else {
            $('#site-header').removeClass('header-scrolled');
        }
    });

    // =========================================================
    // Mobile menu behavior
    // =========================================================
    $(document).ready(function () {
        const $menu = $('.navbar-collapse');
        const $toggleBtn = $('.navbar-toggle');

        $('.navbar-nav a').not('#theme-toggle').on('click', function () {
            closeMobileMenu();
        });

        $(document).on('click', function (e) {
            const isMenuOpen = $menu.hasClass('in') || $menu.hasClass('show');
            const clickedInsideMenu = $menu.is(e.target) || $menu.has(e.target).length > 0;
            const clickedToggle = $toggleBtn.is(e.target) || $toggleBtn.has(e.target).length > 0;

            if (isMenuOpen && !clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });
    });

    // =========================================================
    // WOW.js
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    });

    // =========================================================
    // Theme toggle
    // =========================================================

    document.addEventListener('DOMContentLoaded', function () {
        const STORAGE_KEY = 'theme';
        const desktopToggle = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('theme-toggle-mobile');

        function updateToggle(toggleElement, isDark) {
            if (!toggleElement) return;

            const icon = toggleElement.querySelector('i');
            const label = toggleElement.querySelector('span');

            if (icon) {
                icon.className = isDark ? 'fa fa-sun-o' : 'fa fa-moon-o';
            }

            if (label) {
                label.textContent = isDark ? 'Light' : 'Dark';
            }
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';
            document.body.classList.toggle('theme-dark', isDark);

            updateToggle(desktopToggle, isDark);
            updateToggle(mobileToggle, isDark);
        }

        const savedTheme = localStorage.getItem(STORAGE_KEY);
        applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

        function bindToggle(toggleElement) {
            if (!toggleElement) return;

            toggleElement.addEventListener('click', function (e) {
                e.preventDefault();
                const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
                localStorage.setItem(STORAGE_KEY, nextTheme);
                applyTheme(nextTheme);
                this.blur();
            });
        }

        bindToggle(desktopToggle);
        bindToggle(mobileToggle);
    });

    // =========================================================
    // EmailJS init
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init({
                    publicKey: 'YNzqEOiMi21KV9OFW'
                });
                console.log('✓ EmailJS initialized');
            } else {
                console.warn('EmailJS not loaded');
            }
        } catch (error) {
            console.error('EmailJS initialization error:', error);
        }
    });

    // =========================================================
    // Project modals
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        const detailButtons = document.querySelectorAll('.project-details');
        const demoButtons = document.querySelectorAll('.project-demo');
        const modals = document.querySelectorAll('.project-modal');
        const closeButtons = document.querySelectorAll('.close-modal');
        const hireButton = document.querySelector('.btn-hire');

        function openModal(modal) {
            if (!modal) return;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function closeAllModals() {
            modals.forEach(function (modal) {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }

        if (hireButton) {
            hireButton.addEventListener('click', function () {
                this.blur();
            });
        }

        detailButtons.forEach(function (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const projectId = this.getAttribute('data-project');
                const modal = document.getElementById('project-modal-' + projectId);
                openModal(modal);
            });
        });

        demoButtons.forEach(function (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const projectId = this.getAttribute('data-project');
                const modal = document.getElementById('project-demo-' + projectId);
                openModal(modal);
            });
        });

        closeButtons.forEach(function (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal(this.closest('.project-modal'));
            });
        });

        modals.forEach(function (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    });

    // =========================================================
    // Contact form
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        if (!contactForm || !formStatus) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            if (!name || !email || !message) {
                formStatus.innerHTML = '<p class="form-error">Please fill in all fields.</p>';
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }

            formStatus.innerHTML = '<p class="form-sending">Sending message...</p>';
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            if (typeof emailjs === 'undefined') {
                formStatus.innerHTML = '<p class="form-error">Email service is not available right now. Please try again later.</p>';
                return;
            }

            emailjs.send('service_unqp8b8', 'template_m9q3bjr', {
                to_email: 'fenoheryrandriamahasoa@gmail.com',
                from_name: name,
                from_email: email,
                message: message
            })
            .then(function () {
                formStatus.innerHTML = '<p class="form-success">Message sent successfully. I will get back to you soon.</p>';
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                contactForm.reset();

                setTimeout(function () {
                    formStatus.innerHTML = '';
                }, 5000);
            })
            .catch(function (error) {
                console.error('Email send error:', error);
                formStatus.innerHTML = '<p class="form-error">Failed to send message. Please try again or contact me directly by email.</p>';
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    });

})(jQuery);