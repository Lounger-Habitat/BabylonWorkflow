import "babylonjs-materials"; //Import this to use the materials library (water, smoke etc)
import "babylonjs-procedural-textures"; //Import this to use procecural textures
import "babylonjs-loaders"; //this is for when you export in a format other than .babylon
import "babylonjs-gui"; //this allows you to use the BabylonJsGui

import {
  Engine,
  Scene,
  SceneLoader,
  Tools
} from "babylonjs";

import { Extensions } from "babylonjs-editor";

export default class Game {
  // Public members
  public engine: Engine;
  public canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById("renderCanvas")
  );

  public scene: Scene = null;

  /**
   * Constructor
   */
  constructor() {
    // Create engine
    this.engine = new Engine(this.canvas, true, {
      // Options
    });

    // Events
    window.addEventListener("resize", () => this.engine.resize());
  }

  /**
   * Runs the game
   */
  public run(): void {
    // Load Scene
    const rainyDay = `./scenes/Rainy-Scene/`;
    const spaceScene = `./scenes/SkyBox-Scene/`;
    let currentScene = rainyDay;
    SceneLoader.Load(
      `${currentScene}`,
      "scene.babylon",
      this.engine,
      (scene: Scene) => {
        this.scene = scene;

        // No camera?
        if (!this.scene.activeCamera) {
          this.scene.createDefaultCamera(false, true, true);
        }

        // No light?
        if (!this.scene.lights.length) {
          this.scene.createDefaultLight();
        }

        // Attach camera
        this.scene.activeCamera.attachControl(this.canvas, true);

        // Load extensions
        Tools.LoadFile(`${currentScene}/project.editorproject`, (data: string) => {
          // Apply extensions (such as custom code, custom materials etc.)
          Extensions.RoolUrl = currentScene;
          Extensions.ApplyExtensions(this.scene, JSON.parse(data));

          // Run render loop
          this.engine.runRenderLoop(() => {
            this.scene.render();
          });
        });
      }
    );
  }
}
