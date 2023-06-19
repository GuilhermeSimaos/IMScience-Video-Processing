/*
 * jQuery xdrop: A simple xdrop plugin
 *
 * Inspired by Bootstrap: http://twitter.github.com/bootstrap/javascript.html#xdrops
 *
 * Copyright 2013 Cory LaViska for A Beautiful Site, LLC. (http://abeautifulsite.net/)
 *
 * Dual licensed under the MIT / GPL Version 2 licenses
 *
*/
if (jQuery) (function ($) {

    $.extend($.fn, {
        xdrop: function (method, data) {

            switch (method) {
                case 'show':
                    show(null, $(this));
                    return $(this);
                case 'hide':
                    hide();
                    return $(this);
                case 'attach':
                    return $(this).attr('data-xdrop', data);
                case 'detach':
                    hide();
                    return $(this).removeAttr('data-xdrop');
                case 'disable':
                    return $(this).addClass('xdrop-disabled');
                case 'enable':
                    hide();
                    return $(this).removeClass('xdrop-disabled');
            }

        }
    });

    function show(event, object) {

        var trigger = event ? $(this) : object,
			xdrop = $(trigger.attr('data-xdrop')),
			isOpen = trigger.hasClass('xdrop-open');

        // In some cases we don't want to show it
        if (event) {
            if ($(event.target).hasClass('xdrop-ignore')) return;

            event.preventDefault();
            event.stopPropagation();
        } else {
            if (trigger !== object.target && $(object.target).hasClass('xdrop-ignore')) return;
        }
        hide();

        if (isOpen || trigger.hasClass('xdrop-disabled')) return;

        // Show it
        trigger.addClass('xdrop-open');
        xdrop
			.data('xdrop-trigger', trigger)
			.show();

        // Position it
        position();

        // Trigger the show callback
        xdrop
			.trigger('show', {
			    xdrop: xdrop,
			    trigger: trigger
			});

    }

    function hide(event) {

        // In some cases we don't hide them
        var targetGroup = event ? $(event.target).parents().addBack() : null;

        // Are we clicking anywhere in a xdrop?
        if (targetGroup && targetGroup.is('.xdrop')) {
            // Is it a xdrop menu?
            if (targetGroup.is('.xdrop-menu')) {
                // Did we click on an option? If so close it.
                if (!targetGroup.is('A')) return;
            } else {
                // Nope, it's a panel. Leave it open.
                return;
            }
        }

        // Hide any xdrop that may be showing
        $(document).find('.xdrop:visible').each(function () {
            var xdrop = $(this);
            xdrop
				.hide()
				.removeData('xdrop-trigger')
				.trigger('hide', { xdrop: xdrop });
        });

        // Remove all xdrop-open classes
        $(document).find('.xdrop-open').removeClass('xdrop-open');

    }

    function position() {

        var xdrop = $('.xdrop:visible').eq(0),
			trigger = xdrop.data('xdrop-trigger'),
			hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
			vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

        if (xdrop.length === 0 || !trigger) return;

        // Position the xdrop relative-to-parent...
        if (xdrop.hasClass('xdrop-relative')) {
            xdrop.css({
                left: xdrop.hasClass('xdrop-anchor-right') ?
					trigger.position().left - (xdrop.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css('margin-right')) + hOffset :
					trigger.position().left + parseInt(trigger.css('margin-left')) + hOffset,
                top: trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css('margin-top')) + vOffset
            });
        } else {
            // ...or relative to document
            xdrop.css({
                left: xdrop.hasClass('xdrop-anchor-right') ?
					trigger.offset().left - (xdrop.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
                top: trigger.offset().top + trigger.outerHeight() + vOffset
            });
        }
    }

    $(document).on('click.xdrop', '[data-xdrop]', show);
    $(document).on('click.xdrop', hide);
    $(window).on('resize', position);

})(jQuery);
