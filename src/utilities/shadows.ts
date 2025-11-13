import type { Group, Object3D, Object3DEventMap, Scene } from "three";

export function enableShadowsForGroup(group: Group<Object3DEventMap>) {
  group.children.forEach(o => enableShadowsForObject(o));
}

export function enableShadowsForObject(object: Object3D<Object3DEventMap>) {
  object.castShadow = true;
  object.receiveShadow = true;
  object.children.forEach(enableShadowsForObject);
}