// Bind-pose offsets in the same game units as the 7.2-unit sculpt.
// Animation adds offsets to this pose; it must never restore the old squat rig.
export const HERO_PROPORTIONS = Object.freeze({
  height: 7.2, pelvisY: 3.7, torsoY: 0.3,
  shoulderX: 0.93, shoulderY: 1.95, elbowY: -1.47, wristY: -1.1,
  hipX: 0.48, kneeY: -1.79, ankleY: -1.61,
  neckY: 2.2, headY: 0.46, headScale: 0.4064, handScale: 0.6,
});
