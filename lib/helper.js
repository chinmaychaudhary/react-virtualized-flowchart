"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAddedOrRemovedItems = getAddedOrRemovedItems;
exports.getOverlayId = getOverlayId;
exports.getOverlays = getOverlays;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _map2 = _interopRequireDefault(require("lodash/map"));

function getAddedOrRemovedItems(prevItems, nextItems) {
  var prevMap = new Map(prevItems.map(function (i) {
    return [i.id, i];
  }));
  var nextMap = new Map(nextItems.map(function (i) {
    return [i.id, i];
  }));
  var itemsAdded = [];
  var itemsRemoved = [];
  var itemsUpdated = [];
  prevMap.forEach(function (value, id) {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });
  nextMap.forEach(function (value, id) {
    if (!prevMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
      itemsAdded.push(value);
    }
  });
  return {
    itemsAdded: itemsAdded,
    itemsRemoved: itemsRemoved,
    itemsUpdated: itemsUpdated
  };
}

function getOverlayId(edge, overlay) {
  var sourceId = edge.sourceId,
      targetId = edge.targetId;
  return "".concat(sourceId, "-").concat(targetId, "-").concat(overlay.id);
}

function getOverlays(edge) {
  var customOverlays = (0, _map2.default)(edge.customOverlays, function (customOverlay) {
    var id = customOverlay.id,
        location = customOverlay.location;
    return ["Custom", {
      create: function create() {
        var overlayDiv = document.createElement("div");
        overlayDiv.setAttribute("id", getOverlayId(edge, customOverlay));
        return overlayDiv;
      },
      location: location,
      id: id
    }];
  });
  return [].concat((0, _toConsumableArray2.default)(edge.overlays || []), (0, _toConsumableArray2.default)(customOverlays));
}