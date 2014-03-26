var el,
    hammer,
    event;

module("Hammer Instance - On/Off Handler", {
  setup: function() {
    el= document.getElementById('toucharea');
  },
  teardown: function() {
    if ( hammer ) {
      hammer.dispose();
      hammer = null;
    }
  }
});

test("can enable/disable gesture event handler", function() {
  hammer = new Hammer(el);

  var wasCalled = false
  function handler() {
    wasCalled = true;
  };

  var touchEvent = document.createEvent('Event');
      touchEvent.initEvent('touch', true, true);
      touchEvent.gesture = { instance: hammer };

  hammer.on('touch', handler);
  el.dispatchEvent(touchEvent);
  ok(wasCalled, "handler called when registered with #on");

  // reset state
  wasCalled = false;

  hammer.off('touch', handler);
  el.dispatchEvent(touchEvent);
  ok(!wasCalled, "handler not called when removed with #off");
});

test("does not receive gesture events triggered from different hammer instance associated to parent element", function() {
  var parent = el,
      child = document.createElement('div');

  parent.appendChild(child);

  var parentHammer = new Hammer(parent),
      childHammer = new Hammer(child);

  var notCalled = true;
  childHammer.on('drag', function() {
    notCalled = false;
  });

  // init gesture on parent..
  event = document.createEvent('Event');
  event.initEvent('touchstart', true, true);
  event.touches = [{pageX: 0, pageY: 10}];
  parent.dispatchEvent(event);

  // ..and continue on child
  event = document.createEvent('Event');
  event.initEvent('touchmove', true, true);
  event.touches = [{pageX: 10, pageY: 10}];
  child.dispatchEvent(event);

  event = document.createEvent('Event');
  event.initEvent('touchend', true, true);
  event.touches = [];
  child.dispatchEvent(event);

  ok(notCalled, 'gesture events are not triggered on child instance when recognized by parent instance');
});

