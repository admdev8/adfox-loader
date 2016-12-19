'use strict';

/**
 * Created by m.chekryshov on 23.11.15.
 */


/**
 * Provides interface to load/reload banners, banner loaded - callback
 *
 * Works for libs:
 *
 * "//ssp.rambler.ru/lpdid.js" + ( "//ssp.rambler.ru/capirs_async.js" || "//ssp.rambler.ru/capirs.js"  )
 *
 * See more at https://confluence.rambler-co.ru/pages/viewpage.action?pageId=27337323
 *
 */
(function(window) {
  var CONTAINER_CLASS = 'js-adfox';
  var CONTAINER_SELECTOR = '.' + CONTAINER_CLASS;
  var LOADED_CLASS = 'loaded';


  setBegunCallbacks();

  if (window.AdfoxLoader) {
    return;
  }

  var LoadingMethods = {
    'show': 'ssp',
    'showPostpone': 'ssp',
    'showOnScroll': 'sspScroll',
    'showOnScrollPostpone': 'sspScroll',
    'loadRich': 'sspRich',
    'unknown': 'ssp'
  };

  window.AdfoxLoader = {

    /**
     * Used when we trying to load banner before lib was loaded
     */
    bannersLoadingQueue: [],

    /**
     * Init or immediately load banner for supplied container. And provide some functionality,
     * for example reload method
     * @param {String} containerId
     * @param {Object} options - ad
     * @param {Object} optionsB - begun options
     * @param {String} [loadingMethodParam]
     * @param {Function} [onBannerLoaded= ()=>{}] - onBannerLoadedCallback
     */
    init: function(containerId, options, optionsB, loadingMethodParam, onBannerLoadedCallback) {
      var loadingMethod = LoadingMethods.hasOwnProperty(loadingMethodParam) ? loadingMethodParam : 'unknown';

      var montblancMethod = LoadingMethods[loadingMethod];

      var container = document.getElementById(containerId);

      if (!container) {
        log('error', 'Container not found. #' + containerId);
        return;
      }

      addClass(container, CONTAINER_CLASS);

      removeClass(container, LOADED_CLASS);

      container.onBannerLoaded = onBannerLoadedCallback || container.onBannerLoaded ||
          function() {
            // This stub can be overwritten by customer side
          };

      container.loadBanner = function() {
        var _load = function() {
          try {
            montblancMethod === LoadingMethods.loadRich
                ? Adf.banner.loadRich(container.id, options, optionsB)
                : Adf.banner[montblancMethod](container.id, options, optionsB);
          } catch (e) {
            console.error(e);
          }
        };

        window.AdfoxLoader.waitLib()
            ? window.AdfoxLoader.bannersLoadingQueue.push(_load)
            : _load();
      };

      container.reloadBanner = function() {
        if (window.AdfoxLoader.waitLib()) {
          log('warn', 'reloadBanner was fired but lib was not loaded. For #' + container.id);
          return;
        }

        try {
          // We need to use closure because some advertisements scripts can override ID of container
          Adf.banner.reloadssp(container.id, options, optionsB);
        } catch (e) {
          console.error(e);
        }
      };

      if (loadingMethod.length && loadingMethod.indexOf('Postpone') === -1) {
        // first time loading
        container.loadBanner();
      }
    },

    waitLib: function() {
      return !!!(window.Adf && window.Adf.banner);
    },

    /**
     * Need to reload banners in some cases
     */
    refreshPrKey: function() {
      var prOld = window.Adf.banner.pr;
      do {
        window.Adf.banner.pr = getRandomInt(100000000, 999999999); // nine digits
      } while (window.Adf.banner.pr === prOld);
    }
  };

  function addClass(targetEl, className) {
    var re = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
    if (re.test(targetEl.className)) {
      return;
    }
    targetEl.className = (targetEl.className + ' ' + className).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
  }

  function removeClass(o, c) {
    o.classList.remove(c);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function hasClass(targetEl, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(targetEl.className);
  }

  function setBegunCallbacks() {
    window.begun_callbacks = {
      block: {
        draw: onBeforeDraw
      },
      lib: {
        init: onLibReady
      }
    };
  }

  /**
   * This callback fired after library was
   * For more information see https://confluence.rambler-co.ru/pages/viewpage.action?pageId=27337323
   */
  function onLibReady() {
    var queue = window.AdfoxLoader.bannersLoadingQueue;

    while (queue.length) {
      var loadFunc = queue.pop();
      loadFunc();
    }
  }

  /**
   * This callback fired when ads place was sold and banner will be loaded 100%.
   * For more information see https://jira.rambler-co.ru/browse/SSP-434.
   */
  function onBeforeDraw() {
    const containerEl = closest(this, CONTAINER_SELECTOR);

    'use strict';

    /**
     * Created by m.chekryshov on 23.11.15.
     */


    /**
     * Provides interface to load/reload banners, banner loaded - callback
     *
     * Works for libs:
     *
     * "//ssp.rambler.ru/lpdid.js" + ( "//ssp.rambler.ru/capirs_async.js" || "//ssp.rambler.ru/capirs.js"  )
     *
     * See more at https://confluence.rambler-co.ru/pages/viewpage.action?pageId=27337323
     *
     */
    (function(window) {
      var CONTAINER_CLASS = 'js-adfox';
      var CONTAINER_SELECTOR = '.' + CONTAINER_CLASS;
      var LOADED_CLASS = 'loaded';


      setBegunCallbacks();

      if (window.AdfoxLoader) {
        return;
      }

      var LoadingMethods = {
        'show': 'ssp',
        'showPostpone': 'ssp',
        'showOnScroll': 'sspScroll',
        'showOnScrollPostpone': 'sspScroll',
        'loadRich': 'sspRich',
        'unknown': 'ssp'
      };

      window.AdfoxLoader = {

        /**
         * Used when we trying to load banner before lib was loaded
         */
        bannersLoadingQueue: [],

        /**
         * Init or immediately load banner for supplied container. And provide some functionality,
         * for example reload method
         * @param {String} containerId
         * @param {Object} options - ad
         * @param {Object} optionsB - begun options
         * @param {String} [loadingMethodParam]
         * @param {Function} [onBannerLoaded= ()=>{}] - onBannerLoadedCallback
         */
        init: function(containerId, options, optionsB, loadingMethodParam, onBannerLoadedCallback) {
          var loadingMethod = LoadingMethods.hasOwnProperty(loadingMethodParam) ? loadingMethodParam : 'unknown';

          var montblancMethod = LoadingMethods[loadingMethod];

          var container = document.getElementById(containerId);

          if (!container) {
            log('error', 'Container not found. #' + containerId);
            return;
          }

          addClass(container, CONTAINER_CLASS);

          removeClass(container, LOADED_CLASS);

          container.onBannerLoaded = onBannerLoadedCallback || container.onBannerLoaded ||
              function() {
                // This stub can be overwritten by customer side
              };

          container.loadBanner = function() {
            var _load = function() {
              try {
                montblancMethod === LoadingMethods.loadRich
                    ? Adf.banner.loadRich(container.id, options, optionsB)
                    : Adf.banner[montblancMethod](container.id, options, optionsB);
              } catch (e) {
                console.error(e);
              }
            };

            window.AdfoxLoader.waitLib()
                ? window.AdfoxLoader.bannersLoadingQueue.push(_load)
                : _load();
          };

          container.reloadBanner = function() {
            if (window.AdfoxLoader.waitLib()) {
              log('warn', 'reloadBanner was fired but lib was not loaded. For #' + container.id);
              return;
            }

            try {
              // We need to use closure because some advertisements scripts can override ID of container
              Adf.banner.reloadssp(container.id, options, optionsB);
            } catch (e) {
              console.error(e);
            }
          };

          if (loadingMethod.length && loadingMethod.indexOf('Postpone') === -1) {
            // first time loading
            container.loadBanner();
          }
        },

        waitLib: function() {
          return !!!(window.Adf && window.Adf.banner);
        },

        /**
         * Need to reload banners in some cases
         */
        refreshPrKey: function() {
          var prOld = window.Adf.banner.pr;
          do {
            window.Adf.banner.pr = getRandomInt(100000000, 999999999); // nine digits
          } while (window.Adf.banner.pr === prOld);
        }
      };

      function addClass(targetEl, className) {
        var re = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
        if (re.test(targetEl.className)) {
          return;
        }
        targetEl.className = (targetEl.className + ' ' + className).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
      }

      function removeClass(o, c) {
        o.classList.remove(c);
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function hasClass(targetEl, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(targetEl.className);
      }

      function setBegunCallbacks() {
        window.begun_callbacks = {
          block: {
            draw: onBeforeDraw
          },
          lib: {
            init: onLibReady
          }
        };
      }

      /**
       * This callback fired after library was
       * For more information see https://confluence.rambler-co.ru/pages/viewpage.action?pageId=27337323
       */
      function onLibReady() {
        var queue = window.AdfoxLoader.bannersLoadingQueue;

        while (queue.length) {
          var loadFunc = queue.pop();
          loadFunc();
        }
      }

      function log(method, message) {
        console[method]('AdfoxLoader: ' + message);
      }

      /**
       * This callback fired when ads place was sold and banner will be loaded 100%.
       * For more information see https://jira.rambler-co.ru/browse/SSP-434.
       */
      function onBeforeDraw() {
        const containerEl = closest(this, CONTAINER_SELECTOR);

        if (!containerEl) {
          log('error', 'Can not find container for #' + this.id);
          return;
        }

        addClass(containerEl, LOADED_CLASS);

        if (!containerEl.onBannerLoaded) {
          log('warn', 'onBannerLoaded callback not defined. Please use method AdfoxLoader.init for all banners.');
          return;
        }

        containerEl.onBannerLoaded();
      }

      function closest(targetEl, selector) {
        var node = targetEl;

        while (node) {
          if (node.matches(selector)) {
            return node;
          }
          node = node.parentElement;
        }
        return null;
      }
    })(window);


    addClass(containerEl, LOADED_CLASS);

    if (!containerEl.onBannerLoaded) {
      log('warn', 'onBannerLoaded callback not defined. Please use method AdfoxLoader.init for all banners.');
      return;
    }

    containerEl.onBannerLoaded();
  }

  function closest(targetEl, selector) {
    var node = targetEl;

    while (node) {
      if (node.matches(selector)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }
})(window);
