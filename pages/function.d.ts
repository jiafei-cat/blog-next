declare global {
  type RangeNumber<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>


export {}