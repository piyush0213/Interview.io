var isNode = typeof process !== void 0;
if (isNode) {
  global.requestAnimationFrame = function() {};
  global.window = {};
  global.document = {};
}
