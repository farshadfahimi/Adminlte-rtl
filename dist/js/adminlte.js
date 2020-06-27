/*!
 * AdminLTE v3.1.0-pre (https://adminlte.io)
 * Copyright 2014-2020 Colorlib <https://colorlib.com>
 * Licensed under MIT (https://github.com/ColorlibHQ/AdminLTE/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = global || self, factory(global.adminlte = {}, global.jQuery));
}(this, (function (exports, $) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /**
   * --------------------------------------------
   * AdminLTE CardRefresh.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME = 'CardRefresh';
  var DATA_KEY = 'lte.cardrefresh';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var EVENT_LOADED = "loaded" + EVENT_KEY;
  var EVENT_OVERLAY_ADDED = "overlay.added" + EVENT_KEY;
  var EVENT_OVERLAY_REMOVED = "overlay.removed" + EVENT_KEY;
  var CLASS_NAME_CARD = 'card';
  var SELECTOR_CARD = "." + CLASS_NAME_CARD;
  var SELECTOR_DATA_REFRESH = '[data-card-widget="card-refresh"]';
  var Default = {
    source: '',
    sourceSelector: '',
    params: {},
    trigger: SELECTOR_DATA_REFRESH,
    content: '.card-body',
    loadInContent: true,
    loadOnInit: true,
    responseType: '',
    overlayTemplate: '<div class="overlay"><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>',
    onLoadStart: function onLoadStart() {},
    onLoadDone: function onLoadDone(response) {
      return response;
    }
  };

  var CardRefresh = /*#__PURE__*/function () {
    function CardRefresh(element, settings) {
      this._element = element;
      this._parent = element.parents(SELECTOR_CARD).first();
      this._settings = $.extend({}, Default, settings);
      this._overlay = $(this._settings.overlayTemplate);

      if (element.hasClass(CLASS_NAME_CARD)) {
        this._parent = element;
      }

      if (this._settings.source === '') {
        throw new Error('Source url was not defined. Please specify a url in your CardRefresh source option.');
      }
    }

    var _proto = CardRefresh.prototype;

    _proto.load = function load() {
      var _this = this;

      this._addOverlay();

      this._settings.onLoadStart.call($(this));

      $.get(this._settings.source, this._settings.params, function (response) {
        if (_this._settings.loadInContent) {
          if (_this._settings.sourceSelector !== '') {
            response = $(response).find(_this._settings.sourceSelector).html();
          }

          _this._parent.find(_this._settings.content).html(response);
        }

        _this._settings.onLoadDone.call($(_this), response);

        _this._removeOverlay();
      }, this._settings.responseType !== '' && this._settings.responseType);
      $(this._element).trigger($.Event(EVENT_LOADED));
    };

    _proto._addOverlay = function _addOverlay() {
      this._parent.append(this._overlay);

      $(this._element).trigger($.Event(EVENT_OVERLAY_ADDED));
    };

    _proto._removeOverlay = function _removeOverlay() {
      this._parent.find(this._overlay).remove();

      $(this._element).trigger($.Event(EVENT_OVERLAY_REMOVED));
    } // Private
    ;

    _proto._init = function _init() {
      var _this2 = this;

      $(this).find(this._settings.trigger).on('click', function () {
        _this2.load();
      });

      if (this._settings.loadOnInit) {
        this.load();
      }
    } // Static
    ;

    CardRefresh._jQueryInterface = function _jQueryInterface(config) {
      var data = $(this).data(DATA_KEY);

      var _options = $.extend({}, Default, $(this).data());

      if (!data) {
        data = new CardRefresh($(this), _options);
        $(this).data(DATA_KEY, typeof config === 'string' ? data : config);
      }

      if (typeof config === 'string' && config.match(/load/)) {
        data[config]();
      } else {
        data._init($(this));
      }
    };

    return CardRefresh;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(document).on('click', SELECTOR_DATA_REFRESH, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardRefresh._jQueryInterface.call($(this), 'load');
  });
  $(function () {
    $(SELECTOR_DATA_REFRESH).each(function () {
      CardRefresh._jQueryInterface.call($(this));
    });
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME] = CardRefresh._jQueryInterface;
  $.fn[NAME].Constructor = CardRefresh;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return CardRefresh._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE CardWidget.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$1 = 'CardWidget';
  var DATA_KEY$1 = 'lte.cardwidget';
  var EVENT_KEY$1 = "." + DATA_KEY$1;
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  var EVENT_EXPANDED = "expanded" + EVENT_KEY$1;
  var EVENT_COLLAPSED = "collapsed" + EVENT_KEY$1;
  var EVENT_MAXIMIZED = "maximized" + EVENT_KEY$1;
  var EVENT_MINIMIZED = "minimized" + EVENT_KEY$1;
  var EVENT_REMOVED = "removed" + EVENT_KEY$1;
  var CLASS_NAME_CARD$1 = 'card';
  var CLASS_NAME_COLLAPSED = 'collapsed-card';
  var CLASS_NAME_COLLAPSING = 'collapsing-card';
  var CLASS_NAME_EXPANDING = 'expanding-card';
  var CLASS_NAME_WAS_COLLAPSED = 'was-collapsed';
  var CLASS_NAME_MAXIMIZED = 'maximized-card';
  var SELECTOR_DATA_REMOVE = '[data-card-widget="remove"]';
  var SELECTOR_DATA_COLLAPSE = '[data-card-widget="collapse"]';
  var SELECTOR_DATA_MAXIMIZE = '[data-card-widget="maximize"]';
  var SELECTOR_CARD$1 = "." + CLASS_NAME_CARD$1;
  var SELECTOR_CARD_HEADER = '.card-header';
  var SELECTOR_CARD_BODY = '.card-body';
  var SELECTOR_CARD_FOOTER = '.card-footer';
  var Default$1 = {
    animationSpeed: 'normal',
    collapseTrigger: SELECTOR_DATA_COLLAPSE,
    removeTrigger: SELECTOR_DATA_REMOVE,
    maximizeTrigger: SELECTOR_DATA_MAXIMIZE,
    collapseIcon: 'fa-minus',
    expandIcon: 'fa-plus',
    maximizeIcon: 'fa-expand',
    minimizeIcon: 'fa-compress'
  };

  var CardWidget = /*#__PURE__*/function () {
    function CardWidget(element, settings) {
      this._element = element;
      this._parent = element.parents(SELECTOR_CARD$1).first();

      if (element.hasClass(CLASS_NAME_CARD$1)) {
        this._parent = element;
      }

      this._settings = $.extend({}, Default$1, settings);
    }

    var _proto = CardWidget.prototype;

    _proto.collapse = function collapse() {
      var _this = this;

      this._parent.addClass(CLASS_NAME_COLLAPSING).children(SELECTOR_CARD_BODY + ", " + SELECTOR_CARD_FOOTER).slideUp(this._settings.animationSpeed, function () {
        _this._parent.addClass(CLASS_NAME_COLLAPSED).removeClass(CLASS_NAME_COLLAPSING);
      });

      this._parent.find("> " + SELECTOR_CARD_HEADER + " " + this._settings.collapseTrigger + " ." + this._settings.collapseIcon).addClass(this._settings.expandIcon).removeClass(this._settings.collapseIcon);

      this._element.trigger($.Event(EVENT_COLLAPSED), this._parent);
    };

    _proto.expand = function expand() {
      var _this2 = this;

      this._parent.addClass(CLASS_NAME_EXPANDING).children(SELECTOR_CARD_BODY + ", " + SELECTOR_CARD_FOOTER).slideDown(this._settings.animationSpeed, function () {
        _this2._parent.removeClass(CLASS_NAME_COLLAPSED).removeClass(CLASS_NAME_EXPANDING);
      });

      this._parent.find("> " + SELECTOR_CARD_HEADER + " " + this._settings.collapseTrigger + " ." + this._settings.expandIcon).addClass(this._settings.collapseIcon).removeClass(this._settings.expandIcon);

      this._element.trigger($.Event(EVENT_EXPANDED), this._parent);
    };

    _proto.remove = function remove() {
      this._parent.slideUp();

      this._element.trigger($.Event(EVENT_REMOVED), this._parent);
    };

    _proto.toggle = function toggle() {
      if (this._parent.hasClass(CLASS_NAME_COLLAPSED)) {
        this.expand();
        return;
      }

      this.collapse();
    };

    _proto.maximize = function maximize() {
      this._parent.find(this._settings.maximizeTrigger + " ." + this._settings.maximizeIcon).addClass(this._settings.minimizeIcon).removeClass(this._settings.maximizeIcon);

      this._parent.css({
        height: this._parent.height(),
        width: this._parent.width(),
        transition: 'all .15s'
      }).delay(150).queue(function () {
        var $element = $(this);
        $element.addClass(CLASS_NAME_MAXIMIZED);
        $('html').addClass(CLASS_NAME_MAXIMIZED);

        if ($element.hasClass(CLASS_NAME_COLLAPSED)) {
          $element.addClass(CLASS_NAME_WAS_COLLAPSED);
        }

        $element.dequeue();
      });

      this._element.trigger($.Event(EVENT_MAXIMIZED), this._parent);
    };

    _proto.minimize = function minimize() {
      this._parent.find(this._settings.maximizeTrigger + " ." + this._settings.minimizeIcon).addClass(this._settings.maximizeIcon).removeClass(this._settings.minimizeIcon);

      this._parent.css('cssText', "height: " + this._parent[0].style.height + " !important; width: " + this._parent[0].style.width + " !important; transition: all .15s;").delay(10).queue(function () {
        var $element = $(this);
        $element.removeClass(CLASS_NAME_MAXIMIZED);
        $('html').removeClass(CLASS_NAME_MAXIMIZED);
        $element.css({
          height: 'inherit',
          width: 'inherit'
        });

        if ($element.hasClass(CLASS_NAME_WAS_COLLAPSED)) {
          $element.removeClass(CLASS_NAME_WAS_COLLAPSED);
        }

        $element.dequeue();
      });

      this._element.trigger($.Event(EVENT_MINIMIZED), this._parent);
    };

    _proto.toggleMaximize = function toggleMaximize() {
      if (this._parent.hasClass(CLASS_NAME_MAXIMIZED)) {
        this.minimize();
        return;
      }

      this.maximize();
    } // Private
    ;

    _proto._init = function _init(card) {
      var _this3 = this;

      this._parent = card;
      $(this).find(this._settings.collapseTrigger).click(function () {
        _this3.toggle();
      });
      $(this).find(this._settings.maximizeTrigger).click(function () {
        _this3.toggleMaximize();
      });
      $(this).find(this._settings.removeTrigger).click(function () {
        _this3.remove();
      });
    } // Static
    ;

    CardWidget._jQueryInterface = function _jQueryInterface(config) {
      var data = $(this).data(DATA_KEY$1);

      var _options = $.extend({}, Default$1, $(this).data());

      if (!data) {
        data = new CardWidget($(this), _options);
        $(this).data(DATA_KEY$1, typeof config === 'string' ? data : config);
      }

      if (typeof config === 'string' && config.match(/collapse|expand|remove|toggle|maximize|minimize|toggleMaximize/)) {
        data[config]();
      } else if (typeof config === 'object') {
        data._init($(this));
      }
    };

    return CardWidget;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(document).on('click', SELECTOR_DATA_COLLAPSE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($(this), 'toggle');
  });
  $(document).on('click', SELECTOR_DATA_REMOVE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($(this), 'remove');
  });
  $(document).on('click', SELECTOR_DATA_MAXIMIZE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($(this), 'toggleMaximize');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$1] = CardWidget._jQueryInterface;
  $.fn[NAME$1].Constructor = CardWidget;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return CardWidget._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE ControlSidebar.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$2 = 'ControlSidebar';
  var DATA_KEY$2 = 'lte.controlsidebar';
  var EVENT_KEY$2 = "." + DATA_KEY$2;
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  var EVENT_COLLAPSED$1 = "collapsed" + EVENT_KEY$2;
  var EVENT_EXPANDED$1 = "expanded" + EVENT_KEY$2;
  var SELECTOR_CONTROL_SIDEBAR = '.control-sidebar';
  var SELECTOR_CONTROL_SIDEBAR_CONTENT = '.control-sidebar-content';
  var SELECTOR_DATA_TOGGLE = '[data-widget="control-sidebar"]';
  var SELECTOR_HEADER = '.main-header';
  var SELECTOR_FOOTER = '.main-footer';
  var CLASS_NAME_CONTROL_SIDEBAR_ANIMATE = 'control-sidebar-animate';
  var CLASS_NAME_CONTROL_SIDEBAR_OPEN = 'control-sidebar-open';
  var CLASS_NAME_CONTROL_SIDEBAR_SLIDE = 'control-sidebar-slide-open';
  var CLASS_NAME_LAYOUT_FIXED = 'layout-fixed';
  var CLASS_NAME_NAVBAR_FIXED = 'layout-navbar-fixed';
  var CLASS_NAME_NAVBAR_SM_FIXED = 'layout-sm-navbar-fixed';
  var CLASS_NAME_NAVBAR_MD_FIXED = 'layout-md-navbar-fixed';
  var CLASS_NAME_NAVBAR_LG_FIXED = 'layout-lg-navbar-fixed';
  var CLASS_NAME_NAVBAR_XL_FIXED = 'layout-xl-navbar-fixed';
  var CLASS_NAME_FOOTER_FIXED = 'layout-footer-fixed';
  var CLASS_NAME_FOOTER_SM_FIXED = 'layout-sm-footer-fixed';
  var CLASS_NAME_FOOTER_MD_FIXED = 'layout-md-footer-fixed';
  var CLASS_NAME_FOOTER_LG_FIXED = 'layout-lg-footer-fixed';
  var CLASS_NAME_FOOTER_XL_FIXED = 'layout-xl-footer-fixed';
  var Default$2 = {
    controlsidebarSlide: true,
    scrollbarTheme: 'os-theme-light',
    scrollbarAutoHide: 'l'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var ControlSidebar = /*#__PURE__*/function () {
    function ControlSidebar(element, config) {
      this._element = element;
      this._config = config;

      this._init();
    } // Public


    var _proto = ControlSidebar.prototype;

    _proto.collapse = function collapse() {
      var $body = $('body');
      var $html = $('html'); // Show the control sidebar

      if (this._config.controlsidebarSlide) {
        $html.addClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
        $body.removeClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE).delay(300).queue(function () {
          $(SELECTOR_CONTROL_SIDEBAR).hide();
          $html.removeClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
          $(this).dequeue();
        });
      } else {
        $body.removeClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN);
      }

      $(this._element).trigger($.Event(EVENT_COLLAPSED$1));
    };

    _proto.show = function show() {
      var $body = $('body');
      var $html = $('html'); // Collapse the control sidebar

      if (this._config.controlsidebarSlide) {
        $html.addClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
        $(SELECTOR_CONTROL_SIDEBAR).show().delay(10).queue(function () {
          $body.addClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE).delay(300).queue(function () {
            $html.removeClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
            $(this).dequeue();
          });
          $(this).dequeue();
        });
      } else {
        $body.addClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN);
      }

      $(this._element).trigger($.Event(EVENT_EXPANDED$1));
    };

    _proto.toggle = function toggle() {
      var $body = $('body');
      var shouldClose = $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE);

      if (shouldClose) {
        // Close the control sidebar
        this.collapse();
      } else {
        // Open the control sidebar
        this.show();
      }
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      this._fixHeight();

      this._fixScrollHeight();

      $(window).resize(function () {
        _this._fixHeight();

        _this._fixScrollHeight();
      });
      $(window).scroll(function () {
        var $body = $('body');
        var shouldFixHeight = $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE);

        if (shouldFixHeight) {
          _this._fixScrollHeight();
        }
      });
    };

    _proto._fixScrollHeight = function _fixScrollHeight() {
      var $body = $('body');

      if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED)) {
        return;
      }

      var heights = {
        scroll: $(document).height(),
        window: $(window).height(),
        header: $(SELECTOR_HEADER).outerHeight(),
        footer: $(SELECTOR_FOOTER).outerHeight()
      };
      var positions = {
        bottom: Math.abs(heights.window + $(window).scrollTop() - heights.scroll),
        top: $(window).scrollTop()
      };
      var navbarFixed = ($body.hasClass(CLASS_NAME_NAVBAR_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_SM_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_MD_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_LG_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_XL_FIXED)) && $(SELECTOR_HEADER).css('position') === 'fixed';
      var footerFixed = ($body.hasClass(CLASS_NAME_FOOTER_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_SM_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_MD_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_LG_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_XL_FIXED)) && $(SELECTOR_FOOTER).css('position') === 'fixed';
      var $controlSidebar = $(SELECTOR_CONTROL_SIDEBAR);
      var $controlsidebarContent = $(SELECTOR_CONTROL_SIDEBAR + ", " + SELECTOR_CONTROL_SIDEBAR + " " + SELECTOR_CONTROL_SIDEBAR_CONTENT);

      if (positions.top === 0 && positions.bottom === 0) {
        $controlSidebar.css({
          bottom: heights.footer,
          top: heights.header
        });
        $controlsidebarContent.css('height', heights.window - (heights.header + heights.footer));
      } else if (positions.bottom <= heights.footer) {
        if (footerFixed === false) {
          $controlSidebar.css('bottom', heights.footer - positions.bottom);
          $controlsidebarContent.css('height', heights.window - (heights.footer - positions.bottom));
        } else {
          $controlSidebar.css('bottom', heights.footer);
        }
      } else if (positions.top <= heights.header) {
        if (navbarFixed === false) {
          $controlSidebar.css('top', heights.header - positions.top);
          $controlsidebarContent.css('height', heights.window - (heights.header - positions.top));
        } else {
          $controlSidebar.css('top', heights.header);
        }
      } else if (navbarFixed === false) {
        $controlSidebar.css('top', 0);
        $controlsidebarContent.css('height', heights.window);
      } else {
        $controlSidebar.css('top', heights.header);
      }
    };

    _proto._fixHeight = function _fixHeight() {
      var $body = $('body');

      if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED)) {
        return;
      }

      var heights = {
        window: $(window).height(),
        header: $(SELECTOR_HEADER).outerHeight(),
        footer: $(SELECTOR_FOOTER).outerHeight()
      };
      var sidebarHeight = heights.window - heights.header;

      if ($body.hasClass(CLASS_NAME_FOOTER_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_SM_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_MD_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_LG_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_XL_FIXED)) {
        if ($(SELECTOR_FOOTER).css('position') === 'fixed') {
          sidebarHeight = heights.window - heights.header - heights.footer;
        }
      }

      var $controlSidebar = $(SELECTOR_CONTROL_SIDEBAR + " " + SELECTOR_CONTROL_SIDEBAR_CONTENT);
      $controlSidebar.css('height', sidebarHeight);

      if (typeof $.fn.overlayScrollbars !== 'undefined') {
        $controlSidebar.overlayScrollbars({
          className: this._config.scrollbarTheme,
          sizeAutoCapable: true,
          scrollbars: {
            autoHide: this._config.scrollbarAutoHide,
            clickScrolling: true
          }
        });
      }
    } // Static
    ;

    ControlSidebar._jQueryInterface = function _jQueryInterface(operation) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);

        var _options = $.extend({}, Default$2, $(this).data());

        if (!data) {
          data = new ControlSidebar(this, _options);
          $(this).data(DATA_KEY$2, data);
        }

        if (data[operation] === 'undefined') {
          throw new Error(operation + " is not a function");
        }

        data[operation]();
      });
    };

    return ControlSidebar;
  }();
  /**
   *
   * Data Api implementation
   * ====================================================
   */


  $(document).on('click', SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();

    ControlSidebar._jQueryInterface.call($(this), 'toggle');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$2] = ControlSidebar._jQueryInterface;
  $.fn[NAME$2].Constructor = ControlSidebar;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return ControlSidebar._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE DirectChat.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$3 = 'DirectChat';
  var DATA_KEY$3 = 'lte.directchat';
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var EVENT_TOGGLED = "toggled" + EVENT_KEY$3;
  var SELECTOR_DATA_TOGGLE$1 = '[data-widget="chat-pane-toggle"]';
  var SELECTOR_DIRECT_CHAT = '.direct-chat';
  var CLASS_NAME_DIRECT_CHAT_OPEN = 'direct-chat-contacts-open';
  /**
   * Class Definition
   * ====================================================
   */

  var DirectChat = /*#__PURE__*/function () {
    function DirectChat(element) {
      this._element = element;
    }

    var _proto = DirectChat.prototype;

    _proto.toggle = function toggle() {
      $(this._element).parents(SELECTOR_DIRECT_CHAT).first().toggleClass(CLASS_NAME_DIRECT_CHAT_OPEN);
      $(this._element).trigger($.Event(EVENT_TOGGLED));
    } // Static
    ;

    DirectChat._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$3);

        if (!data) {
          data = new DirectChat($(this));
          $(this).data(DATA_KEY$3, data);
        }

        data[config]();
      });
    };

    return DirectChat;
  }();
  /**
   *
   * Data Api implementation
   * ====================================================
   */


  $(document).on('click', SELECTOR_DATA_TOGGLE$1, function (event) {
    if (event) {
      event.preventDefault();
    }

    DirectChat._jQueryInterface.call($(this), 'toggle');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$3] = DirectChat._jQueryInterface;
  $.fn[NAME$3].Constructor = DirectChat;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return DirectChat._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Dropdown.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$4 = 'Dropdown';
  var DATA_KEY$4 = 'lte.dropdown';
  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  var SELECTOR_NAVBAR = '.navbar';
  var SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
  var SELECTOR_DROPDOWN_MENU_ACTIVE = '.dropdown-menu.show';
  var SELECTOR_DROPDOWN_TOGGLE = '[data-toggle="dropdown"]';
  var CLASS_NAME_DROPDOWN_LEFT = 'dropdown-menu-left'; // TODO: this is unused; should be removed along with the extend?

  var Default$3 = {};
  /**
   * Class Definition
   * ====================================================
   */

  var Dropdown = /*#__PURE__*/function () {
    function Dropdown(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = Dropdown.prototype;

    _proto.toggleSubmenu = function toggleSubmenu() {
      this._element.siblings().show().toggleClass('show');

      if (!this._element.next().hasClass('show')) {
        this._element.parents(SELECTOR_DROPDOWN_MENU).first().find('.show').removeClass('show').hide();
      }

      this._element.parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function () {
        $('.dropdown-submenu .show').removeClass('show').hide();
      });
    };

    _proto.fixPosition = function fixPosition() {
      var $element = $(SELECTOR_DROPDOWN_MENU_ACTIVE);

      if ($element.length === 0) {
        return;
      }

      if ($element.hasClass(CLASS_NAME_DROPDOWN_LEFT)) {
        $element.css({
          right: 'inherit',
          left: 0
        });
      } else {
        $element.css({
          right: 0,
          left: 'inherit'
        });
      }

      var offset = $element.offset();
      var width = $element.width();
      var visiblePart = $(window).width() - offset.right;

      if (offset.right < 0) {
        $element.css({
          right: 'inherit',
          left: offset.right - 5
        });
      } else if (visiblePart < width) {
        $element.css({
          right: 'inherit',
          left: 0
        });
      }
    } // Static
    ;

    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);

        var _config = $.extend({}, Default$3, $(this).data());

        if (!data) {
          data = new Dropdown($(this), _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (config === 'toggleSubmenu' || config === 'fixPosition') {
          data[config]();
        }
      });
    };

    return Dropdown;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(SELECTOR_DROPDOWN_MENU + " " + SELECTOR_DROPDOWN_TOGGLE).on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggleSubmenu');
  });
  $(SELECTOR_NAVBAR + " " + SELECTOR_DROPDOWN_TOGGLE).on('click', function (event) {
    event.preventDefault();
    setTimeout(function () {
      Dropdown._jQueryInterface.call($(this), 'fixPosition');
    }, 1);
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$4] = Dropdown._jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Dropdown._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE ExpandableTable.js
   * License MIT
   * --------------------------------------------
   */
  /**
    * Constants
    * ====================================================
    */

  var NAME$5 = 'ExpandableTable';
  var DATA_KEY$5 = 'lte.expandableTable';
  var EVENT_KEY$4 = "." + DATA_KEY$5;
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var EVENT_EXPANDED$2 = "expanded" + EVENT_KEY$4;
  var EVENT_COLLAPSED$2 = "collapsed" + EVENT_KEY$4;
  var CLASS_NAME_HEADER = 'expandable-header';
  var SELECTOR_TABLE = '.expandable-table';
  var SELECTOR_HEADER$1 = "." + CLASS_NAME_HEADER;
  var SELECTOR_DATA_SELECTOR = 'data-expandable-table';
  var SELECTOR_EXPANDED = 'expanded';
  var SELECTOR_COLLAPSED = 'collapsed';
  /**
    * Class Definition
    * ====================================================
    */

  var ExpandableTable = /*#__PURE__*/function () {
    function ExpandableTable(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = ExpandableTable.prototype;

    _proto.init = function init() {
      $(SELECTOR_HEADER$1).each(function (_, $header) {
        // Next Child to the header will have the same column span as header
        $($header).next().children().first().attr('colspan', $($header).children().length); // Setting up table design for the first time

        var $type = $($header).next().attr(SELECTOR_DATA_SELECTOR);
        var $body = $($header).next().children().first().children();

        if ($type === SELECTOR_EXPANDED) {
          $body.show();
        } else if ($type === SELECTOR_COLLAPSED) {
          $body.hide();
          $body.parent().parent().addClass('d-none');
        }
      });
    };

    _proto.toggleRow = function toggleRow() {
      var $element = this._element;
      var time = 500;
      var $type = $element.next().attr(SELECTOR_DATA_SELECTOR);
      var $body = $element.next().children().first().children();
      $body.stop();

      if ($type === SELECTOR_EXPANDED) {
        $body.slideUp(time, function () {
          $element.next().addClass('d-none');
        });
        $element.next().attr(SELECTOR_DATA_SELECTOR, SELECTOR_COLLAPSED);
        $element.trigger($.Event(EVENT_COLLAPSED$2));
      } else if ($type === SELECTOR_COLLAPSED) {
        $element.next().removeClass('d-none');
        $body.slideDown(time);
        $element.next().attr(SELECTOR_DATA_SELECTOR, SELECTOR_EXPANDED);
        $element.trigger($.Event(EVENT_EXPANDED$2));
      }
    } // Static
    ;

    ExpandableTable._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);

        if (!data) {
          data = new ExpandableTable($(this));
          $(this).data(DATA_KEY$5, data);
        }

        if (config === 'init' || config === 'toggleRow') {
          data[config]();
        }
      });
    };

    return ExpandableTable;
  }();
  /**
    * Data API
    * ====================================================
    */


  $(SELECTOR_TABLE).ready(function () {
    ExpandableTable._jQueryInterface.call($(this), 'init');
  });
  $(document).on('click', SELECTOR_HEADER$1, function () {
    ExpandableTable._jQueryInterface.call($(this), 'toggleRow');
  });
  /**
    * jQuery API
    * ====================================================
    */

  $.fn[NAME$5] = ExpandableTable._jQueryInterface;
  $.fn[NAME$5].Constructor = ExpandableTable;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return ExpandableTable._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Layout.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$6 = 'Layout';
  var DATA_KEY$6 = 'lte.layout';
  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  var SELECTOR_HEADER$2 = '.main-header';
  var SELECTOR_MAIN_SIDEBAR = '.main-sidebar';
  var SELECTOR_SIDEBAR = '.main-sidebar .sidebar';
  var SELECTOR_CONTENT = '.content-wrapper';
  var SELECTOR_CONTROL_SIDEBAR_CONTENT$1 = '.control-sidebar-content';
  var SELECTOR_CONTROL_SIDEBAR_BTN = '[data-widget="control-sidebar"]';
  var SELECTOR_FOOTER$1 = '.main-footer';
  var SELECTOR_PUSHMENU_BTN = '[data-widget="pushmenu"]';
  var SELECTOR_LOGIN_BOX = '.login-box';
  var SELECTOR_REGISTER_BOX = '.register-box';
  var CLASS_NAME_SIDEBAR_FOCUSED = 'sidebar-focused';
  var CLASS_NAME_LAYOUT_FIXED$1 = 'layout-fixed';
  var CLASS_NAME_CONTROL_SIDEBAR_SLIDE_OPEN = 'control-sidebar-slide-open';
  var CLASS_NAME_CONTROL_SIDEBAR_OPEN$1 = 'control-sidebar-open';
  var Default$4 = {
    scrollbarTheme: 'os-theme-light',
    scrollbarAutoHide: 'l',
    panelAutoHeight: true,
    loginRegisterAutoHeight: true
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Layout = /*#__PURE__*/function () {
    function Layout(element, config) {
      this._config = config;
      this._element = element;

      this._init();
    } // Public


    var _proto = Layout.prototype;

    _proto.fixLayoutHeight = function fixLayoutHeight(extra) {
      if (extra === void 0) {
        extra = null;
      }

      var $body = $('body');
      var controlSidebar = 0;

      if ($body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE_OPEN) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN$1) || extra === 'control_sidebar') {
        controlSidebar = $(SELECTOR_CONTROL_SIDEBAR_CONTENT$1).height();
      }

      var heights = {
        window: $(window).height(),
        header: $(SELECTOR_HEADER$2).length !== 0 ? $(SELECTOR_HEADER$2).outerHeight() : 0,
        footer: $(SELECTOR_FOOTER$1).length !== 0 ? $(SELECTOR_FOOTER$1).outerHeight() : 0,
        sidebar: $(SELECTOR_SIDEBAR).length !== 0 ? $(SELECTOR_SIDEBAR).height() : 0,
        controlSidebar: controlSidebar
      };

      var max = this._max(heights);

      var offset = this._config.panelAutoHeight;

      if (offset === true) {
        offset = 0;
      }

      var $contentSelector = $(SELECTOR_CONTENT);

      if (offset !== false) {
        if (max === heights.controlSidebar) {
          $contentSelector.css('min-height', max + offset);
        } else if (max === heights.window) {
          $contentSelector.css('min-height', max + offset - heights.header - heights.footer);
        } else {
          $contentSelector.css('min-height', max + offset - heights.header);
        }

        if (this._isFooterFixed()) {
          $contentSelector.css('min-height', parseFloat($contentSelector.css('min-height')) + heights.footer);
        }
      }

      if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED$1)) {
        return;
      }

      if (offset !== false) {
        $contentSelector.css('min-height', max + offset - heights.header - heights.footer);
      }

      if (typeof $.fn.overlayScrollbars !== 'undefined') {
        $(SELECTOR_SIDEBAR).overlayScrollbars({
          className: this._config.scrollbarTheme,
          sizeAutoCapable: true,
          scrollbars: {
            autoHide: this._config.scrollbarAutoHide,
            clickScrolling: true
          }
        });
      }
    };

    _proto.fixLoginRegisterHeight = function fixLoginRegisterHeight() {
      var $body = $('body');
      var $selector = $(SELECTOR_LOGIN_BOX + ", " + SELECTOR_REGISTER_BOX);

      if ($selector.length === 0) {
        $body.css('height', 'auto');
        $('html').css('height', 'auto');
      } else {
        var boxHeight = $selector.height();

        if ($body.css('min-height') !== boxHeight) {
          $body.css('min-height', boxHeight);
        }
      }
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      // Activate layout height watcher
      this.fixLayoutHeight();

      if (this._config.loginRegisterAutoHeight === true) {
        this.fixLoginRegisterHeight();
      } else if (this._config.loginRegisterAutoHeight === parseInt(this._config.loginRegisterAutoHeight, 10)) {
        setInterval(this.fixLoginRegisterHeight, this._config.loginRegisterAutoHeight);
      }

      $(SELECTOR_SIDEBAR).on('collapsed.lte.treeview expanded.lte.treeview', function () {
        _this.fixLayoutHeight();
      });
      $(SELECTOR_PUSHMENU_BTN).on('collapsed.lte.pushmenu shown.lte.pushmenu', function () {
        _this.fixLayoutHeight();
      });
      $(SELECTOR_CONTROL_SIDEBAR_BTN).on('collapsed.lte.controlsidebar', function () {
        _this.fixLayoutHeight();
      }).on('expanded.lte.controlsidebar', function () {
        _this.fixLayoutHeight('control_sidebar');
      });
      $(window).resize(function () {
        _this.fixLayoutHeight();
      });
      setTimeout(function () {
        $('body.hold-transition').removeClass('hold-transition');
      }, 50);
    };

    _proto._max = function _max(numbers) {
      // Calculate the maximum number in a list
      var max = 0;
      Object.keys(numbers).forEach(function (key) {
        if (numbers[key] > max) {
          max = numbers[key];
        }
      });
      return max;
    };

    _proto._isFooterFixed = function _isFooterFixed() {
      return $(SELECTOR_FOOTER$1).css('position') === 'fixed';
    } // Static
    ;

    Layout._jQueryInterface = function _jQueryInterface(config) {
      if (config === void 0) {
        config = '';
      }

      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);

        var _options = $.extend({}, Default$4, $(this).data());

        if (!data) {
          data = new Layout($(this), _options);
          $(this).data(DATA_KEY$6, data);
        }

        if (config === 'init' || config === '') {
          data._init();
        } else if (config === 'fixLayoutHeight' || config === 'fixLoginRegisterHeight') {
          data[config]();
        }
      });
    };

    return Layout;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(window).on('load', function () {
    Layout._jQueryInterface.call($('body'));
  });
  $(SELECTOR_SIDEBAR + " a").on('focusin', function () {
    $(SELECTOR_MAIN_SIDEBAR).addClass(CLASS_NAME_SIDEBAR_FOCUSED);
  });
  $(SELECTOR_SIDEBAR + " a").on('focusout', function () {
    $(SELECTOR_MAIN_SIDEBAR).removeClass(CLASS_NAME_SIDEBAR_FOCUSED);
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$6] = Layout._jQueryInterface;
  $.fn[NAME$6].Constructor = Layout;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Layout._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE PushMenu.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$7 = 'PushMenu';
  var DATA_KEY$7 = 'lte.pushmenu';
  var EVENT_KEY$5 = "." + DATA_KEY$7;
  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  var EVENT_COLLAPSED$3 = "collapsed" + EVENT_KEY$5;
  var EVENT_SHOWN = "shown" + EVENT_KEY$5;
  var SELECTOR_TOGGLE_BUTTON = '[data-widget="pushmenu"]';
  var SELECTOR_BODY = 'body';
  var SELECTOR_OVERLAY = '#sidebar-overlay';
  var SELECTOR_WRAPPER = '.wrapper';
  var CLASS_NAME_COLLAPSED$1 = 'sidebar-collapse';
  var CLASS_NAME_OPEN = 'sidebar-open';
  var CLASS_NAME_IS_OPENING = 'sidebar-is-opening';
  var CLASS_NAME_CLOSED = 'sidebar-closed';
  var Default$5 = {
    autoCollapseSize: 992,
    enableRemember: false,
    noTransitionAfterReload: true
  };
  /**
   * Class Definition
   * ====================================================
   */

  var PushMenu = /*#__PURE__*/function () {
    function PushMenu(element, options) {
      this._element = element;
      this._options = $.extend({}, Default$5, options);

      if ($(SELECTOR_OVERLAY).length === 0) {
        this._addOverlay();
      }

      this._init();
    } // Public


    var _proto = PushMenu.prototype;

    _proto.expand = function expand() {
      var $bodySelector = $(SELECTOR_BODY);

      if (this._options.autoCollapseSize) {
        if ($(window).width() <= this._options.autoCollapseSize) {
          $bodySelector.addClass(CLASS_NAME_OPEN);
        }
      }

      $bodySelector.addClass(CLASS_NAME_IS_OPENING).removeClass(CLASS_NAME_COLLAPSED$1 + " " + CLASS_NAME_CLOSED);

      if (this._options.enableRemember) {
        localStorage.setItem("remember" + EVENT_KEY$5, CLASS_NAME_OPEN);
      }

      $(this._element).trigger($.Event(EVENT_SHOWN));
    };

    _proto.collapse = function collapse() {
      var $bodySelector = $(SELECTOR_BODY);

      if (this._options.autoCollapseSize) {
        if ($(window).width() <= this._options.autoCollapseSize) {
          $bodySelector.removeClass(CLASS_NAME_OPEN).addClass(CLASS_NAME_CLOSED);
        }
      }

      $bodySelector.removeClass(CLASS_NAME_IS_OPENING).addClass(CLASS_NAME_COLLAPSED$1);

      if (this._options.enableRemember) {
        localStorage.setItem("remember" + EVENT_KEY$5, CLASS_NAME_COLLAPSED$1);
      }

      $(this._element).trigger($.Event(EVENT_COLLAPSED$3));
    };

    _proto.toggle = function toggle() {
      if ($(SELECTOR_BODY).hasClass(CLASS_NAME_COLLAPSED$1)) {
        this.expand();
      } else {
        this.collapse();
      }
    };

    _proto.autoCollapse = function autoCollapse(resize) {
      if (resize === void 0) {
        resize = false;
      }

      if (!this._options.autoCollapseSize) {
        return;
      }

      var $bodySelector = $(SELECTOR_BODY);

      if ($(window).width() <= this._options.autoCollapseSize) {
        if (!$bodySelector.hasClass(CLASS_NAME_OPEN)) {
          this.collapse();
        }
      } else if (resize === true) {
        if ($bodySelector.hasClass(CLASS_NAME_OPEN)) {
          $bodySelector.removeClass(CLASS_NAME_OPEN);
        } else if ($bodySelector.hasClass(CLASS_NAME_CLOSED)) {
          this.expand();
        }
      }
    };

    _proto.remember = function remember() {
      if (!this._options.enableRemember) {
        return;
      }

      var $body = $('body');
      var toggleState = localStorage.getItem("remember" + EVENT_KEY$5);

      if (toggleState === CLASS_NAME_COLLAPSED$1) {
        if (this._options.noTransitionAfterReload) {
          $body.addClass('hold-transition').addClass(CLASS_NAME_COLLAPSED$1).delay(50).queue(function () {
            $(this).removeClass('hold-transition');
            $(this).dequeue();
          });
        } else {
          $body.addClass(CLASS_NAME_COLLAPSED$1);
        }
      } else if (this._options.noTransitionAfterReload) {
        $body.addClass('hold-transition').removeClass(CLASS_NAME_COLLAPSED$1).delay(50).queue(function () {
          $(this).removeClass('hold-transition');
          $(this).dequeue();
        });
      } else {
        $body.removeClass(CLASS_NAME_COLLAPSED$1);
      }
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      this.remember();
      this.autoCollapse();
      $(window).resize(function () {
        _this.autoCollapse(true);
      });
    };

    _proto._addOverlay = function _addOverlay() {
      var _this2 = this;

      var overlay = $('<div />', {
        id: 'sidebar-overlay'
      });
      overlay.on('click', function () {
        _this2.collapse();
      });
      $(SELECTOR_WRAPPER).append(overlay);
    } // Static
    ;

    PushMenu._jQueryInterface = function _jQueryInterface(operation) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);

        var _options = $.extend({}, Default$5, $(this).data());

        if (!data) {
          data = new PushMenu(this, _options);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof operation === 'string' && operation.match(/collapse|expand|toggle/)) {
          data[operation]();
        }
      });
    };

    return PushMenu;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(document).on('click', SELECTOR_TOGGLE_BUTTON, function (event) {
    event.preventDefault();
    var button = event.currentTarget;

    if ($(button).data('widget') !== 'pushmenu') {
      button = $(button).closest(SELECTOR_TOGGLE_BUTTON);
    }

    PushMenu._jQueryInterface.call($(button), 'toggle');
  });
  $(window).on('load', function () {
    PushMenu._jQueryInterface.call($(SELECTOR_TOGGLE_BUTTON));
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$7] = PushMenu._jQueryInterface;
  $.fn[NAME$7].Constructor = PushMenu;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return PushMenu._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Toasts.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$8 = 'Toasts';
  var DATA_KEY$8 = 'lte.toasts';
  var EVENT_KEY$6 = "." + DATA_KEY$8;
  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  var EVENT_INIT = "init" + EVENT_KEY$6;
  var EVENT_CREATED = "created" + EVENT_KEY$6;
  var EVENT_REMOVED$1 = "removed" + EVENT_KEY$6;
  var SELECTOR_CONTAINER_TOP_LEFT = '#toastsContainerTopleft';
  var SELECTOR_CONTAINER_TOP_RIGHT = '#toastsContainerTopright';
  var SELECTOR_CONTAINER_BOTTOM_LEFT = '#toastsContainerBottomleft';
  var SELECTOR_CONTAINER_BOTTOM_RIGHT = '#TOASTSCONTAINERBOTTOMRIGHt';
  var CLASS_NAME_TOP_LEFT = 'toasts-top-left';
  var CLASS_NAME_TOP_RIGHT = 'toasts-top-right';
  var CLASS_NAME_BOTTOM_LEFT = 'toasts-bottom-left';
  var CLASS_NAME_BOTTOM_RIGHT = 'toasts-bottom-right';
  var POSITION_TOP_LEFT = 'TOPLEft';
  var POSITION_TOP_RIGHT = 'TOPRight';
  var POSITION_BOTTOM_LEFT = 'bottomleft';
  var POSITION_BOTTOM_RIGHT = 'bottomright';
  var Default$6 = {
    position: POSITION_TOP_LEFT,
    fixed: true,
    autohide: false,
    autoremove: true,
    delay: 1000,
    fade: true,
    icon: null,
    image: null,
    imageAlt: null,
    imageHeight: '25px',
    title: null,
    subtitle: null,
    close: true,
    body: null,
    class: null
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Toasts = /*#__PURE__*/function () {
    function Toasts(element, config) {
      this._config = config;

      this._prepareContainer();

      $('body').trigger($.Event(EVENT_INIT));
    } // Public


    var _proto = Toasts.prototype;

    _proto.create = function create() {
      var toast = $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"/>');
      toast.data('autohide', this._config.autohide);
      toast.data('animation', this._config.fade);

      if (this._config.class) {
        toast.addClass(this._config.class);
      }

      if (this._config.delay && this._config.delay != 500) {
        toast.data('delay', this._config.delay);
      }

      var toastHeader = $('<div class="toast-header">');

      if (this._config.image != null) {
        var toastImage = $('<img />').addClass('rounded mr-2').attr('src', this._config.image).attr('alt', this._config.imageAlt);

        if (this._config.imageHeight != null) {
          toastImage.height(this._config.imageHeight).width('auto');
        }

        toastHeader.append(toastImage);
      }

      if (this._config.icon != null) {
        toastHeader.append($('<i />').addClass('mr-2').addClass(this._config.icon));
      }

      if (this._config.title != null) {
        toastHeader.append($('<strong />').addClass('mr-auto').html(this._config.title));
      }

      if (this._config.subtitle != null) {
        toastHeader.append($('<small />').html(this._config.subtitle));
      }

      if (this._config.close == true) {
        var toastClose = $('<button data-dismiss="toast" />').attr('type', 'button').addClass('ml-2 mb-1 close').attr('aria-label', 'Close').append('<span aria-hidden="true">&times;</span>');

        if (this._config.title == null) {
          toastClose.toggleClass('ml-2 ml-auto');
        }

        toastHeader.append(toastClose);
      }

      toast.append(toastHeader);

      if (this._config.body != null) {
        toast.append($('<div class="toast-body" />').html(this._config.body));
      }

      $(this._getContainerId()).prepend(toast);
      var $body = $('body');
      $body.trigger($.Event(EVENT_CREATED));
      toast.toast('show');

      if (this._config.autoremove) {
        toast.on('hidden.bs.toast', function () {
          $(this).delay(200).remove();
          $body.trigger($.Event(EVENT_REMOVED$1));
        });
      }
    } // Static
    ;

    _proto._getContainerId = function _getContainerId() {
      if (this._config.position == POSITION_TOP_LEFT) {
        return SELECTOR_CONTAINER_TOP_LEFT;
      }

      if (this._config.position == POSITION_TOP_RIGHT) {
        return SELECTOR_CONTAINER_TOP_RIGHT;
      }

      if (this._config.position == POSITION_BOTTOM_LEFT) {
        return SELECTOR_CONTAINER_BOTTOM_LEFT;
      }

      if (this._config.position == POSITION_BOTTOM_RIGHT) {
        return SELECTOR_CONTAINER_BOTTOM_RIGHT;
      }
    };

    _proto._prepareContainer = function _prepareContainer() {
      if ($(this._getContainerId()).length === 0) {
        var container = $('<div />').attr('id', this._getContainerId().replace('#', ''));

        if (this._config.position == POSITION_TOP_LEFT) {
          container.addClass(CLASS_NAME_TOP_LEFT);
        } else if (this._config.position == POSITION_TOP_RIGHT) {
          container.addClass(CLASS_NAME_TOP_RIGHT);
        } else if (this._config.position == POSITION_BOTTOM_LEFT) {
          container.addClass(CLASS_NAME_BOTTOM_LEFT);
        } else if (this._config.position == POSITION_BOTTOM_RIGHT) {
          container.addClass(CLASS_NAME_BOTTOM_RIGHT);
        }

        $('body').append(container);
      }

      if (this._config.fixed) {
        $(this._getContainerId()).addClass('fixed');
      } else {
        $(this._getContainerId()).removeClass('fixed');
      }
    } // Static
    ;

    Toasts._jQueryInterface = function _jQueryInterface(option, config) {
      return this.each(function () {
        var _options = $.extend({}, Default$6, config);

        var toast = new Toasts($(this), _options);

        if (option === 'create') {
          toast[option]();
        }
      });
    };

    return Toasts;
  }();
  /**
   * jQuery API
   * ====================================================
   */


  $.fn[NAME$8] = Toasts._jQueryInterface;
  $.fn[NAME$8].Constructor = Toasts;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return Toasts._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE TodoList.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$9 = 'TodoList';
  var DATA_KEY$9 = 'lte.todolist';
  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  var SELECTOR_DATA_TOGGLE$2 = '[data-widget="todo-list"]';
  var CLASS_NAME_TODO_LIST_DONE = 'done';
  var Default$7 = {
    onCheck: function onCheck(item) {
      return item;
    },
    onUnCheck: function onUnCheck(item) {
      return item;
    }
  };
  /**
   * Class Definition
   * ====================================================
   */

  var TodoList = /*#__PURE__*/function () {
    function TodoList(element, config) {
      this._config = config;
      this._element = element;

      this._init();
    } // Public


    var _proto = TodoList.prototype;

    _proto.toggle = function toggle(item) {
      item.parents('li').toggleClass(CLASS_NAME_TODO_LIST_DONE);

      if (!$(item).prop('checked')) {
        this.unCheck($(item));
        return;
      }

      this.check(item);
    };

    _proto.check = function check(item) {
      this._config.onCheck.call(item);
    };

    _proto.unCheck = function unCheck(item) {
      this._config.onUnCheck.call(item);
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      var $toggleSelector = $(SELECTOR_DATA_TOGGLE$2);
      $toggleSelector.find('input:checkbox:checked').parents('li').toggleClass(CLASS_NAME_TODO_LIST_DONE);
      $toggleSelector.on('change', 'input:checkbox', function (event) {
        _this.toggle($(event.target));
      });
    } // Static
    ;

    TodoList._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$9);

        var _options = $.extend({}, Default$7, $(this).data());

        if (!data) {
          data = new TodoList($(this), _options);
          $(this).data(DATA_KEY$9, data);
        }

        if (config === 'init') {
          data[config]();
        }
      });
    };

    return TodoList;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(window).on('load', function () {
    TodoList._jQueryInterface.call($(SELECTOR_DATA_TOGGLE$2));
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$9] = TodoList._jQueryInterface;
  $.fn[NAME$9].Constructor = TodoList;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return TodoList._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Treeview.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$a = 'Treeview';
  var DATA_KEY$a = 'lte.treeview';
  var EVENT_KEY$7 = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var EVENT_EXPANDED$3 = "expanded" + EVENT_KEY$7;
  var EVENT_COLLAPSED$4 = "collapsed" + EVENT_KEY$7;
  var EVENT_LOAD_DATA_API = "load" + EVENT_KEY$7;
  var SELECTOR_LI = '.nav-item';
  var SELECTOR_LINK = '.nav-link';
  var SELECTOR_TREEVIEW_MENU = '.nav-treeview';
  var SELECTOR_OPEN = '.menu-open';
  var SELECTOR_DATA_WIDGET = '[data-widget="treeview"]';
  var CLASS_NAME_OPEN$1 = 'menu-open';
  var CLASS_NAME_IS_OPENING$1 = 'menu-is-opening';
  var CLASS_NAME_SIDEBAR_COLLAPSED = 'sidebar-collapse';
  var Default$8 = {
    trigger: SELECTOR_DATA_WIDGET + " " + SELECTOR_LINK,
    animationSpeed: 300,
    accordion: true,
    expandSidebar: false,
    sidebarButtonSelector: '[data-widget="pushmenu"]'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Treeview = /*#__PURE__*/function () {
    function Treeview(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = Treeview.prototype;

    _proto.init = function init() {
      $("" + SELECTOR_LI + SELECTOR_OPEN + " " + SELECTOR_TREEVIEW_MENU).css('display', 'block');

      this._setupListeners();
    };

    _proto.expand = function expand(treeviewMenu, parentLi) {
      var _this = this;

      var expandedEvent = $.Event(EVENT_EXPANDED$3);

      if (this._config.accordion) {
        var openMenuLi = parentLi.siblings(SELECTOR_OPEN).first();
        var openTreeview = openMenuLi.find(SELECTOR_TREEVIEW_MENU).first();
        this.collapse(openTreeview, openMenuLi);
      }

      parentLi.addClass(CLASS_NAME_IS_OPENING$1);
      treeviewMenu.stop().slideDown(this._config.animationSpeed, function () {
        parentLi.addClass(CLASS_NAME_OPEN$1);
        $(_this._element).trigger(expandedEvent);
      });

      if (this._config.expandSidebar) {
        this._expandSidebar();
      }
    };

    _proto.collapse = function collapse(treeviewMenu, parentLi) {
      var _this2 = this;

      var collapsedEvent = $.Event(EVENT_COLLAPSED$4);
      parentLi.removeClass(CLASS_NAME_IS_OPENING$1 + " " + CLASS_NAME_OPEN$1);
      treeviewMenu.stop().slideUp(this._config.animationSpeed, function () {
        $(_this2._element).trigger(collapsedEvent);
        treeviewMenu.find(SELECTOR_OPEN + " > " + SELECTOR_TREEVIEW_MENU).slideUp();
        treeviewMenu.find(SELECTOR_OPEN).removeClass(CLASS_NAME_OPEN$1);
      });
    };

    _proto.toggle = function toggle(event) {
      var $relativeTarget = $(event.currentTarget);
      var $parent = $relativeTarget.parent();
      var treeviewMenu = $parent.find("> " + SELECTOR_TREEVIEW_MENU);

      if (!treeviewMenu.is(SELECTOR_TREEVIEW_MENU)) {
        if (!$parent.is(SELECTOR_LI)) {
          treeviewMenu = $parent.parent().find("> " + SELECTOR_TREEVIEW_MENU);
        }

        if (!treeviewMenu.is(SELECTOR_TREEVIEW_MENU)) {
          return;
        }
      }

      event.preventDefault();
      var parentLi = $relativeTarget.parents(SELECTOR_LI).first();
      var isOpen = parentLi.hasClass(CLASS_NAME_OPEN$1);

      if (isOpen) {
        this.collapse($(treeviewMenu), parentLi);
      } else {
        this.expand($(treeviewMenu), parentLi);
      }
    } // Private
    ;

    _proto._setupListeners = function _setupListeners() {
      var _this3 = this;

      $(document).on('click', this._config.trigger, function (event) {
        _this3.toggle(event);
      });
    };

    _proto._expandSidebar = function _expandSidebar() {
      if ($('body').hasClass(CLASS_NAME_SIDEBAR_COLLAPSED)) {
        $(this._config.sidebarButtonSelector).PushMenu('expand');
      }
    } // Static
    ;

    Treeview._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$a);

        var _options = $.extend({}, Default$8, $(this).data());

        if (!data) {
          data = new Treeview($(this), _options);
          $(this).data(DATA_KEY$a, data);
        }

        if (config === 'init') {
          data[config]();
        }
      });
    };

    return Treeview;
  }();
  /**
   * Data API
   * ====================================================
   */


  $(window).on(EVENT_LOAD_DATA_API, function () {
    $(SELECTOR_DATA_WIDGET).each(function () {
      Treeview._jQueryInterface.call($(this), 'init');
    });
  });
  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME$a] = Treeview._jQueryInterface;
  $.fn[NAME$a].Constructor = Treeview;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Treeview._jQueryInterface;
  };

  exports.CardRefresh = CardRefresh;
  exports.CardWidget = CardWidget;
  exports.ControlSidebar = ControlSidebar;
  exports.DirectChat = DirectChat;
  exports.Dropdown = Dropdown;
  exports.ExpandableTable = ExpandableTable;
  exports.Layout = Layout;
  exports.PushMenu = PushMenu;
  exports.Toasts = Toasts;
  exports.TodoList = TodoList;
  exports.Treeview = Treeview;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=adminlte.js.map
