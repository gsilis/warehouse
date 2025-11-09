import { type MouseEventHandler } from "react";

type BoxProps = {
  id: number,
  occupied?: boolean,
  onToggle: (state: boolean) => void,
};

export function Box({
  id,
  occupied = false,
  onToggle,
}: BoxProps) {
  const classes = (() => {
    const c = [
      'aspect-square',
      'justify-center',
      'flex',
      'items-center',
      'text-2xl',
      'border-2',
      'rounded-md',
      'cursor-pointer',
      'hover:scale-115',
      'hover:shadow-xl',
      'transition-all',
      'select-none',
    ];

    if (occupied) {
      c.push('border-sky-400/70', 'border-solid');
    } else {
      c.push('border-sky-400/50', 'border-dotted');
    }

    return c.join(' ');
  })();

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    onToggle(!occupied);
  };

  return <div className={ classes } onClick={ onClick }>{ id }</div>;
}