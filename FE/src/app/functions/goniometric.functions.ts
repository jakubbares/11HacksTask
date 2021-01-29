export function vector(x, y, tx, ty) {
  const diffx = tx - x;
  const diffy = ty - y;
  return { diffx, diffy }
}

export function perpendidular(vx, vy) {
  return { vx: -vy, vy: vx }
}

export function hypotenuse(vx, vy) {
  return Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2))
}

export function normalized(vx, vy, coef) {
  return  {mx: (vx / hypotenuse(vx, vy)) * coef, my: (vy / hypotenuse(vx, vy)) * coef };
}
