import { useRef } from "react"

export function Viewer() {
  const elementRef = useRef<HTMLDivElement>(null);

  return <div ref={ elementRef } className="flex-1 overflow-hidden"></div>
}