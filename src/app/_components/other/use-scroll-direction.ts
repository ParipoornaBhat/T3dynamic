
import { useState, useEffect } from "react"

type ScrollDirection = "up" | "down" | "none"

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("none")
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolled down
        setScrollDirection("down")
      } else if (currentScrollY < lastScrollY) {
        // Scrolled up
        setScrollDirection("up")
      } else if (currentScrollY <= 50) {
        // At or near the top
        setScrollDirection("none")
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return scrollDirection
}
