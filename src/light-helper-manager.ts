import { Color, PointLightHelper, SpotLightHelper, type PointLight, type Scene, type SpotLight } from "three";

const COLOR = (new Color()).setHex(0xFFFF00);

export class LightHelperManager {
  private state: boolean;
  private scene: Scene;
  private pointLights: PointLight[] = [];
  private spotLights: SpotLight[] = [];
  private helpers: (SpotLightHelper | PointLightHelper)[] = [];

  constructor(scene: Scene, state: boolean) {
    this.scene = scene;
    this.state = state;
  }

  addPointLight(...pointLights: PointLight[]) {
    this.pointLights.push(...pointLights);
    const newHelpers = pointLights.map((light) => {
      const helper = new PointLightHelper(light, 1, COLOR);
      this.helpers.push(helper);
      return helper;
    });

    this.applyStateToHelpers(...newHelpers);
  }

  addSpotLight(...spotLights: SpotLight[]) {
    this.spotLights.push(...spotLights);
    const newHelpers = spotLights.map((light) => {
      const helper = new SpotLightHelper(light, COLOR);
      this.helpers.push(helper);
      return helper;
    });

    this.applyStateToHelpers(...newHelpers);
  }

  toggle(state: boolean) {
    this.state = state;
    this.applyStateToHelpers(...this.helpers);
  }

  private applyStateToHelpers(...helpers: (SpotLightHelper | PointLightHelper)[]) {
    helpers.forEach((helper) => {
      this.state ? this.scene.add(helper) : this.scene.remove(helper);
    });
  }
}