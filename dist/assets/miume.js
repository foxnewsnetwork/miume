/* jshint ignore:start */

/* jshint ignore:end */

define('miume/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	var ApplicationAdapter;

	ApplicationAdapter = DS['default'].RESTAdapter.extend();

	exports['default'] = ApplicationAdapter;

});
define('miume/adapters/youtube', ['exports', 'ember-youtube-data-model/adapters/youtube'], function (exports, YoutubeAdapter) {

	'use strict';

	exports['default'] = YoutubeAdapter['default'];

});
define('miume/adapters/youtube/channel', ['exports', 'ember-youtube-data-model/adapters/youtube/channel'], function (exports, YoutubeChannelAdapter) {

	'use strict';

	exports['default'] = YoutubeChannelAdapter['default'];

});
define('miume/adapters/youtube/playlist', ['exports', 'ember-youtube-data-model/adapters/youtube/playlist'], function (exports, YoutubePlaylistAdapter) {

	'use strict';

	exports['default'] = YoutubePlaylistAdapter['default'];

});
define('miume/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'miume/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('miume/components/async-button', ['exports', 'ember-cli-async-button/components/async-button'], function (exports, AsyncButtonComponent) {

	'use strict';

	exports['default'] = AsyncButtonComponent['default'];

});
define('miume/components/lazy-scroll-load', ['exports', 'ember', 'miume/utils/fun-ex'], function (exports, Ember, FunEx) {

  'use strict';

  var LazyScrollLoadComponent, lll;

  lll = function(x) {
    console.log(x);
    return x;
  };

  LazyScrollLoadComponent = Ember['default'].Component.extend({
    classNames: ['lazy-scroll-load'],
    scrollParent: 'body',
    classNameBindings: ["shouldLoadContent:visible:invisible", "isBefore:before", "isAfter:after"],
    overlap: 200,
    sp$: FunEx['default'].computed("scrollParent", function() {
      return $(this.get('scrollParent'));
    }),
    didInsertElement: function() {
      var check, slowly;
      this.decideRenderability();
      check = _.bind(this.decideRenderability, this);
      slowly = _.throttle(check, 50);
      return this.get("sp$").on("scroll", slowly);
    },
    willDestroyElement: function() {
      if (this.get("sp$.off") != null) {
        return this.get("sp$").off("scroll");
      }
    },
    topCutoff: function() {
      return Ember['default'].get(this.$().position(), "top") - this.get("overlap");
    },
    scrollY: function() {
      return this.get("sp$").scrollTop();
    },
    botCutoff: function() {
      return this.$().innerHeight() + this.topCutoff();
    },
    decideRenderability: function() {
      if (this.scrollY() < this.topCutoff()) {
        this.set("isBefore", true);
        this.set("isAfter", false);
      }
      if (this.botCutoff() < this.scrollY()) {
        this.set("isAfter", true);
        this.set("isBefore", false);
      }
      if ((this.topCutoff() < this.scrollY()) && (this.scrollY() < this.botCutoff())) {
        this.set("shouldLoadContent", true);
        return this.sendAction("action");
      } else {
        return this.set("shouldLoadContent", false);
      }
    }
  });

  exports['default'] = LazyScrollLoadComponent;

});
define('miume/components/lazy-video', ['exports', 'ember-lazy-video/components/lazy-video'], function (exports, LazyVideo) {

	'use strict';

	exports['default'] = LazyVideo['default'];

});
define('miume/components/lf-overlay', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "span",
    classNames: ["lf-overlay"],
    didInsertElement: function didInsertElement() {
      Ember['default'].$("body").addClass("lf-modal-open");
    },
    willDestroy: function willDestroy() {
      Ember['default'].$("body").removeClass("lf-modal-open");
    },
    click: function click() {
      this.sendAction("clickAway");
    }
  });

});
define('miume/components/liquid-bind-c', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: ""
  });

});
define('miume/components/liquid-measured', ['exports', 'liquid-fire/mutation-observer', 'ember'], function (exports, MutationObserver, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    didInsertElement: function didInsertElement() {
      var self = this;

      // This prevents margin collapse
      this.$().css({
        border: "1px solid transparent",
        margin: "-1px"
      });

      this.didMutate();

      this.observer = new MutationObserver['default'](function (mutations) {
        self.didMutate(mutations);
      });
      this.observer.observe(this.get("element"), {
        attributes: true,
        subtree: true,
        childList: true
      });
      this.$().bind("webkitTransitionEnd", function () {
        self.didMutate();
      });
      // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
      window.addEventListener("unload", function () {
        self.willDestroyElement();
      });
    },

    willDestroyElement: function willDestroyElement() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },

    didMutate: function didMutate() {
      Ember['default'].run.next(this, function () {
        this._didMutate();
      });
    },

    _didMutate: function _didMutate() {
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }

      // if jQuery sees a zero dimension, it will temporarily modify the
      // element's css to try to make its size measurable. But that's bad
      // for us here, because we'll get an infinite recursion of mutation
      // events. So we trap the zero case without hitting jQuery.

      if (elt[0].offsetWidth === 0) {
        this.set("width", 0);
      } else {
        this.set("width", elt.outerWidth());
      }
      if (elt[0].offsetHeight === 0) {
        this.set("height", 0);
      } else {
        this.set("height", elt.outerHeight());
      }
    }

  });

});
define('miume/components/liquid-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["liquid-modal"],
    currentContext: Ember['default'].computed.oneWay("owner.modalContexts.lastObject"),

    owner: null, // set by injection

    innerView: Ember['default'].computed("currentContext", function () {
      var self = this,
          current = this.get("currentContext"),
          name = current.get("name"),
          container = this.get("container"),
          component = container.lookup("component-lookup:main").lookupFactory(name);
      Ember['default'].assert("Tried to render a modal using component '" + name + "', but couldn't find it.", !!component);

      var args = Ember['default'].copy(current.get("params"));

      args.registerMyself = Ember['default'].on("init", function () {
        self.set("innerViewInstance", this);
      });

      // set source so we can bind other params to it
      args._source = Ember['default'].computed(function () {
        return current.get("source");
      });

      var otherParams = current.get("options.otherParams");
      var from, to;
      for (from in otherParams) {
        to = otherParams[from];
        args[to] = Ember['default'].computed.alias("_source." + from);
      }

      var actions = current.get("options.actions") || {};

      // Override sendAction in the modal component so we can intercept and
      // dynamically dispatch to the controller as expected
      args.sendAction = function (name) {
        var actionName = actions[name];
        if (!actionName) {
          this._super.apply(this, Array.prototype.slice.call(arguments));
          return;
        }

        var controller = current.get("source");
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(actionName);
        controller.send.apply(controller, args);
      };

      return component.extend(args);
    }),

    actions: {
      outsideClick: function outsideClick() {
        if (this.get("currentContext.options.dismissWithOutsideClick")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "outsideClick");
        }
      },
      escape: function escape() {
        if (this.get("currentContext.options.dismissWithEscape")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "escape");
        }
      },
      dismiss: function dismiss() {
        var source = this.get("currentContext.source"),
            proto = source.constructor.proto(),
            params = this.get("currentContext.options.withParams"),
            clearThem = {};

        for (var key in params) {
          clearThem[key] = proto[key];
        }
        source.setProperties(clearThem);
      }
    }
  });

  function proxyToInnerInstance(self, message) {
    var vi = self.get("innerViewInstance");
    if (vi) {
      vi.send(message);
    }
  }

});
define('miume/components/liquid-spacer', ['exports', 'ember', 'liquid-fire/promise'], function (exports, Ember, Promise) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: "slide",
    enabled: true,

    didInsertElement: function didInsertElement() {
      var child = this.$("> div");
      this.$().css({
        overflow: "hidden",
        width: child.width(),
        height: child.height()
      });
    },

    sizeChange: Ember['default'].observer("width", "height", function () {
      var elt = this.$();
      if (!this.get("enabled")) {
        elt.width(this.get("width"));
        elt.height(this.get("height"));
        return Promise['default'].resolve();
      }
      return Promise['default'].all([this.adaptDimension(elt, "width"), this.adaptDimension(elt, "height")]);
    }),

    adaptDimension: function adaptDimension(elt, dimension) {
      var have = elt[dimension]();
      var want = this.get(dimension);
      var target = {};
      target[dimension] = want;

      return Ember['default'].$.Velocity(elt[0], target, {
        duration: this.durationFor(have, want),
        queue: false,
        easing: this.get("growEasing")
      });
    },

    durationFor: function durationFor(before, after) {
      return Math.min(this.get("growDuration"), 1000 * Math.abs(before - after) / this.get("growPixelsPerSecond"));
    } });

});
define('miume/components/lm-container', ['exports', 'ember', 'liquid-fire/tabbable'], function (exports, Ember) {

  'use strict';

  /*
     Parts of this file were adapted from ic-modal

     https://github.com/instructure/ic-modal
     Released under The MIT License (MIT)
     Copyright (c) 2014 Instructure, Inc.
  */

  var lastOpenedModal = null;
  Ember['default'].$(document).on("focusin", handleTabIntoBrowser);

  function handleTabIntoBrowser() {
    if (lastOpenedModal) {
      lastOpenedModal.focus();
    }
  }

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["lm-container"],
    attributeBindings: ["tabindex"],
    tabindex: 0,

    keyUp: function keyUp(event) {
      // Escape key
      if (event.keyCode === 27) {
        this.sendAction();
      }
    },

    keyDown: function keyDown(event) {
      // Tab key
      if (event.keyCode === 9) {
        this.constrainTabNavigation(event);
      }
    },

    didInsertElement: function didInsertElement() {
      this.focus();
      lastOpenedModal = this;
    },

    willDestroy: function willDestroy() {
      lastOpenedModal = null;
    },

    focus: function focus() {
      if (this.get("element").contains(document.activeElement)) {
        // just let it be if we already contain the activeElement
        return;
      }
      var target = this.$("[autofocus]");
      if (!target.length) {
        target = this.$(":tabbable");
      }

      if (!target.length) {
        target = this.$();
      }

      target[0].focus();
    },

    constrainTabNavigation: function constrainTabNavigation(event) {
      var tabbable = this.$(":tabbable");
      var finalTabbable = tabbable[event.shiftKey ? "first" : "last"]()[0];
      var leavingFinalTabbable = finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
      this.get("element") === document.activeElement;
      if (!leavingFinalTabbable) {
        return;
      }
      event.preventDefault();
      tabbable[event.shiftKey ? "last" : "first"]()[0].focus();
    }
  });

});
define('miume/components/materialize-button-submit', ['exports', 'ember-cli-materialize/components/materialize-button-submit'], function (exports, MaterializeButtonSubmit) {

	'use strict';

	exports['default'] = MaterializeButtonSubmit['default'];

});
define('miume/components/materialize-button', ['exports', 'ember-cli-materialize/components/materialize-button'], function (exports, MaterializeButton) {

	'use strict';

	exports['default'] = MaterializeButton['default'];

});
define('miume/components/materialize-card-action', ['exports', 'ember-cli-materialize/components/materialize-card-action'], function (exports, MaterializeCardAction) {

	'use strict';

	exports['default'] = MaterializeCardAction['default'];

});
define('miume/components/materialize-card-content', ['exports', 'ember-cli-materialize/components/materialize-card-content'], function (exports, MaterializeCardContent) {

	'use strict';

	exports['default'] = MaterializeCardContent['default'];

});
define('miume/components/materialize-card-panel', ['exports', 'ember-cli-materialize/components/materialize-card-panel'], function (exports, MaterializeCardPanel) {

	'use strict';

	exports['default'] = MaterializeCardPanel['default'];

});
define('miume/components/materialize-card-reveal', ['exports', 'ember-cli-materialize/components/materialize-card-reveal'], function (exports, MaterializeCardReveal) {

	'use strict';

	exports['default'] = MaterializeCardReveal['default'];

});
define('miume/components/materialize-card', ['exports', 'ember-cli-materialize/components/materialize-card'], function (exports, MaterializeCard) {

	'use strict';

	exports['default'] = MaterializeCard['default'];

});
define('miume/components/materialize-collapsible-card', ['exports', 'ember-cli-materialize/components/materialize-collapsible-card'], function (exports, MaterializeCollapsibleCard) {

	'use strict';

	exports['default'] = MaterializeCollapsibleCard['default'];

});
define('miume/components/materialize-collapsible', ['exports', 'ember-cli-materialize/components/materialize-collapsible'], function (exports, MaterializeCollapsible) {

	'use strict';

	exports['default'] = MaterializeCollapsible['default'];

});
define('miume/components/materialize-navbar', ['exports', 'ember-cli-materialize/components/materialize-navbar'], function (exports, MaterializeNavBar) {

	'use strict';

	exports['default'] = MaterializeNavBar['default'];

});
define('miume/components/scroll-spy', ['exports', 'ember', 'miume/utils/fun-ex'], function (exports, Ember, FunEx) {

  'use strict';

  var ScrollSpyComponent;

  ScrollSpyComponent = Ember['default'].Component.extend({
    classNames: ["scroll-spy"],
    classNameBindings: ["pastCutoff:after-cutoff:before-cutoff"],
    scrollParent: 'body',
    overlap: 0,
    pastCutoff: false,
    sp$: FunEx['default'].computed("scrollParent", function() {
      return $(this.get('scrollParent'));
    }),
    didInsertElement: function() {
      var check, slowly;
      this.decideRazorsEdge();
      check = _.bind(this.decideRazorsEdge, this);
      slowly = _.throttle(check, 50);
      return this.get("sp$").on("scroll", slowly);
    },
    willDestroyElement: function() {
      if (this.get("sp$.off") != null) {
        return this.get("sp$").off("scroll");
      }
    },
    scrollY: function() {
      return this.get("sp$").scrollTop();
    },
    cutoff: function() {
      return Ember['default'].get(this.$().position(), "top") - this.get("overlap");
    },
    decideRazorsEdge: function() {
      if (this.scrollY() >= this.cutoff()) {
        return this.set("pastCutoff", true);
      }
    }
  });

  exports['default'] = ScrollSpyComponent;

});
define('miume/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ApplicationController, ClassNames;

  ClassNames = ["index", "about", "works", "contact"];

  ApplicationController = Ember['default'].Controller.extend({
    hideAbsNav: function() {
      return $("#top-nav-absolute").addClass("invisible");
    },
    hideFixNav: function() {
      return $("#top-nav-fixed").removeClass().addClass("invisible");
    },
    showFixNav: function(className) {
      return $("#top-nav-fixed").removeClass().addClass(className);
    },
    showAbsNav: function() {
      return $("#top-nav-absolute").removeClass("invisible");
    },
    actions: {
      loadIndex: function() {
        this.transitionToRoute("index");
        this.hideFixNav();
        return this.showAbsNav();
      },
      loadAbout: function() {
        this.transitionToRoute("about");
        this.hideAbsNav();
        return this.showFixNav("about");
      },
      loadWorks: function() {
        this.transitionToRoute("works");
        this.hideAbsNav();
        return this.showFixNav("works");
      },
      loadContact: function() {
        this.transitionToRoute("contact");
        this.hideAbsNav();
        return this.showFixNav("contact");
      }
    }
  });

  exports['default'] = ApplicationController;

});
define('miume/helpers/async-button', ['exports', 'ember-cli-async-button/helpers/async-button'], function (exports, AsyncButtonHelper) {

	'use strict';

	exports['default'] = AsyncButtonHelper['default'];

});
define('miume/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function faIcon(name, options) {
    if (Ember['default'].typeOf(name) !== "string") {
      var message = "fa-icon: no icon specified";
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = "";

    classNames.push("fa");
    if (!name.match(FA_PREFIX)) {
      name = "fa-" + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push("fa-spin");
    }
    if (params.flip) {
      classNames.push("fa-flip-" + params.flip);
    }
    if (params.rotate) {
      classNames.push("fa-rotate-" + params.rotate);
    }
    if (params.lg) {
      warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
      classNames.push("fa-lg");
    }
    if (params.x) {
      warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
      classNames.push("fa-" + params.x + "x");
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === "string" && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === "number") {
        classNames.push("fa-" + params.size + "x");
      } else {
        classNames.push("fa-" + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push("fa-fw");
    }
    if (params.listItem) {
      classNames.push("fa-li");
    }
    if (params.pull) {
      classNames.push("pull-" + params.pull);
    }
    if (params.border) {
      classNames.push("fa-border");
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += "<";
    var tagName = params.tagName || "i";
    html += tagName;
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += " aria-hidden=\"true\"";
    }
    html += "></" + tagName + ">";
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('miume/helpers/liquid-bind', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* liquid-bind is really just liquid-with with a pre-provided block
     that just says {{this}} */
  function liquidBindHelperFunc() {
    var options = arguments[arguments.length - 1];
    var container = options.data.view.container;
    var componentLookup = container.lookup("component-lookup:main");
    var cls = componentLookup.lookupFactory("liquid-bind-c");
    options.hash.value = arguments[0];
    options.hashTypes.value = options.types[0];

    if (options.hash["class"]) {
      options.hash.innerClass = options.hash["class"];
      delete options.hash["class"];
      options.hashTypes.innerClass = options.hashTypes["class"];
      delete options.hashTypes["class"];
    }
    Ember['default'].Handlebars.helpers.view.call(this, cls, options);
  }

  function htmlbarsLiquidBindHelper(params, hash, options, env) {
    var componentLookup = this.container.lookup("component-lookup:main");
    var cls = componentLookup.lookupFactory("liquid-bind-c");
    hash.value = params[0];
    if (hash["class"]) {
      hash.innerClass = hash["class"];
      delete hash["class"];
    }
    env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
  }

  var liquidBindHelper;

  if (Ember['default'].HTMLBars) {
    liquidBindHelper = {
      isHTMLBars: true,
      helperFunction: htmlbarsLiquidBindHelper
    };
  } else {
    liquidBindHelper = liquidBindHelperFunc;
  }

  exports['default'] = liquidBindHelper;

});
define('miume/helpers/liquid-if', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.factory = factory;

  var isHTMLBars = !!Ember['default'].HTMLBars;
  function factory(invert) {
    function helperFunc() {
      var property, hash, options, env, container;

      if (isHTMLBars) {
        property = arguments[0][0];
        hash = arguments[1];
        options = arguments[2];
        env = arguments[3];
        container = this.container;
      } else {
        property = arguments[0];
        options = arguments[1];
        hash = options.hash;
        container = options.data.view.container;
      }
      var View = container.lookupFactory("view:liquid-if");

      var templates = [options.fn || options.template, options.inverse];
      if (invert) {
        templates.reverse();
      }
      delete options.fn;
      delete options.template;
      delete options.inverse;

      if (hash.containerless) {
        View = View.extend(Ember['default']._Metamorph);
      }

      hash.templates = templates;

      if (isHTMLBars) {
        hash.showFirst = property;
        env.helpers.view.helperFunction.call(this, [View], hash, options, env);
      } else {
        hash.showFirstBinding = property;
        return Ember['default'].Handlebars.helpers.view.call(this, View, options);
      }
    }

    if (Ember['default'].HTMLBars) {
      return {
        isHTMLBars: true,
        helperFunction: helperFunc,
        preprocessArguments: function preprocessArguments() {}
      };
    } else {
      return helperFunc;
    }
  }

  exports['default'] = factory(false);

});
define('miume/helpers/liquid-measure', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function () {
    Ember['default'].assert("liquid-measure is deprecated, see CHANGELOG.md", false);
  };

});
define('miume/helpers/liquid-outlet', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  function liquidOutletHelperFunc(property, options) {
    var property, options, container, hash, env;

    if (isHTMLBars) {
      property = arguments[0][0]; // params[0]
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      container = this.container;

      if (!property) {
        property = "main";
        options.paramTypes = ["string"];
      }
    } else {
      property = arguments[0];

      if (property && property.data && property.data.isRenderData) {
        options = property;
        property = "main";
        options.types = ["STRING"];
      }

      container = options.data.view.container;
      hash = options.hash;
    }

    var View = container.lookupFactory("view:liquid-outlet");
    if (hash.containerless) {
      View = View.extend(Ember['default']._Metamorph);
    }
    hash.viewClass = View;

    if (isHTMLBars) {
      env.helpers.outlet.helperFunction.call(this, [property], hash, options, env);
    } else {
      return Ember['default'].Handlebars.helpers.outlet.call(this, property, options);
    }
  }

  var liquidOutletHelper = liquidOutletHelperFunc;
  if (Ember['default'].HTMLBars) {
    liquidOutletHelper = {
      isHTMLBars: true,
      helperFunction: liquidOutletHelperFunc,
      preprocessArguments: function preprocessArguments() {}
    };
  }

  exports['default'] = liquidOutletHelper;

});
define('miume/helpers/liquid-unless', ['exports', 'miume/helpers/liquid-if'], function (exports, liquid_if) {

	'use strict';

	exports['default'] = liquid_if.factory(true);

});
define('miume/helpers/liquid-with', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  function liquidWithHelperFunc() {
    var params, context, options, container, innerOptions, data, hash, env;

    var innerOptions = {
      hashTypes: {}
    };

    var innerHash = {};

    if (isHTMLBars) {
      params = arguments[0];
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      context = params[0];
      container = this.container;
      data = arguments[3].data;
      innerOptions.morph = options.morph;

      if (params.length === 3) {
        hash.keywordName = params[2]._label;
        params = [context];
      }
      innerHash.boundContext = context;
    } else {
      params = Array.prototype.slice.apply(arguments, [0, -1]);
      context = arguments[0];
      options = arguments[arguments.length - 1];
      data = options.data;
      hash = options.hash;
      container = data.view.container;
      innerOptions.data = data;
      innerOptions.hash = innerHash;
      innerHash.boundContextBinding = context;
    }

    var View = container.lookupFactory("view:liquid-with");

    View = View.extend({
      originalArgs: params,
      originalHash: hash,
      originalHashTypes: options.hashTypes,
      innerTemplate: options.fn || options.template
    });

    var containerless = isHTMLBars && hash.containerless && (!hash.containerless.isStream || hash.containerless.value()) || !isHTMLBars && (options.hashTypes.containerless === "BOOLEAN" && hash.containerless || options.hashTypes.containerless === "ID" && this.containerless);

    if (containerless) {
      View = View.extend(Ember['default']._Metamorph);
    }

    ["class", "classNames", "classNameBindings", "use", "id", "growDuration", "growPixelsPerSecond", "growEasing", "enableGrowth", "containerless"].forEach(function (field) {
      if (hash.hasOwnProperty(field)) {
        innerHash[field] = hash[field];
        innerOptions.hashTypes[field] = options.hashTypes ? options.hashTypes[field] : undefined;
      }
    });

    if (isHTMLBars) {
      env.helpers.view.helperFunction.call(this, [View], innerHash, innerOptions, env);
    } else {
      if (containerless) {
        delete innerOptions.hash["class"];
        delete innerOptions.hash.classNames;
        delete innerOptions.hash.classNameBindings;
      }
      return Ember['default'].Handlebars.helpers.view.call(this, View, innerOptions);
    }
  }

  var liquidWithHelper = liquidWithHelperFunc;
  if (isHTMLBars) {
    liquidWithHelper = {
      isHTMLBars: true,
      helperFunction: liquidWithHelperFunc,
      preprocessArguments: function preprocessArguments() {}
    };
  }

  exports['default'] = liquidWithHelper;

});
define('miume/helpers/t', ['exports', 'ember-cli-i18n/utils/stream'], function (exports, Stream) {

  'use strict';



  exports['default'] = tHelper;
  function tHelper(params, hash, options, env) {
    var view = env.data.view;
    var path = params.shift();

    var container = view.container;
    var t = container.lookup("utils:t");
    var application = container.lookup("application:main");

    var stream = new Stream['default'](function () {
      return t(path, params);
    });

    // bind any arguments that are Streams
    for (var i = 0, l = params.length; i < l; i++) {
      var param = params[i];
      if (param && param.isStream) {
        param.subscribe(stream.notify, stream);
      };
    }

    application.localeStream.subscribe(stream.notify, stream);

    if (path.isStream) {
      path.subscribe(stream.notify, stream);
    }

    return stream;
  }

});
define('miume/helpers/with-apply', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  // This helper is internal to liquid-with.
  function withApplyHelperFunc() {
    var hash, options, env, view;

    if (isHTMLBars) {
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      view = this;
    } else {
      options = arguments[0];
      hash = options.hash;
      view = options.data.view;
    }

    var parent = view.get("liquidWithParent");
    var withArgs = parent.get("originalArgs").slice();

    withArgs[0] = "lwith-view.boundContext";
    options = Ember['default'].copy(options);

    // This works to inject our keyword in Ember >= 1.9
    if (!view._keywords) {
      view._keywords = {};
    }
    view._keywords["lwith-view"] = view;

    // This works to inject our keyword in Ember < 1.9
    if (!isHTMLBars) {
      if (!options.data.keywords) {
        options.data.keywords = {};
      }
      options.data.keywords["lwith-view"] = view;
    }

    if (isHTMLBars) {
      options.template = parent.get("innerTemplate");
    } else {
      options.fn = parent.get("innerTemplate");
    }

    hash = parent.get("originalHash");
    options.hashTypes = parent.get("originalHashTypes");

    if (isHTMLBars) {
      env.helpers["with"].helperFunction.call(this, [view.getStream(withArgs[0])], hash, options, env);
    } else {
      options.hash = hash;
      withArgs.push(options);
      return Ember['default'].Handlebars.helpers["with"].apply(this, withArgs);
    }
  }

  var withApplyHelper = withApplyHelperFunc;
  if (Ember['default'].HTMLBars) {
    withApplyHelper = {
      isHTMLBars: true,
      helperFunction: withApplyHelperFunc,
      preprocessArguments: function preprocessArguments() {}
    };
  }

  exports['default'] = withApplyHelper;

});
define('miume/initializers/app-version', ['exports', 'miume/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('miume/initializers/csrf-service', ['exports'], function (exports) {

  'use strict';

  exports['default'] = {
    name: "rails-csrf",
    initialize: function initialize(container, app) {
      app.inject("route", "csrf", "service:csrf");
      app.inject("controller", "csrf", "service:csrf");
    }
  };

});
define('miume/initializers/ember-moment', ['exports', 'ember-moment/helpers/moment', 'ember-moment/helpers/ago', 'ember-moment/helpers/duration', 'ember'], function (exports, moment, ago, duration, Ember) {

  'use strict';

  var initialize = function initialize() {
    var registerHelper;

    if (Ember['default'].HTMLBars) {
      registerHelper = function (helperName, fn) {
        Ember['default'].HTMLBars._registerHelper(helperName, Ember['default'].HTMLBars.makeBoundHelper(fn));
      };
    } else {
      registerHelper = Ember['default'].Handlebars.helper;
    };

    registerHelper("moment", moment['default']);
    registerHelper("ago", ago['default']);
    registerHelper("duration", duration['default']);
  };

  exports['default'] = {
    name: "ember-moment",

    initialize: initialize
  };
  /* container, app */

  exports.initialize = initialize;

});
define('miume/initializers/export-application-global', ['exports', 'ember', 'miume/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('miume/initializers/lazy-video', ['exports', 'ember-lazy-video/services/lazy-video-providers'], function (exports, LazyVideoProviders) {

  'use strict';

  exports['default'] = {
    name: "flash-messages",
    initialize: function initialize(container, application) {
      application.register("service:lazy-video-providers", LazyVideoProviders['default'], { singleton: true });
      application.inject("component:lazy-video", "providers", "service:lazy-video-providers");
    }
  };

});
define('miume/initializers/link-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    Ember['default'].LinkView.reopen({
      attributeBindings: ["data-activates"]
    });
  }

  exports['default'] = {
    name: "link-view",
    initialize: initialize
  };
  /* container, application */

});
define('miume/initializers/liquid-fire', ['exports', 'liquid-fire', 'ember'], function (exports, liquid_fire, Ember) {

  'use strict';

  exports['default'] = {
    name: "liquid-fire",

    initialize: (function (_initialize) {
      var _initializeWrapper = function initialize(_x) {
        return _initialize.apply(this, arguments);
      };

      _initializeWrapper.toString = function () {
        return _initialize.toString();
      };

      return _initializeWrapper;
    })(function (container) {
      if (!Ember['default'].$.Velocity) {
        Ember['default'].warn("Velocity.js is missing");
      } else {
        var version = Ember['default'].$.Velocity.version;
        var recommended = [0, 11, 8];
        if (Ember['default'].compare(recommended, [version.major, version.minor, version.patch]) === 1) {
          Ember['default'].warn("You should probably upgrade Velocity.js, recommended minimum is " + recommended.join("."));
        }
      }

      liquid_fire.initialize(container);
    })
  };

});
define('miume/initializers/t', ['exports', 'ember', 'ember-cli-i18n/utils/t', 'miume/helpers/t', 'ember-cli-i18n/utils/stream'], function (exports, Ember, T, tHelper, Stream) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    Ember['default'].HTMLBars._registerHelper("t", tHelper['default']);

    application.localeStream = new Stream['default'](function () {
      return application.get("locale");
    });

    Ember['default'].addObserver(application, "locale", function () {
      application.localeStream.notify();
    });

    application.register("utils:t", T['default']);
    application.inject("route", "t", "utils:t");
    application.inject("model", "t", "utils:t");
    application.inject("component", "t", "utils:t");
    application.inject("controller", "t", "utils:t");
  }

  ;

  exports['default'] = {
    name: "t",
    initialize: initialize
  };

});
define('miume/initializers/youtube', ['exports', 'ember-youtube-data-model/initializers/youtube'], function (exports, YoutubeInitializer) {

	'use strict';

	exports['default'] = YoutubeInitializer['default'];

});
define('miume/mixins/google-pageview', ['exports', 'ember', 'miume/config/environment'], function (exports, Ember, ENV) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    pageviewToGA: (function () {
      if (Ember['default'].get(ENV['default'], "googleAnalytics.webPropertyId") != null) {
        var trackerType = Ember['default'].getWithDefault(ENV['default'], "googleAnalytics.tracker", "analytics.js");

        if (trackerType === "analytics.js") {
          var globalVariable = Ember['default'].getWithDefault(ENV['default'], "googleAnalytics.globalVariable", "ga");

          window[globalVariable]("send", "pageview", {
            page: this.get("url"),
            title: this.get("url")
          });
        } else if (trackerType === "ga.js") {
          window._gaq.push(["_trackPageview"]);
        }
      }
    }).on("didTransition")
  });

});
define('miume/models/youtube/channel', ['exports', 'ember-data', 'ember'], function (exports, DS, Ember) {

  'use strict';

  var YoutubeChannel;

  YoutubeChannel = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    thumbnails: DS['default'].attr("thumbnails"),
    publishedAt: DS['default'].attr("date"),
    uploadId: DS['default'].attr("string"),
    uploads: Ember['default'].computed("uploadId", function() {
      if (Ember['default'].isBlank(this.get("uploadId"))) {
        return;
      }
      return this.store.find("youtube/playlist", this.get("uploadId"));
    })
  });

  exports['default'] = YoutubeChannel;

});
define('miume/models/youtube/playlist', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var YoutubePlaylist;

  YoutubePlaylist = DS['default'].Model.extend({
    videos: DS['default'].hasMany("youtube/video", {
      embedded: true
    })
  });

  exports['default'] = YoutubePlaylist;

});
define('miume/models/youtube/video', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var YoutubeVideo;

  YoutubeVideo = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    thumbnails: DS['default'].attr("thumbnails"),
    position: DS['default'].attr("number"),
    publishedAt: DS['default'].attr("date")
  });

  exports['default'] = YoutubeVideo;

});
define('miume/router', ['exports', 'ember', 'miume/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router;

  Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function() {
    this.route("about");
    this.resource("works", {
      path: "/works"
    }, function() {
      return this.resource("work", {
        path: "/work/:workId"
      }, function() {});
    });
    return this.route("contact");
  });

  exports['default'] = Router;

});
define('miume/routes/about', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var AboutRoute;

  AboutRoute = Ember['default'].Route.extend({
    renderTemplate: function() {
      return this.render("about/faraway");
    }
  });

  exports['default'] = AboutRoute;

});
define('miume/routes/contact', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ContactRoute;

  ContactRoute = Ember['default'].Route.extend({
    renderTemplate: function() {
      return this.render("contact/faraway");
    }
  });

  exports['default'] = ContactRoute;

});
define('miume/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var IndexRoute;

  IndexRoute = Ember['default'].Route.extend({
    renderTemplate: function() {
      return this.render("index/faraway");
    }
  });

  exports['default'] = IndexRoute;

});
define('miume/routes/works', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var WorksRoute;

  WorksRoute = Ember['default'].Route.extend({
    renderTemplate: function() {
      return this.render("works/faraway");
    }
  });

  exports['default'] = WorksRoute;

});
define('miume/serializers/youtube', ['exports', 'ember-youtube-data-model/serializers/youtube'], function (exports, YoutubeSerializer) {

	'use strict';

	exports['default'] = YoutubeSerializer['default'];

});
define('miume/serializers/youtube/channel', ['exports', 'ember-youtube-data-model/serializers/youtube/channel'], function (exports, YoutubeChannelSerializer) {

	'use strict';

	exports['default'] = YoutubeChannelSerializer['default'];

});
define('miume/serializers/youtube/playlist', ['exports', 'ember-youtube-data-model/serializers/youtube/playlist'], function (exports, YoutubePlaylistSerializer) {

	'use strict';

	exports['default'] = YoutubePlaylistSerializer['default'];

});
define('miume/serializers/youtube/video', ['exports', 'ember-youtube-data-model/serializers/youtube/video'], function (exports, YoutubeVideoSerializer) {

	'use strict';

	exports['default'] = YoutubeVideoSerializer['default'];

});
define('miume/services/csrf', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({
    onAjaxComplete: (function () {
      var _this = this;
      this.fetchToken();

      Ember['default'].$(document).on("ajaxComplete", function (event, xhr, settings) {
        var csrf_param = xhr.getResponseHeader("X-CSRF-Param"),
            csrf_token = xhr.getResponseHeader("X-CSRF-Token");

        if (csrf_param && csrf_token) {
          _this.setData({ csrf_param: csrf_token });
        }
      });
    }).on("init"),
    setPrefilter: function setPrefilter() {
      var token = this.get("data").token;
      var preFilter = function preFilter(options, originalOptions, jqXHR) {
        return jqXHR.setRequestHeader("X-CSRF-Token", token);
      };
      $.ajaxPrefilter(preFilter);
    },
    setData: function setData(data) {
      var param = Ember['default'].keys(data)[0];
      this.set("data", { param: param, token: data[param] });
      this.setPrefilter();

      return this.get("data");
    },
    fetchToken: function fetchToken() {
      var _this = this;
      var token = Ember['default'].$("meta[name=\"csrf-token\"]").attr("content") || "";

      return Ember['default'].RSVP.resolve().then(function () {
        return _this.setData({ authenticity_token: token });
      });
    }
  });

});
define('miume/templates/about', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("h4");
            dom.setAttribute(el1,"class","catchphrase");
            var el2 = dom.createTextNode("something about me");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            dom.setAttribute(el1,"class","exposition");
            var el2 = dom.createTextNode("faksdjf laksjd flkjas dflkjasdlfkjals djflakjsd flkjasdl fkjalsdkjf");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              inline(env, morph0, context, "fa-icon", ["home"], {"size": "2"});
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              inline(env, morph0, context, "fa-icon", ["archive"], {"size": "2"});
              return fragment;
            }
          };
        }());
        var child2 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              inline(env, morph0, context, "fa-icon", ["comments-o"], {"size": "2"});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1,2,3]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
            var morph2 = dom.createMorphAt(fragment,2,3,contextualElement);
            block(env, morph0, context, "link-to", ["index"], {"class": "green-text darken-1"}, child0, null);
            block(env, morph1, context, "link-to", ["works"], {"class": "green-text darken-1"}, child1, null);
            block(env, morph2, context, "link-to", ["contact"], {"class": "green-text darken-1"}, child2, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1,2]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
          block(env, morph0, context, "materialize-card-content", [], {}, child0, null);
          block(env, morph1, context, "materialize-card-action", [], {}, child1, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","about");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col l6 offset-l6");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 0, 0]),-1,-1);
        block(env, morph0, context, "materialize-card", [], {"title": "introduction", "titleClass": "green-text darken-1", "image": "images/doge.jpg"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('miume/templates/about/faraway', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","about-faraway");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","parallax-background");
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","images/spring2.jpg");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("span");
          var el1 = dom.createTextNode("梅");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","mdi-action-face-unlock");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","nav-title");
          var el2 = dom.createTextNode("about me");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","nav-title");
          var el2 = dom.createTextNode("my discography");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "fa-icon", ["archive"], {});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","nav-title");
          var el2 = dom.createTextNode("leave me a message");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "fa-icon", ["comments-o"], {});
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createUnsafeMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "render", ["index"], {});
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createUnsafeMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "render", ["about"], {});
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createUnsafeMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "render", ["works"], {});
          return fragment;
        }
      };
    }());
    var child7 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createUnsafeMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "render", ["contact"], {});
          return fragment;
        }
      };
    }());
    var child8 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("span");
          var el1 = dom.createTextNode("梅");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child9 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("i");
          dom.setAttribute(el0,"class","mdi-action-face-unlock");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child10 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "fa-icon", ["archive"], {});
          return fragment;
        }
      };
    }());
    var child11 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "fa-icon", ["comments-o"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("main");
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"id","top-nav-absolute");
        dom.setAttribute(el2,"class","grey lighten-1");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","nav-wrapper");
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"id","nav-mobile");
        dom.setAttribute(el4,"class","right hide-on-med-and-down");
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","materialize-parallax-layer faraway");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","materialize-parallax-layer deep");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","materialize-parallax-layer back");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","materialize-parallax-layer base");
        var el3 = dom.createTextNode("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"id","top-nav-fixed");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","nav-wrapper");
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"id","nav-mobile");
        dom.setAttribute(el3,"class","right hide-on-med-and-down");
        var el4 = dom.createElement("li");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, content = hooks.content, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [0, 0]);
        var element2 = dom.childAt(element1, [0]);
        var element3 = dom.childAt(element0, [4]);
        if (this.cachedFragment) { dom.repairClonedNode(element3,[0,1,2]); }
        var element4 = dom.childAt(fragment, [1, 0]);
        var element5 = dom.childAt(element4, [0]);
        var morph0 = dom.createMorphAt(element1,-1,0);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [0]),-1,-1);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [1]),-1,-1);
        var morph3 = dom.createMorphAt(dom.childAt(element2, [2]),-1,-1);
        var morph4 = dom.createUnsafeMorphAt(dom.childAt(element0, [1]),-1,-1);
        var morph5 = dom.createUnsafeMorphAt(dom.childAt(element0, [2]),-1,-1);
        var morph6 = dom.createUnsafeMorphAt(dom.childAt(element0, [3]),-1,-1);
        var morph7 = dom.createMorphAt(element3,-1,0);
        var morph8 = dom.createMorphAt(element3,0,1);
        var morph9 = dom.createMorphAt(element3,1,2);
        var morph10 = dom.createMorphAt(element3,2,-1);
        var morph11 = dom.createMorphAt(element4,-1,0);
        var morph12 = dom.createMorphAt(dom.childAt(element5, [0]),-1,-1);
        var morph13 = dom.createMorphAt(dom.childAt(element5, [1]),-1,-1);
        var morph14 = dom.createMorphAt(dom.childAt(element5, [2]),-1,-1);
        block(env, morph0, context, "link-to", ["index"], {"classNames": "brand-logo blue-grey-text darken-3"}, child0, null);
        block(env, morph1, context, "link-to", ["about"], {"classNames": "blue-grey-text darken-3"}, child1, null);
        block(env, morph2, context, "link-to", ["works"], {"classNames": "blue-grey-text darken-3"}, child2, null);
        block(env, morph3, context, "link-to", ["contact"], {"classNames": "blue-grey-text darken-3"}, child3, null);
        content(env, morph4, context, "liquid-outlet");
        inline(env, morph5, context, "outlet", ["deep"], {});
        inline(env, morph6, context, "outlet", ["back"], {});
        block(env, morph7, context, "lazy-scroll-load", [], {"id": "index", "action": "loadIndex", "scrollParent": "main", "overlap": 0}, child4, null);
        block(env, morph8, context, "lazy-scroll-load", [], {"id": "about", "action": "loadAbout", "scrollParent": "main", "overlap": 50}, child5, null);
        block(env, morph9, context, "lazy-scroll-load", [], {"id": "works", "action": "loadWorks", "scrollParent": "main", "overlap": 50}, child6, null);
        block(env, morph10, context, "lazy-scroll-load", [], {"id": "contact", "action": "loadContact", "scrollParent": "main", "overlap": 50}, child7, null);
        block(env, morph11, context, "link-to", ["index"], {"class": "brand-logo"}, child8, null);
        block(env, morph12, context, "link-to", ["about"], {}, child9, null);
        block(env, morph13, context, "link-to", ["works"], {}, child10, null);
        block(env, morph14, context, "link-to", ["contact"], {}, child11, null);
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/lazy-scroll-load', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = fragment;
        var morph0 = dom.createUnsafeMorphAt(element0,-1,-1);
        element(env, element0, context, "bind-attr", [], {"class": ":loaded-contents shouldLoadContent:visible:invisible"});
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/lazy-video', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("iframe");
          dom.setAttribute(el1,"width","100%");
          dom.setAttribute(el1,"height","100%");
          dom.setAttribute(el1,"frameBorder","0");
          dom.setAttribute(el1,"allowFullScreen","");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "bind-attr", [], {"src": get(env, context, "videoSrc")});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            content(env, morph0, context, "yield");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","lazyLoad-play");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.setNamespace("http://www.w3.org/2000/svg");
            var el2 = dom.createElement("svg");
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"fill-rule","evenodd");
            dom.setAttribute(el3,"clip-rule","evenodd");
            dom.setAttribute(el3,"d","M84.15,26.4v6.35c0,2.833-0.15,5.967-0.45,9.4c-0.133,1.7-0.267,3.117-0.4,4.25l-0.15,0.95c-0.167,0.767-0.367,1.517-0.6,2.25c-0.667,2.367-1.533,4.083-2.6,5.15c-1.367,1.4-2.967,2.383-4.8,2.95c-0.633,0.2-1.316,0.333-2.05,0.4c-0.767,0.1-1.3,0.167-1.6,0.2c-4.9,0.367-11.283,0.617-19.15,0.75c-2.434,0.034-4.883,0.067-7.35,0.1h-2.95C38.417,59.117,34.5,59.067,30.3,59c-8.433-0.167-14.05-0.383-16.85-0.65c-0.067-0.033-0.667-0.117-1.8-0.25c-0.9-0.133-1.683-0.283-2.35-0.45c-2.066-0.533-3.783-1.5-5.15-2.9c-1.033-1.067-1.9-2.783-2.6-5.15C1.317,48.867,1.133,48.117,1,47.35L0.8,46.4c-0.133-1.133-0.267-2.55-0.4-4.25C0.133,38.717,0,35.583,0,32.75V26.4c0-2.833,0.133-5.95,0.4-9.35l0.4-4.25c0.167-0.966,0.417-2.05,0.75-3.25c0.7-2.333,1.567-4.033,2.6-5.1c1.367-1.434,2.967-2.434,4.8-3c0.633-0.167,1.333-0.3,2.1-0.4c0.4-0.066,0.917-0.133,1.55-0.2c4.9-0.333,11.283-0.567,19.15-0.7C35.65,0.05,39.083,0,42.05,0L45,0.05c2.467,0,4.933,0.034,7.4,0.1c7.833,0.133,14.2,0.367,19.1,0.7c0.3,0.033,0.833,0.1,1.6,0.2c0.733,0.1,1.417,0.233,2.05,0.4c1.833,0.566,3.434,1.566,4.8,3c1.066,1.066,1.933,2.767,2.6,5.1c0.367,1.2,0.617,2.284,0.75,3.25l0.4,4.25C84,20.45,84.15,23.567,84.15,26.4z M33.3,41.4L56,29.6L33.3,17.75V41.4z");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("polygon");
            dom.setAttribute(el3,"fill-rule","evenodd");
            dom.setAttribute(el3,"clip-rule","evenodd");
            dom.setAttribute(el3,"fill","#FFFFFF");
            dom.setAttribute(el3,"points","33.3,41.4 33.3,17.75 56,29.6");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "if", [get(env, context, "template")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "if", [get(env, context, "isDisplayed")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/liquid-bind-c', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "boundValue", blockArguments[0]);
          content(env, morph0, context, "boundValue");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "liquid-with", [get(env, context, "value")], {"class": get(env, context, "innerClass"), "use": get(env, context, "use"), "containerless": get(env, context, "containerless")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/liquid-measured', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/liquid-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"role","dialog");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element0,0,1);
            var morph1 = dom.createMorphAt(fragment,2,3,contextualElement);
            element(env, element0, context, "bind-attr", [], {"class": ":lf-dialog cc.options.dialogClass"});
            element(env, element0, context, "bind-attr", [], {"aria-labelledby": "cc.options.ariaLabelledBy", "aria-label": "cc.options.ariaLabel"});
            inline(env, morph0, context, "view", [get(env, context, "innerView")], {"dismiss": "dismiss"});
            inline(env, morph1, context, "lf-overlay", [], {"clickAway": "outsideClick"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "cc", blockArguments[0]);
          block(env, morph0, context, "lm-container", [], {"action": "escape"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "liquid-with", [get(env, context, "currentContext")], {"class": "lm-with", "containerless": true}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/liquid-spacer', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "liquid-measured", [], {"width": get(env, context, "width"), "height": get(env, context, "height")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('miume/templates/components/scroll-spy', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createUnsafeMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('miume/templates/contact', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","contact");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createElement("form");
        dom.setAttribute(el3,"class","col s12 m6 l6");
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","input-field");
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","name");
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("name");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createUnsafeMorphAt(dom.childAt(fragment, [0, 0, 0, 0]),-1,0);
        inline(env, morph0, context, "input", [], {"type": "text", "name": "name", "class": "validate"});
        return fragment;
      }
    };
  }()));

});
define('miume/templates/contact/faraway', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","contact-faraway");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","parallax-background");
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","images/autumn.jpg");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("h1");
        dom.setAttribute(el0,"class","site-title");
        var el1 = dom.createTextNode("梅");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/templates/index/back', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","index-back");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col s12 centered");
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn-floating btn-large waves-effect waves-light grey");
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","site-logo");
        var el6 = dom.createTextNode("梅");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/templates/index/faraway', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","index-faraway");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","parallax-background");
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","images/winter.jpg");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/templates/liquid-with-self', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "value");
        return fragment;
      }
    };
  }()));

});
define('miume/templates/liquid-with', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "with-apply");
        return fragment;
      }
    };
  }()));

});
define('miume/templates/works', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","works");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col s12 m6 l3");
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","card");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","card-image waves-effect waves-block waves-light");
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","images/doge2.jpg");
        dom.setAttribute(el6,"class","activator");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","card-content");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","card-title activator grey-text text-darken-4");
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("video title");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","mdi-navigation-more-vert right");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("outbound link");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","card-reveal");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","card-title grey-text text-darken-4");
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("video title");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","mdi-navigation-close right");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("description goes here");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col s12 m6 l3");
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","card");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","card-image waves-effect waves-block waves-light");
        var el6 = dom.createElement("img");
        dom.setAttribute(el6,"src","images/doge2.jpg");
        dom.setAttribute(el6,"class","activator");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","card-content");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","card-title activator grey-text text-darken-4");
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("video title");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","mdi-navigation-more-vert right");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("outbound link");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","card-reveal");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","card-title grey-text text-darken-4");
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("video title");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","mdi-navigation-close right");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("description goes here");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/templates/works/faraway', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"id","works-faraway");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","parallax-background");
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","images/summer.jpg");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('miume/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('miume/tests/ember-cli-i18n-test', ['ember', 'miume/config/environment'], function (Ember, config) {

  'use strict';

  /* globals requirejs, require */

  if (window.QUnit) {
    var keys = Ember['default'].keys;

    var locales, defaultLocale;
    module("ember-cli-i18n", {
      setup: function setup() {
        var localRegExp = new RegExp(config['default'].modulePrefix + "/locales/(.+)");
        var match, moduleName;

        locales = {};

        for (moduleName in requirejs.entries) {
          if (match = moduleName.match(localRegExp)) {
            locales[match[1]] = require(moduleName)["default"];
          }
        }

        defaultLocale = locales[config['default'].APP.defaultLocale];
      }
    });

    test("locales all contain the same keys", function () {
      var knownLocales = keys(locales);
      if (knownLocales.length === 1) {
        expect(0);
        return;
      }

      for (var i = 0, l = knownLocales.length; i < l; i++) {
        var currentLocale = locales[knownLocales[i]];

        if (currentLocale === defaultLocale) {
          continue;
        }

        for (var translationKey in defaultLocale) {
          ok(currentLocale[translationKey], "`" + translationKey + "` should exist in the `" + knownLocales[i] + "` locale.");
        }
      }
    });
  }

});
define('miume/tests/helpers/resolver', ['exports', 'ember/resolver', 'miume/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('miume/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('miume/tests/helpers/start-app', ['exports', 'ember', 'miume/app', 'miume/router', 'miume/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('miume/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('miume/tests/test-helper', ['miume/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('miume/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('miume/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:application', 'ApplicationAdapter', {});

  ember_qunit.test('it exists', function(assert) {
    var adapter;
    adapter = this.subject();
    return assert.ok(adapter);
  });

});
define('miume/tests/unit/adapters/youtube-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:youtube', 'YoutubeAdapter', {});

  ember_qunit.test('it exists', function(assert) {
    var adapter;
    adapter = this.subject();
    return assert.ok(adapter);
  });

});
define('miume/tests/unit/adapters/youtube/channel-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:youtube/channel', 'YoutubeChannelAdapter', {});

  ember_qunit.test('it exists', function(assert) {
    var adapter;
    adapter = this.subject();
    return assert.ok(adapter);
  });

});
define('miume/tests/unit/adapters/youtube/playlist-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:youtube/playlist', 'YoutubePlaylistAdapter', {});

  ember_qunit.test('it exists', function(assert) {
    var adapter;
    adapter = this.subject();
    return assert.ok(adapter);
  });

});
define('miume/tests/unit/adapters/youtube/video-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:youtube/video', 'YoutubeVideoAdapter', {});

  ember_qunit.test('it exists', function(assert) {
    var adapter;
    adapter = this.subject();
    return assert.ok(adapter);
  });

});
define('miume/tests/unit/components/lazy-scroll-load-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('lazy-scroll-load', {});

  ember_qunit.test('it renders', function(assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('miume/tests/unit/components/materialize-parallax-image-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('materialize-parallax-image', {});

  ember_qunit.test('it renders', function(assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('miume/tests/unit/components/materialize-parallax-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('materialize-parallax', {});

  ember_qunit.test('it renders', function(assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('miume/tests/unit/components/scroll-spy-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('scroll-spy', {});

  ember_qunit.test('it renders', function(assert) {
    var component;
    assert.expect(2);
    component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    return assert.equal(component._state, 'inDOM');
  });

});
define('miume/tests/unit/controllers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:application', {});

  ember_qunit.test('it exists', function(assert) {
    var controller;
    controller = this.subject();
    return assert.ok(controller);
  });

});
define('miume/tests/unit/models/youtube/channel-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('youtube/channel', {
    needs: []
  });

  ember_qunit.test('it exists', function(assert) {
    var model;
    model = this.subject();
    return assert.ok(!!model);
  });

});
define('miume/tests/unit/models/youtube/playlist-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('youtube/playlist', {
    needs: []
  });

  ember_qunit.test('it exists', function(assert) {
    var model;
    model = this.subject();
    return assert.ok(!!model);
  });

});
define('miume/tests/unit/models/youtube/video-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('youtube/video', {
    needs: []
  });

  ember_qunit.test('it exists', function(assert) {
    var model;
    model = this.subject();
    return assert.ok(!!model);
  });

});
define('miume/tests/unit/routes/about-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:about', {});

  ember_qunit.test('it exists', function(assert) {
    var route;
    route = this.subject();
    return assert.ok(route);
  });

});
define('miume/tests/unit/routes/contact-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:contact', {});

  ember_qunit.test('it exists', function(assert) {
    var route;
    route = this.subject();
    return assert.ok(route);
  });

});
define('miume/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:index', {});

  ember_qunit.test('it exists', function(assert) {
    var route;
    route = this.subject();
    return assert.ok(route);
  });

});
define('miume/tests/unit/routes/works-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:works', {});

  ember_qunit.test('it exists', function(assert) {
    var route;
    route = this.subject();
    return assert.ok(route);
  });

});
define('miume/tests/unit/serializers/youtube-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('serializer:youtube', {});

  ember_qunit.test('it exists', function(assert) {
    var serializer;
    serializer = this.subject();
    return assert.ok(serializer);
  });

});
define('miume/tests/unit/serializers/youtube/channel-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('serializer:youtube/channel', {});

  ember_qunit.test('it exists', function(assert) {
    var serializer;
    serializer = this.subject();
    return assert.ok(serializer);
  });

});
define('miume/tests/unit/serializers/youtube/playlist-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('serializer:youtube/playlist', {});

  ember_qunit.test('it exists', function(assert) {
    var serializer;
    serializer = this.subject();
    return assert.ok(serializer);
  });

});
define('miume/tests/unit/serializers/youtube/video-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('serializer:youtube/video', {});

  ember_qunit.test('it exists', function(assert) {
    var serializer;
    serializer = this.subject();
    return assert.ok(serializer);
  });

});
define('miume/tests/unit/utils/fun-ex-test', ['miume/utils/fun-ex', 'qunit'], function (funEx, qunit) {

  'use strict';

  qunit.module('funEx');

  qunit.test('it works', function(assert) {
    var result;
    result = funEx['default']();
    return assert.ok(result);
  });

});
define('miume/transforms/thumbnails', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var ThumbnailsTransform;

  ThumbnailsTransform = DS['default'].Transform.extend({
    deserialize: function(serialized) {
      return serialized;
    },
    serialize: function(deserialized) {
      return deserialized;
    }
  });

  exports['default'] = ThumbnailsTransform;

});
define('miume/transition', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';

  var transitionMap;

  transitionMap = function() {
    this.transition(this.fromRoute("index"), this.toRoute("about"), this.use("toDown"), this.reverse("toUp"));
    this.transition(this.fromRoute("about"), this.toRoute("works"), this.use("toDown"), this.reverse("toUp"));
    this.transition(this.fromRoute("works"), this.toRoute("contact"), this.use("toDown"), this.reverse("toUp"));
    this.transition(this.fromRoute("index"), this.toRoute("contact"), this.use("toDown"), this.reverse("toUp"));
    return this.transition(this.fromRoute("about"), this.toRoute("contact"), this.use("toDown"), this.reverse("toUp"));
  };

  exports['default'] = transitionMap;

});
define('miume/transitions/cross-fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = crossFade;
  // BEGIN-SNIPPET cross-fade-definition
  function crossFade(oldView, insertNewView, opts) {
    liquid_fire.stop(oldView);
    return insertNewView().then(function (newView) {
      return liquid_fire.Promise.all([liquid_fire.animate(oldView, { opacity: 0 }, opts), liquid_fire.animate(newView, { opacity: [1, 0] }, opts)]);
    });
  } // END-SNIPPET

});
define('miume/transitions/fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = fade;
  // BEGIN-SNIPPET fade-definition
  function fade(oldView, insertNewView, opts) {
    var firstStep,
        outOpts = opts;

    if (liquid_fire.isAnimating(oldView, "fade-out")) {
      // if the old view is already fading out, let it finish.
      firstStep = liquid_fire.finish(oldView, "fade-out");
    } else {
      if (liquid_fire.isAnimating(oldView, "fade-in")) {
        // if the old view is partially faded in, scale its fade-out
        // duration appropriately.
        outOpts = { duration: liquid_fire.timeSpent(oldView, "fade-in") };
      }
      liquid_fire.stop(oldView);
      firstStep = liquid_fire.animate(oldView, { opacity: 0 }, outOpts, "fade-out");
    }

    return firstStep.then(insertNewView).then(function (newView) {
      return liquid_fire.animate(newView, { opacity: [1, 0] }, opts, "fade-in");
    });
  } // END-SNIPPET

});
define('miume/transitions/flex-grow', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = flexGrow;
  function flexGrow(oldView, insertNewView, opts) {
    liquid_fire.stop(oldView);
    return insertNewView().then(function (newView) {
      return liquid_fire.Promise.all([liquid_fire.animate(oldView, { "flex-grow": 0 }, opts), liquid_fire.animate(newView, { "flex-grow": [1, 0] }, opts)]);
    });
  }

});
define('miume/transitions/modal-popup', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';



  exports['default'] = modalPopup;
  var Velocity = Ember['default'].$.Velocity;

  function hideModal(oldView) {
    var box, obscure;
    if (!oldView || !(box = oldView.$(".lm-container > div")) || !(box = box[0]) || !(obscure = oldView.$(".lf-overlay")) || !(obscure = obscure[0])) {
      return liquid_fire.Promise.resolve();
    }

    return liquid_fire.Promise.all([Velocity.animate(obscure, { opacity: [0, 0.5] }, { duration: 250 }), Velocity.animate(box, { scale: [0, 1] }, { duration: 250 })]);
  }

  function revealModal(insertNewView) {
    return insertNewView().then(function (newView) {
      var box, obscure;
      if (!newView || !(box = newView.$(".lm-container > div")[0]) || !(obscure = newView.$(".lf-overlay")[0])) {
        return;
      }

      // we're not going to animate the whole view, rather we're going
      // to animate two pieces of it separately. So we move the view
      // properties down onto the individual elements, so that the
      // animate function can reveal them at precisely the right time.
      Ember['default'].$(box).css({
        display: "none"
      });

      Ember['default'].$(obscure).css({
        display: "none"
      });
      newView.$().css({
        display: "",
        visibility: ""
      });

      return liquid_fire.Promise.all([Velocity.animate(obscure, { opacity: [0.5, 0] }, { duration: 250, display: "" }), Velocity.animate(box, { scale: [1, 0] }, { duration: 250, display: "" })]);
    });
  }
  function modalPopup(oldView, insertNewView) {
    return hideModal(oldView).then(function () {
      return revealModal(insertNewView);
    });
  }

});
define('miume/transitions/move-over', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  exports['default'] = moveOver;
  function moveOver(oldView, insertNewView, dimension, direction, opts) {
    var oldParams = {},
        newParams = {},
        firstStep,
        property,
        measure;

    if (dimension.toLowerCase() === "x") {
      property = "translateX";
      measure = "width";
    } else {
      property = "translateY";
      measure = "height";
    }

    if (liquid_fire.isAnimating(oldView, "moving-in")) {
      firstStep = liquid_fire.finish(oldView, "moving-in");
    } else {
      liquid_fire.stop(oldView);
      firstStep = liquid_fire.Promise.resolve();
    }

    return firstStep.then(insertNewView).then(function (newView) {
      if (newView && newView.$() && oldView && oldView.$()) {
        var sizes = [parseInt(newView.$().css(measure), 10), parseInt(oldView.$().css(measure), 10)];
        var bigger = Math.max.apply(null, sizes);
        oldParams[property] = bigger * direction + "px";
        newParams[property] = ["0px", -1 * bigger * direction + "px"];
      } else {
        oldParams[property] = 100 * direction + "%";
        newParams[property] = ["0%", -100 * direction + "%"];
      }

      return liquid_fire.Promise.all([liquid_fire.animate(oldView, oldParams, opts), liquid_fire.animate(newView, newParams, opts, "moving-in")]);
    });
  }

});
define('miume/transitions/scroll-then', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function () {
    Ember['default'].assert("You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')", "string" === typeof arguments[2]);

    var el = document.getElementsByTagName("html"),
        transitionArgs = Array.prototype.slice.call(arguments, 0, 2),
        nextTransition = this.lookup(arguments[2]),
        self = this,
        options = arguments[3] || {};

    Ember['default'].assert("The second argument to scrollThen is passed to Velocity's scroll function and must be an object", "object" === typeof options);

    // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
    options = Ember['default'].merge({ duration: 500, offset: 0 }, options);

    // additional args can be passed through after the scroll options object
    // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);
    transitionArgs.push.apply(transitionArgs, Array.prototype.slice.call(arguments, 4));

    return window.$.Velocity(el, "scroll", options).then(function () {
      nextTransition.apply(self, transitionArgs);
    });
  };

});
define('miume/transitions/to-down', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "y", 1);

});
define('miume/transitions/to-left', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "x", -1);

});
define('miume/transitions/to-right', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "x", 1);

});
define('miume/transitions/to-up', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "y", -1);

});
define('miume/utils/fun-ex', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FunEx,
    slice = [].slice;

  FunEx = (function() {
    function FunEx() {}

    FunEx.reverse = function(f) {
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return f.apply(this, args.reverse());
      };
    };

    FunEx.flip = function(f) {
      return function() {
        var arg1, arg2, rest;
        arg1 = arguments[0], arg2 = arguments[1], rest = 3 <= arguments.length ? slice.call(arguments, 2) : [];
        return f.apply(this, [arg2, arg1].concat(rest));
      };
    };

    FunEx.computed = function() {
      var deps, ff, fun, i;
      deps = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), fun = arguments[i++];
      ff = Ember['default'].computed(fun);
      return ff.property.apply(ff, deps);
    };

    FunEx.volatile = function(f) {
      return Ember['default'].computed(f).volatile();
    };

    FunEx.observed = function() {
      var fields, fun, i;
      fields = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), fun = arguments[i++];
      return fun.observes.apply(fun, fields);
    };

    FunEx.isBlank = Ember['default'].isBlank;

    FunEx.isPresent = function(x) {
      return !Ember['default'].isBlank(x);
    };

    return FunEx;

  })();

  exports['default'] = FunEx;

});
define('miume/views/liquid-child', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ContainerView.extend({
    classNames: ["liquid-child"],
    resolveInsertionPromise: Ember['default'].on("didInsertElement", function () {
      // Children start out hidden and invisible.
      // Measurement will `show` them and Velocity will make them visible.
      // This prevents a flash of pre-animated content.
      this.$().css({ visibility: "hidden" }).hide();
      if (this._resolveInsertion) {
        this._resolveInsertion(this);
      }
    })
  });

});
define('miume/views/liquid-if', ['exports', 'miume/views/liquid-outlet', 'ember'], function (exports, LiquidOutlet, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  exports['default'] = LiquidOutlet['default'].extend({
    liquidUpdate: Ember['default'].on("init", Ember['default'].observer("showFirst", function () {
      var template = this.get("templates")[this.get("showFirst") ? 0 : 1];
      if (!template || !isHTMLBars && template === Ember['default'].Handlebars.VM.noop) {
        this.set("currentView", null);
        return;
      }
      var view = Ember['default']._MetamorphView.create({
        container: this.container,
        template: template,
        liquidParent: this,
        contextBinding: "liquidParent.context",
        liquidContext: this.get("showFirst"),
        hasLiquidContext: true
      });
      this.set("currentView", view);
    }))

  });

});
define('miume/views/liquid-outlet', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';

  var capitalize = Ember['default'].String.capitalize;

  exports['default'] = Ember['default'].ContainerView.extend({
    classNames: ["liquid-container"],
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: "slide",
    enableGrowth: true,

    init: function init() {
      // The ContainerView constructor normally sticks our "currentView"
      // directly into _childViews, but we want to leave that up to
      // _currentViewDidChange so we have the opportunity to launch a
      // transition.
      this._super();
      Ember['default'].A(this._childViews).clear();

      if (this.get("containerless")) {
        // This prevents Ember from throwing an assertion when we try to
        // render as a virtual view.
        this.set("innerClassNameBindings", this.get("classNameBindings"));
        this.set("classNameBindings", Ember['default'].A());
      }
    },

    // Deliberately overriding a private method from
    // Ember.ContainerView!
    //
    // We need to stop it from destroying our outgoing child view
    // prematurely.
    _currentViewWillChange: Ember['default'].beforeObserver("currentView", function () {}),

    // Deliberately overriding a private method from
    // Ember.ContainerView!
    _currentViewDidChange: Ember['default'].on("init", Ember['default'].observer("currentView", function () {
      // Normally there is only one child (the view we're
      // replacing). But sometimes there may be two children (because a
      // transition is already in progress). In any case, we tell all of
      // them to start heading for the exits now.

      var oldView = this.get("childViews.lastObject"),
          newView = this.get("currentView"),
          firstTime;

      // For the convenience of the transition rules, we explicitly
      // track our first transition, which happens at initial render.
      firstTime = !this._hasTransitioned;
      this._hasTransitioned = true;

      // Idempotence
      if (!oldView && !newView || oldView && oldView.get("currentView") === newView || this._runningTransition && this._runningTransition.oldView === oldView && this._runningTransition.newContent === newView) {
        return;
      }

      // `transitions` comes from dependency injection, see the
      // liquid-fire app initializer.
      var transition = this.get("transitions").transitionFor(this, oldView, newView, this.get("use"), firstTime);

      if (this._runningTransition) {
        this._runningTransition.interrupt();
      }

      this._runningTransition = transition;
      transition.run()["catch"](function (err) {
        // Force any errors through to the RSVP error handler, because
        // of https://github.com/tildeio/rsvp.js/pull/278.  The fix got
        // into Ember 1.7, so we can drop this once we decide 1.6 is
        // EOL.
        Ember['default'].RSVP.Promise.resolve()._onerror(err);
      });
    })),

    _liquidChildFor: function _liquidChildFor(content) {
      if (content && !content.get("hasLiquidContext")) {
        content.set("liquidContext", content.get("context"));
      }
      var LiquidChild = this.container.lookupFactory("view:liquid-child");
      var childProperties = {
        currentView: content
      };
      if (this.get("containerless")) {
        childProperties.classNames = this.get("classNames").without("liquid-container");
        childProperties.classNameBindings = this.get("innerClassNameBindings");
      }
      return LiquidChild.create(childProperties);
    },

    _pushNewView: function _pushNewView(newView) {
      if (!newView) {
        return liquid_fire.Promise.resolve();
      }
      var child = this._liquidChildFor(newView),
          promise = new liquid_fire.Promise(function (resolve) {
        child._resolveInsertion = resolve;
      });
      this.pushObject(child);
      return promise;
    },

    cacheSize: function cacheSize() {
      var elt = this.$();
      if (elt) {
        // Measure original size.
        this._cachedSize = getSize(elt);
      }
    },

    unlockSize: function unlockSize() {
      var self = this;
      function doUnlock() {
        var elt = self.$();
        if (elt) {
          elt.css({ width: "", height: "" });
        }
      }
      if (this._scaling) {
        this._scaling.then(doUnlock);
      } else {
        doUnlock();
      }
    },

    _durationFor: function _durationFor(before, after) {
      return Math.min(this.get("growDuration"), 1000 * Math.abs(before - after) / this.get("growPixelsPerSecond"));
    },

    _adaptDimension: function _adaptDimension(dimension, before, after) {
      if (before[dimension] === after[dimension] || !this.get("enableGrowth")) {
        var elt = this.$();
        if (elt) {
          elt[dimension](after[dimension]);
        }
        return liquid_fire.Promise.resolve();
      } else {
        // Velocity deals in literal width/height, whereas jQuery deals
        // in box-sizing-dependent measurements.
        var target = {};
        target[dimension] = [after["literal" + capitalize(dimension)], before["literal" + capitalize(dimension)]];
        return liquid_fire.animate(this, target, {
          duration: this._durationFor(before[dimension], after[dimension]),
          queue: false,
          easing: this.get("growEasing")
        });
      }
    },

    adaptSize: function adaptSize() {
      liquid_fire.stop(this);

      var elt = this.$();
      if (!elt) {
        return;
      }

      // Measure new size.
      var newSize = getSize(elt);
      if (typeof this._cachedSize === "undefined") {
        this._cachedSize = newSize;
      }

      // Now that measurements have been taken, lock the size
      // before the invoking the scaling transition.
      elt.width(this._cachedSize.width);
      elt.height(this._cachedSize.height);

      this._scaling = liquid_fire.Promise.all([this._adaptDimension("width", this._cachedSize, newSize), this._adaptDimension("height", this._cachedSize, newSize)]);
    }

  });

  // We're tracking both jQuery's box-sizing dependent measurements and
  // the literal CSS properties, because it's nice to get/set dimensions
  // with jQuery and not worry about boz-sizing *but* Velocity needs the
  // raw values.
  function getSize(elt) {
    return {
      width: elt.width(),
      literalWidth: parseInt(elt.css("width"), 10),
      height: elt.height(),
      literalHeight: parseInt(elt.css("height"), 10)
    };
  }

});
define('miume/views/liquid-with', ['exports', 'miume/views/liquid-outlet', 'ember'], function (exports, LiquidOutlet, Ember) {

  'use strict';

  exports['default'] = LiquidOutlet['default'].extend({
    liquidUpdate: Ember['default'].on("init", Ember['default'].observer("boundContext", function () {
      var context = this.get("boundContext");
      if (Ember['default'].isEmpty(context)) {
        this.set("currentView", null);
        return;
      }
      var view = Ember['default']._MetamorphView.create({
        container: this.container,
        templateName: "liquid-with",
        boundContext: context,
        liquidWithParent: this,
        liquidContext: context,
        hasLiquidContext: true });
      this.set("currentView", view);
    }))

  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('miume/config/environment', ['ember'], function(Ember) {
  var prefix = 'miume';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("miume/tests/test-helper");
} else {
  require("miume/app")["default"].create({"name":"miume","version":"0.0.0.5571135b"});
}

/* jshint ignore:end */
//# sourceMappingURL=miume.map