# Two objects in free fall

Drop two objects together from the same height: in this model they stay side by side and reach the ground together, even when their masses differ. Air resistance is neglected, so mass does not change their motion. Real objects can behave differently in air.

## Scientific assumptions

- Both objects start at the same release height, at the same time, with initial velocity **0 m/s**.
- A uniform gravitational field supplies constant downward acceleration **g = 9.8 m/s²**.
- Release height is **2–20 m**, inclusive. Each mass is **0.1–10 kg**, inclusive.
- Motion is vertical and displayed in 2D. Horizontal placement only separates the objects visually.
- No air resistance or friction is included.

The reference is [OpenStax College Physics 2e, 2.7 Falling Objects](https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects). It explains constant, mass-independent acceleration when resistance is negligible, and the sign convention for gravity.

## Equations and units

Measure displacement and velocity as positive downward from the release point. Height above the ground is a separate, nonnegative quantity. Use SI units throughout: metres, seconds, kilograms, and metres per second.

For elapsed fall time t and release height h:

- Downward velocity: **v = gt**.
- Downward distance: **distance = ½gt²**.
- Time to ground: **fallTime = sqrt(2h/g)**.
- Remaining height: **height = h − distance**.

Mass does not appear in these equations. For example, from 19.6 m, either mass falls 4.9 m in the first second, with speed 9.8 m/s; both reach the ground at 2 s with impact speed 19.6 m/s.

## Model contract

`GravityInput` contains `heightM`, `massKg`, and `gravityMps2`. Validation rejects non-finite values, heights or masses outside the inclusive ranges above, and any gravity other than 9.8. Invalid inputs or negative/non-finite sampling times throw `RangeError`.

`sampleGravity` is a deterministic analytical sample, independent of frame rate. Its `GravitySnapshot` contains `timeS`, remaining `heightM`, downward `distanceM`, downward `velocityMps`, and `landed`. Sampling at or after impact clamps time to `fallTime`, distance to the release height, and height to zero. Velocity then retains the impact speed; it does not describe motion after a collision. `landed` is true at impact and thereafter.

The two-object comparison calls the same model with a shared height and elapsed time and independently chosen masses. Both the numerical UI and PixiJS scene must consume these snapshots. Rendering defines a separate metres-to-pixels mapping; pixel scale never enters these equations. GSAP may animate presentation but must not change scientific state.

## Excluded phenomena

This model does not simulate drag, buoyancy, wind, object shape or size, rotation, horizontal motion, collisions between objects, bouncing, deformation, ground-contact forces, changes in gravity with height or location, or relativistic effects. It ends at first ground contact and is not a general-purpose physics engine.
