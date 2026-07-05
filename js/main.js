/**
 * ===================================================================
 * main js
 *
 * -------------------------------------------------------------------
 */

import {
	loadProjectsList,
	loadCertificatesList,
	loadSkillsList,
} from './loadLists.js';
import { loadComponent } from './loadComponents.js';
import { changeLanguage } from './i18n.js';

(function ($) {
	'use strict';

	/*---------------------------------------------------- */
	/* Change language based on the parameter (if given)
	------------------------------------------------------ */
	$(window).ready(function () {
		// Obtain language parameter
		const params = new URLSearchParams(window.location.search);
		const language = params.get('lang');
		if (language) changeLanguage(language);
	});

	/*---------------------------------------------------- */
	/* Preloader
	------------------------------------------------------ */
	$(window).load(function () {
		// will first fade out the loading animation
		$('#loader').fadeOut('slow', function () {
			// will fade out the whole DIV that covers the website.
			$('#preloader').delay(300).fadeOut('slow');
		});
	});

	/*---------------------------------------------------- */
	/* Remove 'Kards', replace with menu
  	------------------------------------------------------ */
	//$('#menu-button').text = 'MENU';

	/*---------------------------------------------------- */
	/* Inserção de conteúdo do JSON no HTML
	------------------------------------------------------ */
	loadSkillsList();
	loadProjectsList();
	loadCertificatesList();

	// Carrega componentes
	async function initializeApp() {
		if (window.location.pathname === '/') {
			await loadComponent('header', './components/header.html');
			await loadComponent('section#contact', './components/contact.html');
		} else {
			await loadComponent('header', '../components/header.html');
			await loadComponent('section#contact', '../components/contact.html');
		}

		initializeWaypoints();
	}
	initializeApp();

	/*----------------------------------------------------- */
	/* Alert Boxes
  	------------------------------------------------------- */
	$('.alert-box').on('click', '.close', function () {
		$(this).parent().fadeOut(500);
	});

	/*----------------------------------------------------- */
	/* Stat Counter
  	------------------------------------------------------- */
	// var statSection = $('#stats'),
	// 	stats = $('.stat-count');

	// statSection.waypoint({
	// 	handler: function (direction) {
	// 		if (direction === 'down') {
	// 			stats.each(function () {
	// 				var $this = $(this);

	// 				$({ Counter: 0 }).animate(
	// 					{ Counter: $this.text() },
	// 					{
	// 						duration: 4000,
	// 						easing: 'swing',
	// 						step: function (curValue) {
	// 							$this.text(Math.ceil(curValue));
	// 						},
	// 					}
	// 				);
	// 			});
	// 		}

	// 		// trigger once only
	// 		this.destroy();
	// 	},

	// 	offset: '90%',
	// });

	/*---------------------------------------------------- */
	/*	Masonry
	------------------------------------------------------ */
	var containerProjects = $('#folio-wrapper');

	containerProjects.imagesLoaded(function () {
		containerProjects.masonry({
			itemSelector: '.folio-item',
			resize: true,
		});
	});

	/*----------------------------------------------------*/
	/*	Modal Popup
	------------------------------------------------------*/
	$('.item-wrap a').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		removalDelay: 300,
		showCloseBtn: false,
		mainClass: 'mfp-fade',
	});

	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});

	/*-----------------------------------------------------*/
	/* Navigation Menu
   ------------------------------------------------------ */
	// Toggle do menu
	$(document).on('click', '.menu-toggle', function (e) {
		e.preventDefault();

		$('.menu-toggle').toggleClass('is-clicked');

		$('.main-navigation').slideToggle();
	});

	// Clique nos links do menu
	$(document).on('click', '.main-navigation li a', function () {
		$('.menu-toggle').removeClass('is-clicked');

		$('.main-navigation').fadeOut();
	});

	$(document).on('click', '#langListDropButton', function () {
		$('.lang-nav').toggleClass('closed')
		$('#langListDropButton').toggleClass('closed')

	})

	/*---------------------------------------------------- */
	/* Highlight the current section in the navigation bar
  	------------------------------------------------------ */
	function initializeWaypoints() {
		$('section').waypoint({
			handler: function (direction) {
				let activeSection = $(this.element);
				if (direction === 'up') {
					activeSection = activeSection.prevAll('section').first();
				}

				if (!activeSection.length) return;

				const sectionId = activeSection.attr('id');

				$('#main-nav-wrap li').removeClass('current');

				$(`#main-nav-wrap a[href="/#${sectionId}"]`)
					.parent()
					.addClass('current');
			},

			offset: '50%',
		});
	}

	/*---------------------------------------------------- */
	/* Smooth Scrolling
  	------------------------------------------------------ */
	$(document).on('click', '.smoothscroll', function (e) {
		e.preventDefault();

		const target = this.hash;
		const $target = $(target);

		if ($target.offset()) {
			$('html, body')
				.stop()
				.animate(
					{
						scrollTop: $target.offset().top,
					},
					800,
					'swing',
					function () {
						window.location.hash = target;
					}
				);
		} else {
			window.location.href = this.href;
		}
	});

	/*---------------------------------------------------- */
	/*  Placeholder Plugin Settings
	------------------------------------------------------ */
	$('input, textarea, select').placeholder();

	/*---------------------------------------------------- */
	/*	contact form
	------------------------------------------------------ */

	/* local validation */
	$('#contactForm').validate({
		/* submit via ajax */
		submitHandler: function (form) {
			var sLoader = $('#submit-loader');

			$.ajax({
				type: 'POST',
				url: 'inc/sendEmail.php',
				data: $(form).serialize(),
				beforeSend: function () {
					sLoader.fadeIn();
				},
				success: function (msg) {
					// Message was sent
					if (msg == 'OK') {
						sLoader.fadeOut();
						$('#message-warning').hide();
						$('#contactForm').fadeOut();
						$('#message-success').fadeIn();
					}
					// There was an error
					else {
						sLoader.fadeOut();
						$('#message-warning').html(msg);
						$('#message-warning').fadeIn();
					}
				},
				error: function () {
					sLoader.fadeOut();
					$('#message-warning').html('Something went wrong. Please try again.');
					$('#message-warning').fadeIn();
				},
			});
		},
	});

	/*----------------------------------------------------- */
	/* Back to top
   ------------------------------------------------------- */
	var pxShow = 300; // height on which the button will show
	var fadeInTime = 400; // how slow/fast you want the button to show
	var fadeOutTime = 400; // how slow/fast you want the button to hide
	var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

	// Show or hide the sticky footer button
	jQuery(window).scroll(function () {
		if (!$('#header-search').hasClass('is-visible')) {
			if (jQuery(window).scrollTop() >= pxShow) {
				jQuery('#go-top').fadeIn(fadeInTime);
			} else {
				jQuery('#go-top').fadeOut(fadeOutTime);
			}
		}
	});
})(jQuery);
