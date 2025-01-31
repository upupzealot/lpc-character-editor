export function renderOrder(direction: string) {
  const directionOders = {
    down: [
      'body',
      'weapon',
      'body.chest',
      'body.arm1',
      'body.arm2',
      'body.head',
      'lower',
      'upper',
      'hair',
      'ear',
      'eye',
    ],
    left: [
      'body',
      'body.arm1',
      'weapon',
      'body.hands',
      'body.arm2',
      'lower',
      'upper',
      'hair',
      'ear',
      'eye',
    ],
    right: [
      'body',
      'body.arm1',
      'weapon',
      'body.hands',
      'body.arm2',
      'lower',
      'upper',
      'hair',
      'ear',
      'eye',
    ],
    up: ['weapon', 'body', 'lower', 'upper', 'hair', 'ear', 'eye'],
  } as { [k: string]: string[] }
  return directionOders[direction]
}
