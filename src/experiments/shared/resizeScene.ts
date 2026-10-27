import { Container, Text, type Application } from "pixi.js";

export type SceneSize = { width: number; height: number };

const baseFontSizes = new WeakMap<Text, number>();

/** Resize a Pixi scene and regenerate every nested Text texture for its display scale. */
export function resizeExperimentScene(
  app: Application,
  world: Container,
  host: HTMLElement,
  logicalSize: SceneSize,
): void {
  const displayWidth = Math.max(1, host.clientWidth || logicalSize.width);
  const scale = displayWidth / logicalSize.width;
  app.renderer.resize(displayWidth, displayWidth * logicalSize.height / logicalSize.width);
  world.scale.set(scale);

  // Pixi Text is a raster texture. Renderer DPI alone does not account for
  // the extra scale applied to the logical scene after it has been created.
  const rendererResolution = Number(app.renderer.resolution) || 1;
  const textResolution = Math.min(
    6,
    Math.max(2, Math.ceil(scale * rendererResolution)),
  );
  const updateText = (container: Container) => {
    for (const child of container.children) {
      if (child instanceof Text) {
        const baseSize = baseFontSizes.get(child) ?? Number(child.style?.fontSize);
        if (Number.isFinite(baseSize)) {
          baseFontSizes.set(child, baseSize);
          // Keep labels legible when a wide logical scene is reduced on phones.
          const fontSize = Math.min(baseSize * 3, Math.max(baseSize, 12 / scale));
          if (Math.abs(Number(child.style.fontSize) - fontSize) > 0.1) {
            child.style.fontSize = fontSize;
          }
        }
        if (child.resolution !== textResolution) child.resolution = textResolution;
      }
      if (child instanceof Container) updateText(child);
    }
  };
  updateText(world);
}
