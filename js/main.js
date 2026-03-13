(function($,sr) {
  var debounce = function (func, threshold, execAsap) {
    var timeout;
    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap)
            func.apply(obj, args);
        timeout = null;
      }
      ;
      if (timeout)
        clearTimeout(timeout); else if (execAsap)
        func.apply(obj, args);
      timeout = setTimeout(delayed, threshold || 100);
    }
    ;
  }
  // smartresize 
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  }
  ;
}
)(jQuery,'smartresize');

$(function() {

    // Fix the Home Height

    var setHomeBannerHeight = function(){
	   var homeHeight= $(window).height();
	   $('#overlay-1').height(homeHeight);
    }
    setHomeBannerHeight();

    // Arrow drop effect

    var $scrollDownArrow = $('.bottom > a');

    // Smooth Scrolling and remove Hash tag from link

    $('a[href*=#]:not([href=#])').click(function() {
        var $link = $(this);
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000, function(){
                    // remove focus style so only scrollspy "active" link is highlighted
                    $link.blur();
                });
                return false;
            }
        }
    });


  ///////////////////////////////
  // Center Home Slideshow Text
  ///////////////////////////////
  function centerHomeBannerText() {
    var bannerText = jQuery('#header .middle');
    var bannerTextTop = (jQuery('#header').actual('height')/2) - (jQuery('#header .middle').actual('height')/2) - 20;
    bannerText.css('padding-top', bannerTextTop+'px');
    bannerText.show();
  }
  centerHomeBannerText();

    jQuery(window).smartresize(function() {
        setHomeBannerHeight();
        centerHomeBannerText();
    });
    
    // Initialize Bootstrap scrollspy with proper offset
    if ($('body').data('spy') === 'scroll') {
        $('body').scrollspy({
            target: '.site-nav',
            offset: 80
        });

        // Ensure only one nav item has .active at a time
        $(window).on('activate.bs.scrollspy', function () {
            var $active = $('.site-nav li.active').last();
            $('.site-nav li').removeClass('active');
            $active.addClass('active');
        });
    }
});


$( function() {
  // init Isotope
  var $container = $('.isotope').isotope({
    itemSelector: '.element-item',
    layoutMode: 'fitRows',
    getSortData: {
      name: '.name',
      symbol: '.symbol',
      number: '.number parseInt',
      category: '[data-category]',
      weight: function( itemElem ) {
        var weight = $( itemElem ).find('.weight').text();
        return parseFloat( weight.replace( /[\(\)]/g, '') );
      }
    }
  });

  // Make isotope accessible globally for View All button
  window.$isotopeContainer = $container;

  // filter functions
  var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function() {
      var number = $(this).find('.number').text();
      return parseInt( number, 10 ) > 50;
    },
    // show if name ends with -ium
    ium: function() {
      var name = $(this).find('.name').text();
      return name.match( /ium$/ );
    }
  };

  // bind filter button click
  $('#filters').on( 'click', 'button', function() {
    var filterValue = $( this ).attr('data-filter');
    // use filterFn if matches value
    filterValue = filterFns[ filterValue ] || filterValue;
    $container.isotope({ filter: filterValue });
  });

  // bind sort button click
  $('#sorts').on( 'click', 'button', function() {
    var sortByValue = $(this).attr('data-sort-by');
    $container.isotope({ sortBy: sortByValue });
  });
  
  // change is-checked class on buttons
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
    });
  });

  
});

// =====================================================================
// WOW.js Initialization
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
});

// =====================================================================
// Theme Toggle (Light / Dark)
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'theme';
    const toggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        document.body.classList.toggle('theme-dark', isDark);

        if (toggle) {
            const icon = toggle.querySelector('i');
            const label = toggle.querySelector('span');
            if (icon) icon.className = isDark ? 'fa fa-sun-o' : 'fa fa-moon-o';
            if (label) label.textContent = isDark ? 'Light' : 'Dark';
        }
    }

    // Load saved theme (default: light)
    const saved = localStorage.getItem(STORAGE_KEY);
    applyTheme(saved === 'dark' ? 'dark' : 'light');

    if (toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, next);
            applyTheme(next);
            this.blur();
        });
    }
});

