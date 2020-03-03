"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAddedOrRemovedItems = getAddedOrRemovedItems;

function getAddedOrRemovedItems(prevItems, nextItems) {
  var prevMap = new Map(
    prevItems.map(function(i) {
      return [i.id, i];
    })
  );
  var nextMap = new Map(
    nextItems.map(function(i) {
      return [i.id, i];
    })
  );
  var itemsAdded = [];
  var itemsRemoved = [];
  var itemsUpdated = [];
  prevMap.forEach(function(value, id) {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });
  nextMap.forEach(function(value, id) {
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
