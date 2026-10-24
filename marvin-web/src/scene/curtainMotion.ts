const bounded = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

// The rail follows scroll exactly. Only the free cloth responds to an impulse,
// so fabric inertia cannot postpone the doorway/camera choreography.
export function createCurtainMotion(initialOpening: number) {
  let previousOpening = initialOpening;
  let displacement = 0;
  let velocity = 0;
  return {
    step(opening: number, elapsed: number) {
      velocity = bounded(velocity + (opening - previousOpening) * 2.8, 1.4);
      previousOpening = opening;
      const dt = Math.max(0, Math.min(elapsed, .05));
      // Exact underdamped oscillator solution: stable across variable frames.
      const damping = 4.8, frequency = 11;
      const decay = Math.exp(-damping * dt);
      const cosine = Math.cos(frequency * dt), sine = Math.sin(frequency * dt);
      const auxiliary = (velocity + damping * displacement) / frequency;
      const next = decay * (displacement * cosine + auxiliary * sine);
      velocity = decay * ((auxiliary * frequency - damping * displacement) * cosine
        - (displacement * frequency + damping * auxiliary) * sine);
      displacement = bounded(next, .13);
      const active = Math.abs(displacement) > .00025 || Math.abs(velocity) > .002;
      if (!active) { displacement = 0; velocity = 0; }
      return { displacement, active };
    },
  };
}

export function curtainVertex(u: number, v: number, opening: number, sway = 0) {
  const width = 1 - opening * .81;
  // Nonuniform gathering and a slightly flared hem preserve a fabric silhouette.
  const rail = u + .013 * Math.sin(u * Math.PI * 4) * opening;
  const weight = v * v;
  const foldPhase = u * Math.PI * 14 + v ** 1.5 * (1.2 * Math.sin(u * 11) + .6 * Math.sin(v * 4));
  const fold = Math.cos(foldPhase) + .19 * Math.cos(foldPhase * 2 + .4);
  const amplitude = (.033 + opening * .031) * (.82 + .18 * Math.sin(u * 21 + 1) ** 2);
  const flare = opening * .085 * Math.sin(u * Math.PI) * weight;
  const drape = .025 * Math.sin(v * Math.PI) * Math.sin(u * 7)
    + .055 * Math.sin(opening * Math.PI) * weight * Math.sin(u * Math.PI / 2);
  // Fade secondary movement once gathered, keeping the clear doorway clear.
  const movement = sway * (1 - opening * .65) * weight;
  return {
    x: .44 + rail * width + flare + drape + movement * Math.sin(u * Math.PI / 2),
    y: 2.99 - v * 2.77 - .018 * Math.sin(u * Math.PI * 12) ** 2 * (1 - v)
      + (.009 * Math.cos(foldPhase + .5) + .016 * Math.sin(u * 19) + .018 * Math.sin(u * 7 + 1)) * v ** 8
      + Math.abs(movement) * .18,
    z: .87 + fold * amplitude * (.65 + .35 * v)
      + .012 * Math.sin(v * 8 + u * 11) * v + movement * Math.sin(v * 4 + u * 7),
  };
}