// =====================================================================
// EmailJS Initialization
// =====================================================================
setTimeout(function() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({
                publicKey: 'YNzqEOiMi21KV9OFW'
            });
            console.log('✓ EmailJS initialized successfully');
        } else {
            console.error('✗ EmailJS library not found - check network');
        }
    } catch (error) {
        console.error('✗ Error initializing EmailJS:', error);
    }
}, 1000);

// =====================================================================
// Project Modal Handler
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Get all detail buttons
    const detailButtons = document.querySelectorAll('.project-details');
    const modals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const viewAllButton = document.querySelector('.btn-view');
    const hireButton = document.querySelector('.btn-hire');
    const hiddenProjects = document.querySelectorAll('.hidden-project');

    // Hire Me button - remove focus after click
    if (hireButton) {
        hireButton.addEventListener('click', function(e) {
            this.blur();
        });
    }

    // Open modal on button click
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            const modal = document.getElementById(`project-modal-${projectId}`);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            }
        });
    });

    // Close modal on close button click
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.closest('.project-modal').classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scroll
        });
    });

    // Close modal on outside click
    modals.forEach(modal => {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    // View All button handler
    if (viewAllButton) {
        let isExpanded = false;
        
        viewAllButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.blur(); // Remove focus state immediately
            isExpanded = !isExpanded;
            
            // Toggle hidden projects visibility
            hiddenProjects.forEach(project => {
                if (isExpanded) {
                    project.classList.add('show');
                } else {
                    project.classList.remove('show');
                }
            });
            
            // Reload isotope layout
            setTimeout(() => {
                if (window.$isotopeContainer) {
                    window.$isotopeContainer.isotope('reloadItems');
                    window.$isotopeContainer.isotope('layout');
                }
            }, 100);
            
            // Update button text
            const buttonText = this.querySelector('span');
            if (buttonText) {
                buttonText.textContent = isExpanded ? 'View Less' : 'View All';
            }
            
            // Optional: Scroll to view all projects
            if (isExpanded) {
                setTimeout(() => {
                    const portfolioSection = document.querySelector('#portfolio');
                    portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    }
});

// =====================================================================
// Contact Form Handler
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Show sending status
            formStatus.innerHTML = '<p class="form-sending">Sending message...</p>';

            // Check if emailjs is loaded
            if (typeof emailjs === 'undefined') {
                formStatus.innerHTML = '<p class="form-error">Email service not loaded. Please try again later.</p>';
                return;
            }

            // Send email via EmailJS
            emailjs.send('service_unqp8b8', 'template_m9q3bjr', {
                to_email: 'fenoheryrandriamahasoa@gmail.com',
                from_name: name,
                from_email: email,
                message: message
            })
            .then(function(response) {
                console.log('Email sent successfully!', response);
                formStatus.innerHTML = '<p class="form-success">Message sent successfully! I\'ll get back to you soon.</p>';
                contactForm.reset();
                
                // Clear status message after 5 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            })
            .catch(function(error) {
                console.error('Failed to send email:', error);
                formStatus.innerHTML = '<p class="form-error">Failed to send message. Please try again or email me directly.</p>';
            });
        });
    }
});

// =====================================================================
// Header background on scroll
// =====================================================================
$(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > 50) {
        $('#site-header').addClass('header-scrolled');
    } else {
        $('#site-header').removeClass('header-scrolled');
    }
});

// =====================================================================
// NavBar Menu Behavior
// =====================================================================
$(document).ready(function () {
    const $menu = $('.navbar-collapse');
    const $toggleBtn = $('.navbar-toggle');

    $('.navbar-nav a').not('#theme-toggle').on('click', function(e) {
        var target = $(this).attr('href');
        if (target.startsWith('#')) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: $(target).offset().top - 64
            }, 800, function() {
                $menu.collapse('hide'); 
            });
        }
    });

    $(document).on('click', function (e) {
        if ($menu.hasClass('in') || $menu.hasClass('show')) {
            if (!$menu.is(e.target) && $menu.has(e.target).length === 0 && 
                !$toggleBtn.is(e.target) && $toggleBtn.has(e.target).length === 0) {
                $menu.collapse('hide');
            }
        }
    });
});

