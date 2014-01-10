;(function (window, document, undefined) {
  // Underscore implementation of _.defaults
  // https://github.com/jashkenas/underscore/blob/master/underscore.js#L863
  var mergeDefaults = function(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0 ) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  var defaults = {
    /**
     * Duration to show the notification
     */
    duration: 2500,
    /**
     * Class to add to the generated markup
     */
    class: 'notification',
    /**
     * Parent element to attach notification to
     * @returns {*|HTMLElement}
     */
    parent: function () {
      return document.body;
    },
    /**
     * Type of notification
     * This is the class name that is attached to the element upon creation
     * Intended to be used to control visual clues as to what type of notification
     * is shown.
     */
    type: 'success',
    /**
     * If true notification can be hidden on tap/click
     */
    tapToClose: false,
    /**
     * If true notification is shown immediatley
     */
    show: true,
    /**
     * Duration to delay the destruction of the DOM element created for the notification
     * If you animation is longer than the default increase this time accordingly
     */
    destroyAfter: 500
  };

  /**
   * Simple notification alert meant to be used with PhoneGap apps
   * @param text Text content of the notification
   * @param options Notification Options
   * @constructor
   */

  function Notification(text, options) {
    if (!(this instanceof Notification)) return new Notification(text, options);

    (options = options || {});

    this.options = mergeDefaults(options, defaults);

    this.el = document.createElement('div');
    this.textNode = document.createTextNode((text && typeof text !== 'object') ? text : '');
    this.el.appendChild(this.textNode);

    this.el.classList.add(this.options.class, this.options.type);

    this.parent = typeof this.options.parent === 'function' ? this.options.parent() : this.options.parent;

    this.hideHandler = this.hide.bind(this);

    this.parent.appendChild(this.el);

    this.init();
  }

  Notification.prototype = {
    constructor: Notification,
    /**
     * Notification entry point
     */
    init: function () {
      this._setupEvents();

      if (this.options.show) {
        // For iOS we need to wait for the current stack to clear
        // or the initial animation will not run
        setTimeout(this.show.bind(this), 1);
      }
    },

    /**
     * Show the notification manually
     * @returns {Notification}
     */
    show: function () {
      this.el.classList.add('show');

      if (!this.options.tapToClose) setTimeout(this.hide.bind(this), this.options.duration);

      return this;
    },

    /**
     * Hide the notification manually
     * @returns {Notification}
     */
    hide: function () {
      this.el.classList.remove('show');

      setTimeout(this.destroy.bind(this), this.options.destroyAfter);

      return this;
    },

    /**
     * Destroy and remove all attached events manually
     */
    destroy: function () {
      this._destroyEvents();

      this.parent.removeChild(this.el);
    },

    /**
     * Setup and attach events to the notification
     * @returns {Notification}
     * @private
     */
    _setupEvents: function () {
      if (this.options.tapToClose) this.el.addEventListener('touchstart', this.hideHandler);

      return this;
    },

    /**
     * Remove attached events from the notification
     * @returns {Notification}
     * @private
     */
    _destroyEvents: function () {
      this.el.removeEventListener('touchstart', this.hideHandler);

      return this;
    }
  };

  window.Notification = Notification;

})(window, document);