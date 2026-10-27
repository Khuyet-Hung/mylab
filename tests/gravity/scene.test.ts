import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createGravityScene } from '../../src/experiments/gravity/scene';

const state = vi.hoisted(() => ({ app: null as any, containers: [] as any[] }));
vi.mock('pixi.js', () => {
  class Container {
    children: any[] = [];
    listeners = new Map<string, Function>();
    position = { set: vi.fn() };
    scale = { set: vi.fn() };
    cursor = '';
    constructor() { state.containers.push(this); }
    addChild(child: any) { this.children.push(child); return child; }
    on(name: string, callback: Function) { this.listeners.set(name, callback); }
    removeAllListeners() { this.listeners.clear(); }
    toLocal(point: any) { return point; }
  }
  class Graphics extends Container {
    roundRect() { return this; } circle() { return this; }
    fill() { return this; } stroke() { return this; }
    moveTo() { return this; } lineTo() { return this; } clear() { return this; }
  }
  class Text extends Container { anchor = { set() {} }; constructor(_options: any) { super(); } }
  class Application {
    stage = new Container();
    canvas = Object.assign(new EventTarget(), { style: {}, setAttribute() {} });
    renderer = { render: vi.fn(), resize: vi.fn() };
    init = vi.fn(async () => {});
    stop = vi.fn();
    destroy = vi.fn();
    constructor() { state.app = this; }
  }
  return { Application, Container, Graphics, Text, Rectangle: class {} };
});

beforeEach(() => {
  state.containers = [];
  vi.stubGlobal('window', { devicePixelRatio: 1 });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
});
afterEach(() => vi.unstubAllGlobals());

it('recovers from native pointer cancellation and ignores cancellation for another pointer', async () => {
  const onHeightChange = vi.fn();
  const scene = await createGravityScene({ clientWidth: 900, appendChild() {} } as unknown as HTMLElement, { onHeightChange });
  const world = state.app.stage.children[0];
  const balls = world.children.filter((child: any) => child.listeners.has('pointerdown'));
  const start = (pointerId: number) => balls[0].listeners.get('pointerdown')({ pointerId, button: 0 });
  const move = (pointerId: number) => world.listeners.get('globalpointermove')({ pointerId, global: { y: 269 } });
  const cancel = (pointerId: number) => {
    const event = Object.assign(new Event('pointercancel'), { pointerId });
    state.app.canvas.dispatchEvent(event);
  };

  start(11);
  cancel(99);
  move(11);
  expect(onHeightChange).toHaveBeenLastCalledWith(10);
  expect(balls[0].cursor).toBe('grabbing');

  cancel(11);
  expect(balls[0].cursor).toBe('grab');
  onHeightChange.mockClear();
  move(11);
  expect(onHeightChange).not.toHaveBeenCalled();
  start(22);
  move(22);
  expect(onHeightChange).toHaveBeenCalledWith(10);

  const remove = vi.spyOn(state.app.canvas, 'removeEventListener');
  scene.destroy();
  expect(remove).toHaveBeenCalledWith('pointercancel', expect.any(Function));
  expect(state.app.destroy).toHaveBeenCalledWith(true, { children: true });
});
